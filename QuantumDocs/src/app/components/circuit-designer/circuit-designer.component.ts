import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantumCircuitService } from '../../services/quantum-circuit.service';
import { StorageService } from '../../services/storage.service';
import { QuantumGate, QuantumCircuit, CircuitGate, SimulationResult, SavedConfiguration } from '../../models/quantum-behavior.model';
import { BlochSphereComponent } from '../bloch-sphere/bloch-sphere.component';
import { SavedCircuitsModalComponent } from '../saved-circuits-modal/saved-circuits-modal.component';

@Component({
  selector: 'app-circuit-designer',
  standalone: true,
  imports: [CommonModule, BlochSphereComponent, SavedCircuitsModalComponent],
  templateUrl: './circuit-designer.component.html',
  styleUrl: './circuit-designer.component.scss'
})
export class CircuitDesignerComponent implements OnInit {
  singleQubitGates: QuantumGate[] = [];
  multiQubitGates: QuantumGate[] = [];
  selectedGate: QuantumGate | null = null;
  
  currentCircuit: QuantumCircuit | null = null;
  qubits: number[] = [];
  qiskitCode: string = '';
  simulationResult: SimulationResult | null = null;
  showSavedCircuitsModal: boolean = false;

  constructor(
    private circuitService: QuantumCircuitService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const gates = this.circuitService.getAvailableGates();
    this.singleQubitGates = gates.filter(g => g.type === 'single');
    this.multiQubitGates = gates.filter(g => g.type === 'multi');

    this.circuitService.currentCircuit$.subscribe(circuit => {
      this.currentCircuit = circuit;
      if (circuit) {
        this.qubits = Array.from({ length: circuit.qubits }, (_, i) => i);
        this.updateQiskitCode();
      }
    });
  }

  selectGate(gate: QuantumGate): void {
    this.selectedGate = gate;
  }

  addQubit(): void {
    this.circuitService.addQubit();
  }

  removeQubit(): void {
    this.circuitService.removeQubit();
  }

  clearCircuit(): void {
    this.circuitService.clearCircuit();
    this.simulationResult = null;
  }

  async simulateCircuit(): Promise<void> {
    if (!this.currentCircuit) return;
    
    this.simulationResult = await this.circuitService.simulateCircuit(this.currentCircuit);
  }

  saveCircuit(): void {
    if (!this.currentCircuit) return;

    const config: SavedConfiguration = {
      id: `config_${Date.now()}`,
      name: this.currentCircuit.name,
      description: this.currentCircuit.description,
      circuit: this.currentCircuit,
      visualization: {
        id: 'viz_' + Date.now(),
        algorithmId: this.currentCircuit.id,
        type: '3d',
        theme: 'dark',
        showGrid: false,
        showAxes: true,
        cameraSettings: {
          position: { x: 3, y: 3, z: 3 },
          target: { x: 0, y: 0, z: 0 },
          fov: 75,
          near: 0.1,
          far: 1000
        },
        renderSettings: {
          antialias: true,
          shadows: false,
          ambientLight: 0.6,
          directionalLight: 0.8,
          backgroundColor: '#0A0E1A'
        }
      },
      results: this.simulationResult || undefined,
      tags: ['custom', 'circuit'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.storageService.saveConfiguration(config);
    alert('Circuito guardado exitosamente!');
  }

  getGatesForQubit(qubitIndex: number): CircuitGate[] {
    if (!this.currentCircuit) return [];
    return this.currentCircuit.gates.filter(g => g.qubitTargets.includes(qubitIndex));
  }

  getGateSymbol(gateId: string): string {
    const gate = this.circuitService.getGateById(gateId);
    return gate?.symbol || gateId.toUpperCase();
  }

  getGateColor(gateId: string): string {
    const gate = this.circuitService.getGateById(gateId);
    return gate?.color || '#666666';
  }

  getStateKeys(): string[] {
    if (!this.simulationResult) return [];
    return Object.keys(this.simulationResult.probabilities);
  }

  private updateQiskitCode(): void {
    if (this.currentCircuit) {
      this.qiskitCode = this.circuitService.exportToQiskit(this.currentCircuit);
    }
  }

  // Drag & Drop functionality
  onDragStart(event: DragEvent, gate: QuantumGate): void {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('gate', JSON.stringify(gate));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDrop(event: DragEvent, qubitIndex: number): void {
    event.preventDefault();
    const gateData = event.dataTransfer?.getData('gate');
    if (gateData && this.currentCircuit) {
      try {
        const gate: QuantumGate = JSON.parse(gateData);
        
        if (gate.type === 'single') {
          this.circuitService.addGate(gate.id, [qubitIndex]);
        } else if (gate.type === 'multi' && qubitIndex < this.currentCircuit.qubits - 1) {
          // Para puertas multi-qubit, usar el qubit actual como control y el siguiente como target
          this.circuitService.addGate(gate.id, [qubitIndex + 1], [qubitIndex]);
        }
        
        this.updateQiskitCode();
      } catch (error) {
        console.error('Error al agregar puerta:', error);
      }
    }
  }

  removeGateAt(position: number): void {
    this.circuitService.removeGate(position);
    this.updateQiskitCode();
  }

  openSavedCircuits(): void {
    this.showSavedCircuitsModal = true;
  }

  closeSavedCircuits(): void {
    this.showSavedCircuitsModal = false;
  }

  loadSavedCircuit(config: SavedConfiguration): void {
    this.circuitService.updateCircuit(config.circuit);
    if (config.results) {
      this.simulationResult = config.results;
    }
    this.showSavedCircuitsModal = false;
  }
}
