import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuantumAlgorithm } from '../../models/quantum-behavior.model';
import { BlochSphereComponent } from '../bloch-sphere/bloch-sphere.component';

@Component({
  selector: 'app-algorithm-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BlochSphereComponent],
  templateUrl: './algorithm-explorer.component.html',
  styleUrl: './algorithm-explorer.component.scss'
})
export class AlgorithmExplorerComponent implements OnInit {
  algorithms: QuantumAlgorithm[] = [];
  filteredAlgorithms: QuantumAlgorithm[] = [];
  selectedAlgorithm: QuantumAlgorithm | null = null;
  searchQuery: string = '';
  activeTab: string = 'Visualización';
  tabs: string[] = ['Visualización', 'Explicación', 'Simulación', 'Código'];
  
  // Parámetros de simulación
  algorithmParameters: { [key: string]: any } = {};
  simulationShots: number = 1000;
  simulationResult: string = '';
  simulationExecuted: boolean = false;

  ngOnInit(): void {
    this.loadAlgorithms();
    this.filteredAlgorithms = this.algorithms;
    if (this.algorithms.length > 0) {
      this.selectAlgorithm(this.algorithms[0]);
    }
  }

  private loadAlgorithms(): void {
    this.algorithms = [
      {
        id: 'bell_state',
        name: 'Estado de Bell',
        category: 'other',
        description: 'Crea un par de qubits entrelazados. El estado de Bell es la base del entrelazamiento cuántico y se usa en teletransportación y criptografía cuántica.',
        complexity: 'beginner',
        pythonCode: `from qiskit import QuantumCircuit

# Estado de Bell |Φ+⟩
qc = QuantumCircuit(2, 2)
qc.h(0)        # Superposición
qc.cx(0, 1)    # Entrelazamiento
qc.measure_all()

# Resultado: 50% |00⟩, 50% |11⟩`,
        circuit: {
          id: 'bell_circuit',
          name: 'Bell State',
          description: 'Par entrelazado',
          qubits: 2,
          gates: [],
          measurements: [0, 1],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'bloch',
        parameters: {
          bellType: { type: 'select', label: 'Tipo de Estado', options: ['Φ+', 'Φ-', 'Ψ+', 'Ψ-'], default: 'Φ+' }
        }
      },
      {
        id: 'ghz_state',
        name: 'Estado GHZ',
        category: 'other',
        description: 'Entrelazamiento de 3 o más qubits. Demuestra correlaciones cuánticas en sistemas multi-partitos.',
        complexity: 'intermediate',
        pythonCode: `from qiskit import QuantumCircuit

# Estado GHZ con 3 qubits
qc = QuantumCircuit(3, 3)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)
qc.measure_all()

# Resultado: 50% |000⟩, 50% |111⟩`,
        circuit: {
          id: 'ghz_circuit',
          name: 'GHZ State',
          description: 'Entrelazamiento multi-qubit',
          qubits: 3,
          gates: [],
          measurements: [0, 1, 2],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'circuit',
        parameters: {
          numQubits: { type: 'number', label: 'Número de Qubits', min: 3, max: 5, default: 3 }
        }
      },
      {
        id: 'shor',
        name: 'Algoritmo de Shor',
        category: 'factoring',
        description: 'Encuentra eficientemente los factores primos de un entero grande. Revolucionario para criptografía.',
        complexity: 'advanced',
        pythonCode: `from qiskit import QuantumCircuit
import numpy as np

# Algoritmo de Shor simplificado
def shor_algorithm(N=15):
    n_count = 4  # Qubits de conteo
    qc = QuantumCircuit(n_count + 1, n_count)
    
    # Superposición en qubits de conteo
    for q in range(n_count):
        qc.h(q)
    
    # Oráculo de exponenciación modular
    qc.cx(0, n_count)
    qc.cx(1, n_count)
    
    # QFT inversa
    for q in range(n_count//2):
        qc.swap(q, n_count-1-q)
    
    qc.measure(range(n_count), range(n_count))
    return qc`,
        circuit: {
          id: 'shor_circuit',
          name: 'Shor',
          description: 'Factorización cuántica',
          qubits: 5,
          gates: [],
          measurements: [0, 1, 2, 3],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'circuit',
        parameters: {
          numberToFactor: { type: 'number', label: 'Número a Factorizar', min: 15, max: 21, default: 15 }
        }
      },
      {
        id: 'grover',
        name: 'Algoritmo de Grover',
        category: 'search',
        description: 'Búsqueda cuántica en base de datos no ordenada. Proporciona aceleración cuadrática sobre búsqueda clásica.',
        complexity: 'intermediate',
        pythonCode: `from qiskit import QuantumCircuit
import numpy as np

# Algoritmo de Grover
def grover_search(n_qubits=2, marked_item=3):
    qc = QuantumCircuit(n_qubits, n_qubits)
    
    # Superposición inicial
    for q in range(n_qubits):
        qc.h(q)
    
    # Iteraciones de Grover
    iterations = int(np.pi/4 * np.sqrt(2**n_qubits))
    
    for _ in range(iterations):
        # Oráculo (marca el elemento)
        qc.cz(0, 1)
        
        # Difusor
        qc.h([0, 1])
        qc.z([0, 1])
        qc.cz(0, 1)
        qc.h([0, 1])
    
    qc.measure_all()
    return qc`,
        circuit: {
          id: 'grover_circuit',
          name: 'Grover',
          description: 'Búsqueda cuántica',
          qubits: 2,
          gates: [],
          measurements: [0, 1],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'histogram',
        parameters: {
          numQubits: { type: 'number', label: 'Número de Qubits', min: 2, max: 4, default: 2 },
          targetItem: { type: 'number', label: 'Elemento a Buscar', min: 0, max: 15, default: 3 }
        }
      },
      {
        id: 'teleportation',
        name: 'Teletransportación Cuántica',
        category: 'other',
        description: 'Transfiere el estado cuántico de un qubit a otro.',
        complexity: 'intermediate',
        pythonCode: `from qiskit import QuantumCircuit

# Teletransportación cuántica
def quantum_teleportation():
    qc = QuantumCircuit(3, 3)
    # Crear par de Bell
    qc.h(1)
    qc.cx(1, 2)
    # Protocolo de teletransportación
    qc.cx(0, 1)
    qc.h(0)
    qc.measure([0, 1], [0, 1])
    return qc`,
        circuit: {
          id: 'teleport_circuit',
          name: 'Teleportation',
          description: 'Teletransportación cuántica',
          qubits: 3,
          gates: [],
          measurements: [0, 1, 2],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'bloch'
      },
      {
        id: 'deutsch',
        name: 'Algoritmo de Deutsch-Jozsa',
        category: 'other',
        description: 'Determina si una función es constante o balanceada en una sola consulta. Primera demostración de ventaja cuántica.',
        complexity: 'beginner',
        pythonCode: `from qiskit import QuantumCircuit

# Deutsch-Jozsa
def deutsch_jozsa(n_qubits=2, function_type='constant'):
    qc = QuantumCircuit(n_qubits + 1, n_qubits)
    
    # Preparación
    qc.x(n_qubits)  # Qubit auxiliar en |1⟩
    for q in range(n_qubits + 1):
        qc.h(q)
    
    # Oráculo
    if function_type == 'balanced':
        qc.cx(0, n_qubits)
    # Si es constante, no hacer nada
    
    # Hadamard final
    for q in range(n_qubits):
        qc.h(q)
    
    qc.measure(range(n_qubits), range(n_qubits))
    return qc`,
        circuit: {
          id: 'deutsch_circuit',
          name: 'Deutsch-Jozsa',
          description: 'Función constante vs balanceada',
          qubits: 3,
          gates: [],
          measurements: [0, 1],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'circuit',
        parameters: {
          numQubits: { type: 'number', label: 'Número de Qubits', min: 2, max: 4, default: 2 },
          functionType: { type: 'select', label: 'Tipo de Función', options: ['constant', 'balanced'], default: 'constant' }
        }
      },
      {
        id: 'teleportation',
        name: 'Teletransportación Cuántica',
        category: 'other',
        description: 'Transfiere el estado cuántico de un qubit a otro usando entrelazamiento. No viola la relatividad.',
        complexity: 'intermediate',
        pythonCode: `from qiskit import QuantumCircuit

# Teletransportación cuántica
qc = QuantumCircuit(3, 3)

# Preparar estado a teletransportar (ejemplo: |+⟩)
qc.h(0)

# Crear par de Bell entre qubits 1 y 2
qc.h(1)
qc.cx(1, 2)

# Protocolo de teletransportación
qc.cx(0, 1)
qc.h(0)

# Mediciones
qc.measure([0, 1], [0, 1])

# Correcciones condicionales
qc.cx(1, 2)
qc.cz(0, 2)`,
        circuit: {
          id: 'teleport_circuit',
          name: 'Teleportation',
          description: 'Teletransportación cuántica',
          qubits: 3,
          gates: [],
          measurements: [0, 1, 2],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'bloch',
        parameters: {
          initialState: { type: 'select', label: 'Estado Inicial', options: ['|0⟩', '|1⟩', '|+⟩', '|-⟩'], default: '|+⟩' }
        }
      },
      {
        id: 'bernstein_vazirani',
        name: 'Bernstein-Vazirani',
        category: 'other',
        description: 'Encuentra una cadena binaria oculta en una sola consulta. Demuestra separación exponencial.',
        complexity: 'intermediate',
        pythonCode: `from qiskit import QuantumCircuit

# Bernstein-Vazirani
def bernstein_vazirani(secret_string='101'):
    n = len(secret_string)
    qc = QuantumCircuit(n + 1, n)
    
    # Preparación
    qc.x(n)
    for q in range(n + 1):
        qc.h(q)
    
    # Oráculo
    for i, bit in enumerate(reversed(secret_string)):
        if bit == '1':
            qc.cx(i, n)
    
    # Hadamard final
    for q in range(n):
        qc.h(q)
    
    qc.measure(range(n), range(n))
    return qc`,
        circuit: {
          id: 'bv_circuit',
          name: 'Bernstein-Vazirani',
          description: 'Encuentra cadena oculta',
          qubits: 4,
          gates: [],
          measurements: [0, 1, 2],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'circuit',
        parameters: {
          secretString: { type: 'text', label: 'Cadena Secreta (binario)', default: '101' }
        }
      },
      {
        id: 'simon',
        name: 'Algoritmo de Simon',
        category: 'other',
        description: 'Encuentra el periodo de una función. Inspiró el algoritmo de Shor.',
        complexity: 'advanced',
        pythonCode: `from qiskit import QuantumCircuit

# Algoritmo de Simon
def simon_algorithm(n=3):
    qc = QuantumCircuit(2*n, n)
    
    # Superposición
    for q in range(n):
        qc.h(q)
    
    # Oráculo (simplificado)
    for q in range(n):
        qc.cx(q, n+q)
    
    # Hadamard final
    for q in range(n):
        qc.h(q)
    
    qc.measure(range(n), range(n))
    return qc`,
        circuit: {
          id: 'simon_circuit',
          name: 'Simon',
          description: 'Encuentra periodo',
          qubits: 6,
          gates: [],
          measurements: [0, 1, 2],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'circuit',
        parameters: {
          numQubits: { type: 'number', label: 'Número de Qubits', min: 2, max: 3, default: 3 }
        }
      },
      {
        id: 'qft',
        name: 'Transformada de Fourier Cuántica (QFT)',
        category: 'other',
        description: 'Versión cuántica de la FFT. Base de muchos algoritmos cuánticos.',
        complexity: 'intermediate',
        pythonCode: `from qiskit import QuantumCircuit
import numpy as np

# QFT
def qft(n=3):
    qc = QuantumCircuit(n)
    
    for j in range(n):
        qc.h(j)
        for k in range(j+1, n):
            qc.cp(np.pi/2**(k-j), k, j)
    
    # Swap qubits
    for q in range(n//2):
        qc.swap(q, n-q-1)
    
    return qc`,
        circuit: {
          id: 'qft_circuit',
          name: 'QFT',
          description: 'Transformada de Fourier Cuántica',
          qubits: 3,
          gates: [],
          measurements: [0, 1, 2],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'circuit',
        parameters: {
          numQubits: { type: 'number', label: 'Número de Qubits', min: 2, max: 4, default: 3 }
        }
      },
      {
        id: 'vqe',
        name: 'VQE (Variational Quantum Eigensolver)',
        category: 'optimization',
        description: 'Encuentra el estado fundamental de un Hamiltoniano. Algoritmo híbrido cuántico-clásico.',
        complexity: 'advanced',
        pythonCode: `from qiskit import QuantumCircuit
import numpy as np

# VQE Ansatz simple
def vqe_ansatz(theta):
    qc = QuantumCircuit(2)
    
    # Capa de rotaciones
    qc.ry(theta[0], 0)
    qc.ry(theta[1], 1)
    
    # Entrelazamiento
    qc.cx(0, 1)
    
    # Segunda capa
    qc.ry(theta[2], 0)
    qc.ry(theta[3], 1)
    
    return qc`,
        circuit: {
          id: 'vqe_circuit',
          name: 'VQE',
          description: 'Eigensolver variacional',
          qubits: 2,
          gates: [],
          measurements: [0, 1],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'bloch',
        parameters: {
          theta1: { type: 'number', label: 'θ₁', min: 0, max: 6.28, step: 0.1, default: 1.57 },
          theta2: { type: 'number', label: 'θ₂', min: 0, max: 6.28, step: 0.1, default: 1.57 }
        }
      },
      {
        id: 'qaoa',
        name: 'QAOA (Quantum Approximate Optimization)',
        category: 'optimization',
        description: 'Resuelve problemas de optimización combinatoria. Algoritmo híbrido prometedor.',
        complexity: 'advanced',
        pythonCode: `from qiskit import QuantumCircuit
import numpy as np

# QAOA para MaxCut
def qaoa(gamma, beta, p=1):
    qc = QuantumCircuit(3)
    
    # Estado inicial
    for q in range(3):
        qc.h(q)
    
    # Capas QAOA
    for _ in range(p):
        # Hamiltoniano de costo
        qc.rzz(2*gamma, 0, 1)
        qc.rzz(2*gamma, 1, 2)
        
        # Hamiltoniano mixer
        for q in range(3):
            qc.rx(2*beta, q)
    
    return qc`,
        circuit: {
          id: 'qaoa_circuit',
          name: 'QAOA',
          description: 'Optimización aproximada',
          qubits: 3,
          gates: [],
          measurements: [0, 1, 2],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'circuit',
        parameters: {
          gamma: { type: 'number', label: 'γ (gamma)', min: 0, max: 3.14, step: 0.1, default: 1.0 },
          beta: { type: 'number', label: 'β (beta)', min: 0, max: 3.14, step: 0.1, default: 1.0 },
          layers: { type: 'number', label: 'Capas (p)', min: 1, max: 3, default: 1 }
        }
      },
      {
        id: 'phase_estimation',
        name: 'Estimación de Fase Cuántica',
        category: 'other',
        description: 'Estima el eigenvalor de un operador unitario. Componente clave de Shor.',
        complexity: 'advanced',
        pythonCode: `from qiskit import QuantumCircuit
import numpy as np

# Phase Estimation
def phase_estimation(n_counting=3):
    qc = QuantumCircuit(n_counting + 1, n_counting)
    
    # Preparar eigenstate
    qc.x(n_counting)
    
    # Superposición en qubits de conteo
    for q in range(n_counting):
        qc.h(q)
    
    # Aplicar U controlado
    repetitions = 1
    for q in range(n_counting):
        for _ in range(repetitions):
            qc.cp(np.pi/2, q, n_counting)
        repetitions *= 2
    
    # QFT inversa
    # (simplificada)
    for q in range(n_counting):
        qc.h(q)
    
    qc.measure(range(n_counting), range(n_counting))
    return qc`,
        circuit: {
          id: 'pe_circuit',
          name: 'Phase Estimation',
          description: 'Estimación de fase',
          qubits: 4,
          gates: [],
          measurements: [0, 1, 2],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        visualizationType: 'circuit',
        parameters: {
          countingQubits: { type: 'number', label: 'Qubits de Conteo', min: 2, max: 4, default: 3 }
        }
      }
    ];
  }

  selectAlgorithm(algorithm: QuantumAlgorithm): void {
    this.selectedAlgorithm = algorithm;
    this.initializeParameters();
  }

  initializeParameters(): void {
    if (!this.selectedAlgorithm?.parameters) return;
    
    this.algorithmParameters = {};
    Object.keys(this.selectedAlgorithm.parameters).forEach(key => {
      this.algorithmParameters[key] = this.selectedAlgorithm!.parameters![key].default;
    });
  }

  filterAlgorithms(): void {
    if (!this.searchQuery.trim()) {
      this.filteredAlgorithms = this.algorithms;
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredAlgorithms = this.algorithms.filter(algo =>
      algo.name.toLowerCase().includes(query) ||
      algo.description.toLowerCase().includes(query)
    );
  }

  getAlgorithmIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'search': 'travel_explore',
      'factoring': 'key',
      'simulation': 'science',
      'optimization': 'tune',
      'other': 'multiple_stop'
    };
    return icons[category] || 'hub';
  }

  // Métodos para parámetros dinámicos
  getParameterKeys(): string[] {
    return this.selectedAlgorithm?.parameters ? Object.keys(this.selectedAlgorithm.parameters) : [];
  }

  getParameterType(key: string): string {
    return this.selectedAlgorithm?.parameters?.[key]?.type || 'text';
  }

  getParameterLabel(key: string): string {
    return this.selectedAlgorithm?.parameters?.[key]?.label || key;
  }

  getParameterDefault(key: string): any {
    return this.algorithmParameters[key] || this.selectedAlgorithm?.parameters?.[key]?.default;
  }

  getParameterMin(key: string): number | undefined {
    return this.selectedAlgorithm?.parameters?.[key]?.min;
  }

  getParameterMax(key: string): number | undefined {
    return this.selectedAlgorithm?.parameters?.[key]?.max;
  }

  getParameterStep(key: string): number | undefined {
    return this.selectedAlgorithm?.parameters?.[key]?.step || 1;
  }

  getParameterOptions(key: string): string[] {
    return this.selectedAlgorithm?.parameters?.[key]?.options || [];
  }

  updateParameter(key: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.type === 'number' ? parseFloat(target.value) : target.value;
    this.algorithmParameters[key] = value;
  }

  runSimulation(): void {
    if (!this.selectedAlgorithm) return;

    this.simulationExecuted = true;
    
    // Simular ejecución con resultados visuales
    this.simulationResult = `✓ Simulación completada exitosamente`;
    
    // Log para debugging
    console.log('Simulación ejecutada:', {
      algorithm: this.selectedAlgorithm.id,
      parameters: this.algorithmParameters,
      shots: this.simulationShots,
      results: this.getSimulationResults()
    });
  }

  getSimulationResults(): { [state: string]: number } {
    const results: { [state: string]: number } = {};
    const states = this.getPossibleStates();
    
    states.forEach(state => {
      const probability = this.getStateProbability(state);
      results[state] = Math.round((probability / 100) * this.simulationShots);
    });
    
    return results;
  }

  calculateEntropy(): number {
    const states = this.getPossibleStates();
    let entropy = 0;
    
    states.forEach(state => {
      const p = this.getStateProbability(state) / 100;
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    });
    
    return entropy;
  }

  getMostProbableState(): string {
    const states = this.getPossibleStates();
    let maxProb = 0;
    let mostProbable = states[0] || '0';
    
    states.forEach(state => {
      const prob = this.getStateProbability(state);
      if (prob > maxProb) {
        maxProb = prob;
        mostProbable = state;
      }
    });
    
    return mostProbable;
  }

  // Métodos para visualización multi-qubit
  getQubitArray(): number[] {
    if (!this.selectedAlgorithm) return [];
    return Array.from({ length: this.selectedAlgorithm.circuit.qubits }, (_, i) => i);
  }

  getStateDescription(): string {
    if (!this.selectedAlgorithm) return '';
    
    const n = this.selectedAlgorithm.circuit.qubits;
    const bellType = this.algorithmParameters['bellType'] || 'Φ+';
    
    // Descripciones específicas por algoritmo
    const descriptions: { [key: string]: string } = {
      'bell_state': this.getBellStateDescription(bellType),
      'ghz_state': `Estado GHZ: (|${'0'.repeat(n)}⟩ + |${'1'.repeat(n)}⟩)/√2`,
      'grover': 'Superposición con amplificación del elemento buscado',
      'deutsch': 'Superposición con qubit auxiliar',
      'teleportation': 'Estado entrelazado para teletransportación',
      'shor': 'Superposición de estados de conteo',
      'vqe': 'Estado variacional parametrizado',
      'qaoa': 'Estado de optimización',
      'qft': 'Transformada de Fourier del estado',
      'phase_estimation': 'Superposición con fase estimada',
      'bernstein_vazirani': 'Superposición uniforme',
      'simon': 'Superposición de registros'
    };
    
    return descriptions[this.selectedAlgorithm.id] || `Estado de ${n} qubit${n > 1 ? 's' : ''}`;
  }

  getBellStateDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      'Φ+': '(|00⟩ + |11⟩)/√2',
      'Φ-': '(|00⟩ - |11⟩)/√2',
      'Ψ+': '(|01⟩ + |10⟩)/√2',
      'Ψ-': '(|01⟩ - |10⟩)/√2'
    };
    return descriptions[type] || '(|00⟩ + |11⟩)/√2';
  }

  getStateNotation(): string {
    if (!this.selectedAlgorithm) return '';
    return `|ψ⟩ = ${this.getStateDescription()}`;
  }

  getPossibleStates(): string[] {
    if (!this.selectedAlgorithm) return [];
    
    const n = this.selectedAlgorithm.circuit.qubits;
    const numStates = Math.pow(2, n);
    
    // Para algoritmos con muchos estados, mostrar solo los más probables
    if (numStates > 8) {
      return this.getSignificantStates();
    }
    
    // Generar todos los estados posibles
    const states: string[] = [];
    for (let i = 0; i < numStates; i++) {
      states.push(i.toString(2).padStart(n, '0'));
    }
    return states;
  }

  getSignificantStates(): string[] {
    // Retornar solo los estados con probabilidad significativa
    const n = this.selectedAlgorithm!.circuit.qubits;
    const bellType = this.algorithmParameters['bellType'] || 'Φ+';
    
    switch (this.selectedAlgorithm!.id) {
      case 'bell_state':
        return this.getBellSignificantStates(bellType);
      case 'ghz_state':
        return ['0'.repeat(n), '1'.repeat(n)];
      case 'grover':
        const target = this.algorithmParameters['targetItem'] || 3;
        return [target.toString(2).padStart(n, '0')];
      default:
        return ['0'.repeat(n), '1'.repeat(n)];
    }
  }

  getBellSignificantStates(type: string): string[] {
    const states: { [key: string]: string[] } = {
      'Φ+': ['00', '11'],
      'Φ-': ['00', '11'],
      'Ψ+': ['01', '10'],
      'Ψ-': ['01', '10']
    };
    return states[type] || ['00', '11'];
  }

  getStateProbability(state: string): number {
    if (!this.selectedAlgorithm) return 0;
    
    const bellType = this.algorithmParameters['bellType'] || 'Φ+';
    const n = this.selectedAlgorithm.circuit.qubits;
    
    switch (this.selectedAlgorithm.id) {
      case 'bell_state':
        return this.getBellProbability(state, bellType);
      
      case 'ghz_state':
        const allZeros = '0'.repeat(n);
        const allOnes = '1'.repeat(n);
        return (state === allZeros || state === allOnes) ? 50 : 0;
      
      case 'grover':
        const target = this.algorithmParameters['targetItem'] || 3;
        const targetState = target.toString(2).padStart(n, '0');
        return state === targetState ? 95 : 5 / (Math.pow(2, n) - 1);
      
      case 'deutsch':
        return state === '0'.repeat(n) ? 100 : 0;
      
      case 'teleportation':
        return state.startsWith('0') ? 50 : 50;
      
      default:
        // Superposición uniforme
        return 100 / Math.pow(2, n);
    }
  }

  getBellProbability(state: string, type: string): number {
    const probabilities: { [key: string]: { [key: string]: number } } = {
      'Φ+': { '00': 50, '11': 50, '01': 0, '10': 0 },
      'Φ-': { '00': 50, '11': 50, '01': 0, '10': 0 },
      'Ψ+': { '00': 0, '11': 0, '01': 50, '10': 50 },
      'Ψ-': { '00': 0, '11': 0, '01': 50, '10': 50 }
    };
    return probabilities[type]?.[state] || 0;
  }

  // Exponer Math para el template
  Math = Math;
}
