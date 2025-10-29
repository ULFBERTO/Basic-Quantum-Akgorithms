import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SavedConfiguration, QuantumCircuit, SimulationResult } from '../models/quantum-behavior.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'quantum_configurations';
  private configurations = new BehaviorSubject<SavedConfiguration[]>([]);
  public configurations$ = this.configurations.asObservable();

  constructor() {
    this.loadConfigurations();
  }

  private loadConfigurations(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const configs = JSON.parse(stored);
        // Convertir strings de fecha a objetos Date
        configs.forEach((config: any) => {
          config.createdAt = new Date(config.createdAt);
          config.updatedAt = new Date(config.updatedAt);
          if (config.circuit) {
            config.circuit.createdAt = new Date(config.circuit.createdAt);
            config.circuit.updatedAt = new Date(config.circuit.updatedAt);
          }
        });
        this.configurations.next(configs);
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
      this.configurations.next([]);
    }
  }

  private saveToLocalStorage(configs: SavedConfiguration[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configs));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  saveConfiguration(config: SavedConfiguration): void {
    const configs = this.configurations.value;
    const existingIndex = configs.findIndex(c => c.id === config.id);

    if (existingIndex >= 0) {
      configs[existingIndex] = { ...config, updatedAt: new Date() };
    } else {
      configs.push(config);
    }

    this.configurations.next(configs);
    this.saveToLocalStorage(configs);
  }

  getConfiguration(id: string): SavedConfiguration | undefined {
    return this.configurations.value.find(c => c.id === id);
  }

  deleteConfiguration(id: string): void {
    const configs = this.configurations.value.filter(c => c.id !== id);
    this.configurations.next(configs);
    this.saveToLocalStorage(configs);
  }

  getAllConfigurations(): SavedConfiguration[] {
    return this.configurations.value;
  }

  searchConfigurations(query: string): SavedConfiguration[] {
    const lowerQuery = query.toLowerCase();
    return this.configurations.value.filter(config =>
      config.name.toLowerCase().includes(lowerQuery) ||
      config.description.toLowerCase().includes(lowerQuery) ||
      config.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  exportConfiguration(id: string): string {
    const config = this.getConfiguration(id);
    if (!config) throw new Error('Configuration not found');
    return JSON.stringify(config, null, 2);
  }

  importConfiguration(jsonString: string): SavedConfiguration {
    try {
      const config = JSON.parse(jsonString) as SavedConfiguration;
      config.id = this.generateId();
      config.createdAt = new Date();
      config.updatedAt = new Date();
      this.saveConfiguration(config);
      return config;
    } catch (error) {
      throw new Error('Invalid configuration format');
    }
  }

  exportAllConfigurations(): string {
    return JSON.stringify(this.configurations.value, null, 2);
  }

  clearAllConfigurations(): void {
    this.configurations.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Métodos para exportar a diferentes formatos
  exportToJSON(config: SavedConfiguration): Blob {
    const json = JSON.stringify(config, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  exportToPython(config: SavedConfiguration): Blob {
    let code = `# ${config.name}\n`;
    code += `# ${config.description}\n\n`;
    code += `from qiskit import QuantumCircuit\n\n`;
    code += `qc = QuantumCircuit(${config.circuit.qubits}, ${config.circuit.qubits})\n\n`;

    config.circuit.gates.forEach(gate => {
      if (gate.controlQubits && gate.controlQubits.length > 0) {
        code += `qc.${gate.gateId}(${gate.controlQubits[0]}, ${gate.qubitTargets[0]})\n`;
      } else {
        code += `qc.${gate.gateId}(${gate.qubitTargets.join(', ')})\n`;
      }
    });

    code += `\nqc.measure(range(${config.circuit.qubits}), range(${config.circuit.qubits}))\n`;

    return new Blob([code], { type: 'text/plain' });
  }

  private generateId(): string {
    return `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Estadísticas
  getStatistics(): {
    totalConfigurations: number;
    totalCircuits: number;
    averageQubits: number;
    mostUsedGates: { [key: string]: number };
  } {
    const configs = this.configurations.value;
    const totalConfigurations = configs.length;
    const totalCircuits = configs.length;
    
    let totalQubits = 0;
    const gateCount: { [key: string]: number } = {};

    configs.forEach(config => {
      totalQubits += config.circuit.qubits;
      config.circuit.gates.forEach(gate => {
        gateCount[gate.gateId] = (gateCount[gate.gateId] || 0) + 1;
      });
    });

    return {
      totalConfigurations,
      totalCircuits,
      averageQubits: totalCircuits > 0 ? totalQubits / totalCircuits : 0,
      mostUsedGates: gateCount
    };
  }
}
