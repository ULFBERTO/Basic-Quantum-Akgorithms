# Guía de Desarrollo - QuantumLeap

## 🎯 Arquitectura de la Aplicación

### Frontend (Angular + Three.js)
```
┌─────────────────────────────────────────┐
│         Landing Page Component          │
│  (Página principal con navegación)      │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
┌───────▼──────┐ ┌──▼──────┐ ┌─▼──────────┐
│ Gate         │ │ Circuit │ │ Algorithm  │
│ Visualizer   │ │ Designer│ │ Explorer   │
└──────────────┘ └─────────┘ └────────────┘
        │           │           │
        └───────────┼───────────┘
                    │
        ┌───────────▼───────────┐
        │   Bloch Sphere        │
        │   Component (Three.js)│
        └───────────────────────┘
                    │
        ┌───────────▼───────────┐
        │      Services         │
        │ - QuantumCircuit      │
        │ - Visualization       │
        │ - Storage             │
        │ - PythonIntegration   │
        └───────────────────────┘
```

### Backend (Python + Flask + Qiskit)
```
┌─────────────────────────────────────────┐
│         Flask REST API Server           │
│         (backend-example/server.py)     │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
┌───────▼──────┐ ┌──▼──────┐ ┌─▼──────────┐
│ Simulate     │ │ Execute │ │ Visualize  │
│ Endpoint     │ │ Endpoint│ │ Endpoint   │
└──────────────┘ └─────────┘ └────────────┘
        │           │           │
        └───────────┼───────────┘
                    │
        ┌───────────▼───────────┐
        │   Qiskit Library      │
        │   - QuantumCircuit    │
        │   - AerSimulator      │
        │   - Transpiler        │
        └───────────────────────┘
```

## 📝 Flujo de Datos

### 1. Creación de Circuito
```
Usuario → Circuit Designer → QuantumCircuitService → LocalStorage
                                      ↓
                              Actualiza UI en tiempo real
```

### 2. Simulación de Circuito
```
Usuario → Botón "Simular" → QuantumCircuitService
                                      ↓
                          Genera código Qiskit
                                      ↓
                          PythonIntegrationService
                                      ↓
                          Backend Flask (opcional)
                                      ↓
                          Qiskit Simulator
                                      ↓
                          Resultados → UI
```

### 3. Visualización 3D
```
Estado Cuántico → VisualizationService → Three.js Scene
                                              ↓
                                    Bloch Sphere Component
                                              ↓
                                    Canvas HTML5
```

## 🔧 Agregar Nuevas Funcionalidades

### Agregar una Nueva Puerta Cuántica

1. **Actualizar el modelo** (`quantum-behavior.model.ts`):
```typescript
// Ya está definido en QuantumGate interface
```

2. **Agregar a QuantumCircuitService** (`quantum-circuit.service.ts`):
```typescript
private availableGates: QuantumGate[] = [
  // ... puertas existentes
  {
    id: 'nueva_puerta',
    name: 'Nueva Puerta',
    type: 'single',
    symbol: 'N',
    color: '#FF5733',
    description: 'Descripción de la nueva puerta',
    matrix: [[1, 0], [0, 1]] // Matriz de transformación
  }
];
```

3. **Agregar visualización** (opcional):
```typescript
// En visualization.service.ts
createQuantumGateVisualization(gateType: string): THREE.Group {
  // ... código existente
  case 'nueva_puerta': color = 0xFF5733; break;
}
```

### Agregar un Nuevo Algoritmo

1. **Crear archivo Python** (`ejemplo_XX_nuevo_algoritmo.py`):
```python
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

print("=== NUEVO ALGORITMO ===")

qc = QuantumCircuit(2, 2)
# Implementar algoritmo
qc.h(0)
qc.cx(0, 1)
qc.measure_all()

simulator = AerSimulator()
job = simulator.run(transpile(qc, simulator), shots=1000)
result = job.result()
counts = result.get_counts(qc)

print(f"Resultados: {counts}")
print(qc.draw())
```

2. **Agregar al AlgorithmExplorerComponent**:
```typescript
private loadAlgorithms(): void {
  this.algorithms = [
    // ... algoritmos existentes
    {
      id: 'nuevo_algoritmo',
      name: 'Nuevo Algoritmo',
      category: 'optimization',
      description: 'Descripción del algoritmo',
      complexity: 'intermediate',
      pythonCode: `código del algoritmo`,
      circuit: { /* configuración del circuito */ },
      visualizationType: 'bloch'
    }
  ];
}
```

3. **Agregar al backend** (`backend-example/server.py`):
```python
algorithm_files = {
    # ... algoritmos existentes
    'nuevo_algoritmo': '../ejemplo_XX_nuevo_algoritmo.py'
}
```

### Agregar Nueva Visualización

1. **Crear componente**:
```bash
ng generate component components/nueva-visualizacion --skip-tests
```

2. **Implementar visualización con Three.js**:
```typescript
import * as THREE from 'three';

export class NuevaVisualizacionComponent implements OnInit {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  ngOnInit(): void {
    this.initScene();
    this.createVisualization();
    this.animate();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    // ... configuración
  }

  private createVisualization(): void {
    // Crear objetos 3D
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x4D96FF });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}
```

## 🎨 Personalización de Estilos

### Cambiar Tema de Colores

Editar `src/styles.scss`:
```scss
:root {
  --primary: #4D96FF;        // Color principal
  --background-dark: #0A0E1A; // Fondo oscuro
  --accent: #DA70D6;          // Color de acento
}
```

### Cambiar Fuente

Editar `src/index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Tu+Fuente&display=swap" rel="stylesheet">
```

Editar `tailwind.config.js`:
```javascript
fontFamily: {
  'display': ['Tu Fuente', 'sans-serif'],
}
```

## 🧪 Testing

### Ejecutar Tests Unitarios
```bash
npm test
```

### Ejecutar Tests E2E
```bash
npm run e2e
```

### Ejemplo de Test para Servicio
```typescript
describe('QuantumCircuitService', () => {
  let service: QuantumCircuitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuantumCircuitService);
  });

  it('should create a circuit', () => {
    const circuit = service.createCircuit(2, 'Test Circuit');
    expect(circuit.qubits).toBe(2);
    expect(circuit.name).toBe('Test Circuit');
  });

  it('should add a gate', () => {
    service.createCircuit(2);
    service.addGate('h', [0]);
    service.currentCircuit$.subscribe(circuit => {
      expect(circuit?.gates.length).toBe(1);
    });
  });
});
```

## 📦 Deployment

### Build para Producción
```bash
npm run build
```

Los archivos se generarán en `dist/quantum-docs/`.

### Deploy en GitHub Pages
```bash
ng build --base-href /QuantumLeap/
npx angular-cli-ghpages --dir=dist/quantum-docs/browser
```

### Deploy en Netlify
1. Conectar repositorio en Netlify
2. Configurar build:
   - Build command: `npm run build`
   - Publish directory: `dist/quantum-docs/browser`

### Deploy en Vercel
```bash
npm install -g vercel
vercel
```

## 🐛 Debugging

### Debug en VS Code

Crear `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### Debug del Backend Python

Agregar breakpoints en `server.py` y ejecutar:
```bash
python -m pdb server.py
```

## 📊 Monitoreo de Performance

### Angular DevTools
Instalar extensión de Chrome: Angular DevTools

### Three.js Stats
```typescript
import Stats from 'three/examples/jsm/libs/stats.module';

const stats = new Stats();
document.body.appendChild(stats.dom);

// En el loop de animación
stats.update();
```

## 🔐 Seguridad

### Validación de Código Qiskit
Siempre validar código antes de ejecutar:
```typescript
pythonService.validateQiskitCode(code).subscribe(result => {
  if (result.valid) {
    // Ejecutar código
  } else {
    // Mostrar errores
  }
});
```

### CORS en Backend
Ya configurado en `server.py`:
```python
from flask_cors import CORS
CORS(app)
```

## 📚 Recursos Adicionales

- [Documentación de Qiskit](https://qiskit.org/documentation/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribuir

Ver `README.md` para guías de contribución.

## 📧 Soporte

Para preguntas técnicas, abrir un issue en el repositorio.
