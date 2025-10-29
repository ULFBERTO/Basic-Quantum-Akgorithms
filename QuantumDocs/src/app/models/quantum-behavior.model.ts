// Modelos para representar comportamientos cuánticos

export interface QuantumGate {
  id: string;
  name: string;
  type: 'single' | 'multi';
  symbol: string;
  color: string;
  description: string;
  matrix?: number[][];
}

export interface QubitState {
  id: number;
  state: '0' | '1' | 'superposition';
  amplitude: { real: number; imaginary: number };
  probability: number;
}

export interface QuantumCircuit {
  id: string;
  name: string;
  description: string;
  qubits: number;
  gates: CircuitGate[];
  measurements: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CircuitGate {
  gateId: string;
  qubitTargets: number[];
  controlQubits?: number[];
  position: number;
  parameters?: { [key: string]: number };
}

export interface SimulationResult {
  circuitId: string;
  counts: { [state: string]: number };
  probabilities: { [state: string]: number };
  statevector?: ComplexNumber[];
  blochSphere?: BlochSphereData;
  executionTime: number;
}

export interface ComplexNumber {
  real: number;
  imaginary: number;
}

export interface BlochSphereData {
  theta: number;
  phi: number;
  x: number;
  y: number;
  z: number;
}

export interface QuantumAlgorithm {
  id: string;
  name: string;
  category: 'search' | 'factoring' | 'simulation' | 'optimization' | 'other';
  description: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  pythonCode: string;
  circuit: QuantumCircuit;
  visualizationType: 'bloch' | 'circuit' | 'histogram' | 'statevector' | 'custom';
  animationConfig?: AnimationConfig;
  parameters?: { [key: string]: AlgorithmParameter };
}

export interface AlgorithmParameter {
  type: 'number' | 'text' | 'select';
  label: string;
  min?: number;
  max?: number;
  step?: number;
  default: any;
  options?: string[];
}

export interface AnimationConfig {
  duration: number;
  steps: AnimationStep[];
  autoPlay: boolean;
  loop: boolean;
}

export interface AnimationStep {
  timestamp: number;
  description: string;
  highlightGates?: number[];
  cameraPosition?: { x: number; y: number; z: number };
  customData?: any;
}

export interface VisualizationConfig {
  id: string;
  algorithmId: string;
  type: '3d' | '2d' | 'hybrid';
  theme: 'dark' | 'light';
  showGrid: boolean;
  showAxes: boolean;
  cameraSettings: CameraSettings;
  renderSettings: RenderSettings;
}

export interface CameraSettings {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
  near: number;
  far: number;
}

export interface RenderSettings {
  antialias: boolean;
  shadows: boolean;
  ambientLight: number;
  directionalLight: number;
  backgroundColor: string;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  description: string;
  circuit: QuantumCircuit;
  visualization: VisualizationConfig;
  results?: SimulationResult;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
