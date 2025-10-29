import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantumCircuitService } from '../../services/quantum-circuit.service';
import { QuantumGate } from '../../models/quantum-behavior.model';
import { BlochSphereComponent } from '../bloch-sphere/bloch-sphere.component';

@Component({
  selector: 'app-gate-visualizer',
  standalone: true,
  imports: [CommonModule, BlochSphereComponent],
  templateUrl: './gate-visualizer.component.html',
  styleUrl: './gate-visualizer.component.scss'
})
export class GateVisualizerComponent implements OnInit {
  gates: QuantumGate[] = [];
  selectedGate: QuantumGate | null = null;
  activeTab: string = 'Visualizador';
  tabs: string[] = ['Teoría', 'Ejemplos', 'Visualizador'];

  constructor(private circuitService: QuantumCircuitService) {}

  ngOnInit(): void {
    this.gates = this.circuitService.getAvailableGates();
    if (this.gates.length > 0) {
      this.selectedGate = this.gates[0];
    }
  }

  selectGate(gate: QuantumGate): void {
    this.selectedGate = gate;
  }

  getGateIcon(index: number): string {
    const icons = ['looks_one', 'close', 'horizontal_rule', 'filter_list', 'control_point_duplicate', 'pin_invoke', 'swap_horiz'];
    return icons[index] || 'hub';
  }

  getQiskitExample(): string {
    if (!this.selectedGate) return '';

    const examples: { [key: string]: string } = {
      'h': `from qiskit import QuantumCircuit

# Crear circuito con un qubit
qc = QuantumCircuit(1)

# Aplicar puerta Hadamard al qubit 0
qc.h(0)

# Imprimir el circuito
print(qc)`,
      'x': `from qiskit import QuantumCircuit

# Crear circuito con un qubit
qc = QuantumCircuit(1)

# Aplicar puerta X al qubit 0
qc.x(0)

print(qc)`,
      'y': `from qiskit import QuantumCircuit

qc = QuantumCircuit(1)
qc.y(0)
print(qc)`,
      'z': `from qiskit import QuantumCircuit

qc = QuantumCircuit(1)
qc.z(0)
print(qc)`,
      'cx': `from qiskit import QuantumCircuit

# Crear circuito con dos qubits
qc = QuantumCircuit(2)

# Aplicar CNOT: control=0, target=1
qc.cx(0, 1)

print(qc)`,
      'cz': `from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.cz(0, 1)
print(qc)`,
      'swap': `from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.swap(0, 1)
print(qc)`
    };

    return examples[this.selectedGate.id] || 'Ejemplo no disponible';
  }

  playAnimation(): void {
    // Implementar animación
    console.log('Playing animation for', this.selectedGate?.name);
  }

  resetAnimation(): void {
    // Resetear animación
    console.log('Resetting animation');
  }
}
