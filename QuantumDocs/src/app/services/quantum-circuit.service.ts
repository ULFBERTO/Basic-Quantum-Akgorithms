import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuantumCircuit, CircuitGate, QuantumGate, SimulationResult } from '../models/quantum-behavior.model';

@Injectable({
  providedIn: 'root'
})
export class QuantumCircuitService {
  private currentCircuit = new BehaviorSubject<QuantumCircuit | null>(null);
  public currentCircuit$ = this.currentCircuit.asObservable();

  private availableGates: QuantumGate[] = [
    {
      id: 'h',
      name: 'Hadamard',
      type: 'single',
      symbol: 'H',
      color: '#9333EA',
      description: 'Crea superposición: (|0⟩ + |1⟩)/√2',
      matrix: [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]]
    },
    {
      id: 'x',
      name: 'Pauli-X',
      type: 'single',
      symbol: 'X',
      color: '#F97316',
      description: 'NOT cuántico: |0⟩ ↔ |1⟩',
      matrix: [[0, 1], [1, 0]]
    },
    {
      id: 'y',
      name: 'Pauli-Y',
      type: 'single',
      symbol: 'Y',
      color: '#EC4899',
      description: 'Rotación Y: i|1⟩ cuando se aplica a |0⟩',
      matrix: [[0, -1], [1, 0]]
    },
    {
      id: 'z',
      name: 'Pauli-Z',
      type: 'single',
      symbol: 'Z',
      color: '#10B981',
      description: 'Cambio de fase: |1⟩ → -|1⟩',
      matrix: [[1, 0], [0, -1]]
    },
    {
      id: 'cx',
      name: 'CNOT',
      type: 'multi',
      symbol: 'CX',
      color: '#0EA5E9',
      description: 'NOT controlado: entrelazamiento',
    },
    {
      id: 'cz',
      name: 'CZ',
      type: 'multi',
      symbol: 'CZ',
      color: '#06B6D4',
      description: 'Z controlado',
    },
    {
      id: 'swap',
      name: 'SWAP',
      type: 'multi',
      symbol: '⨉',
      color: '#8B5CF6',
      description: 'Intercambia estados de dos qubits',
    }
  ];

  constructor() {
    this.initializeDefaultCircuit();
  }

  private initializeDefaultCircuit(): void {
    const defaultCircuit: QuantumCircuit = {
      id: this.generateId(),
      name: 'Nuevo Circuito',
      description: 'Circuito cuántico vacío',
      qubits: 2,
      gates: [],
      measurements: [0, 1],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.currentCircuit.next(defaultCircuit);
  }

  getAvailableGates(): QuantumGate[] {
    return this.availableGates;
  }

  getGateById(id: string): QuantumGate | undefined {
    return this.availableGates.find(gate => gate.id === id);
  }

  createCircuit(qubits: number, name: string = 'Nuevo Circuito'): QuantumCircuit {
    const circuit: QuantumCircuit = {
      id: this.generateId(),
      name,
      description: '',
      qubits,
      gates: [],
      measurements: Array.from({ length: qubits }, (_, i) => i),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.currentCircuit.next(circuit);
    return circuit;
  }

  addGate(gateId: string, qubitTargets: number[], controlQubits?: number[]): void {
    const circuit = this.currentCircuit.value;
    if (!circuit) return;

    const gate: CircuitGate = {
      gateId,
      qubitTargets,
      controlQubits,
      position: circuit.gates.length
    };

    circuit.gates.push(gate);
    circuit.updatedAt = new Date();
    this.currentCircuit.next(circuit);
  }

  removeGate(position: number): void {
    const circuit = this.currentCircuit.value;
    if (!circuit) return;

    circuit.gates = circuit.gates.filter(g => g.position !== position);
    // Reindexar posiciones
    circuit.gates.forEach((g, idx) => g.position = idx);
    circuit.updatedAt = new Date();
    this.currentCircuit.next(circuit);
  }

  updateCircuit(circuit: QuantumCircuit): void {
    circuit.updatedAt = new Date();
    this.currentCircuit.next(circuit);
  }

  clearCircuit(): void {
    const circuit = this.currentCircuit.value;
    if (!circuit) return;

    circuit.gates = [];
    circuit.updatedAt = new Date();
    this.currentCircuit.next(circuit);
  }

  addQubit(): void {
    const circuit = this.currentCircuit.value;
    if (!circuit) return;

    circuit.qubits++;
    circuit.measurements.push(circuit.qubits - 1);
    circuit.updatedAt = new Date();
    this.currentCircuit.next(circuit);
  }

  removeQubit(): void {
    const circuit = this.currentCircuit.value;
    if (!circuit || circuit.qubits <= 1) return;

    circuit.qubits--;
    circuit.measurements = circuit.measurements.filter(m => m < circuit.qubits);
    // Remover gates que afectan al qubit eliminado
    circuit.gates = circuit.gates.filter(g => 
      g.qubitTargets.every(t => t < circuit.qubits) &&
      (!g.controlQubits || g.controlQubits.every(c => c < circuit.qubits))
    );
    circuit.updatedAt = new Date();
    this.currentCircuit.next(circuit);
  }

  // Simulación básica (placeholder - en producción conectar con backend Python)
  async simulateCircuit(circuit: QuantumCircuit, shots: number = 1000): Promise<SimulationResult> {
    // Simulación mock - en producción llamar a API Python/Qiskit
    await this.delay(500);

    const result: SimulationResult = {
      circuitId: circuit.id,
      counts: this.generateMockCounts(circuit, shots),
      probabilities: {},
      executionTime: Math.random() * 100
    };

    // Calcular probabilidades
    Object.keys(result.counts).forEach(state => {
      result.probabilities[state] = result.counts[state] / shots;
    });

    return result;
  }

  private generateMockCounts(circuit: QuantumCircuit, shots: number): { [state: string]: number } {
    const counts: { [state: string]: number } = {};
    const numStates = Math.pow(2, circuit.qubits);

    // Distribución basada en las puertas del circuito
    const hasHadamard = circuit.gates.some(g => g.gateId === 'h');
    const hasCNOT = circuit.gates.some(g => g.gateId === 'cx');

    if (hasHadamard && hasCNOT) {
      // Simular entrelazamiento (Bell state)
      const state1 = '0'.repeat(circuit.qubits);
      const state2 = '1'.repeat(circuit.qubits);
      counts[state1] = Math.floor(shots / 2);
      counts[state2] = shots - counts[state1];
    } else if (hasHadamard) {
      // Superposición uniforme
      for (let i = 0; i < numStates; i++) {
        const state = i.toString(2).padStart(circuit.qubits, '0');
        counts[state] = Math.floor(shots / numStates);
      }
    } else {
      // Estado base
      counts['0'.repeat(circuit.qubits)] = shots;
    }

    return counts;
  }

  exportToQiskit(circuit: QuantumCircuit): string {
    let code = `from qiskit import QuantumCircuit\n\n`;
    code += `# ${circuit.name}\n`;
    code += `qc = QuantumCircuit(${circuit.qubits}, ${circuit.qubits})\n\n`;

    circuit.gates.forEach(gate => {
      const gateInfo = this.getGateById(gate.gateId);
      if (!gateInfo) return;

      if (gate.controlQubits && gate.controlQubits.length > 0) {
        code += `qc.${gate.gateId}(${gate.controlQubits[0]}, ${gate.qubitTargets[0]})\n`;
      } else {
        code += `qc.${gate.gateId}(${gate.qubitTargets.join(', ')})\n`;
      }
    });

    code += `\nqc.measure(range(${circuit.qubits}), range(${circuit.qubits}))\n`;
    return code;
  }

  private generateId(): string {
    return `circuit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
