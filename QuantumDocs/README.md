# QuantumLeap - Plataforma Educativa de Computación Cuántica

Una aplicación web interactiva construida con Angular y Three.js para visualizar y aprender sobre algoritmos cuánticos.

## 🚀 Características

- **Visualización 3D con Three.js**: Esfera de Bloch interactiva y visualizaciones de circuitos cuánticos
- **Diseñador de Circuitos**: Interfaz drag-and-drop para construir circuitos cuánticos
- **Explorador de Algoritmos**: Biblioteca de algoritmos cuánticos clásicos (Grover, Shor, Deutsch-Jozsa, etc.)
- **Simulación en Tiempo Real**: Simula circuitos cuánticos y visualiza resultados
- **Almacenamiento Local**: Guarda configuraciones y resultados en formato JSON
- **Exportación de Código**: Genera código Qiskit desde circuitos visuales
- **Responsive Design**: Funciona en desktop, tablet y móvil

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (v19 o superior)

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
cd D:\EVIROMENT\Basic-Quantum-Akgorithms\QuantumDocs
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm start
```

4. Abrir el navegador en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
QuantumDocs/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── landing/              # Página principal
│   │   │   ├── bloch-sphere/         # Visualización de esfera de Bloch
│   │   │   ├── circuit-designer/     # Diseñador de circuitos
│   │   │   ├── algorithm-explorer/   # Explorador de algoritmos
│   │   │   └── gate-visualizer/      # Visualizador de puertas cuánticas
│   │   ├── services/
│   │   │   ├── quantum-circuit.service.ts      # Gestión de circuitos
│   │   │   ├── visualization.service.ts        # Visualización 3D
│   │   │   ├── storage.service.ts              # Almacenamiento local
│   │   │   └── python-integration.service.ts   # Integración con Python
│   │   ├── models/
│   │   │   └── quantum-behavior.model.ts       # Modelos de datos
│   │   └── app.routes.ts             # Configuración de rutas
│   ├── styles.scss                   # Estilos globales
│   └── index.html                    # HTML principal
├── tailwind.config.js                # Configuración de Tailwind CSS
└── package.json                      # Dependencias del proyecto
```

## 🎨 Componentes Principales

### 1. Landing Page
- Página de inicio con introducción a la computación cuántica
- Navegación a las diferentes secciones de la aplicación

### 2. Bloch Sphere Component
- Visualización 3D interactiva de la esfera de Bloch
- Controles para manipular el estado del qubit (θ y φ)
- Aplicación de puertas cuánticas con animaciones

### 3. Circuit Designer
- Panel lateral con puertas cuánticas disponibles
- Canvas para construir circuitos arrastrando y soltando
- Panel de resultados con esfera de Bloch y probabilidades
- Exportación a código Qiskit

### 4. Algorithm Explorer
- Biblioteca de algoritmos cuánticos predefinidos
- Visualización interactiva de cada algoritmo
- Código Python/Qiskit de ejemplo
- Explicaciones paso a paso

### 5. Gate Visualizer
- Guía interactiva de puertas cuánticas
- Visualización del efecto de cada puerta
- Ejemplos de código Qiskit
- Matrices de transformación

## 🔧 Servicios

### QuantumCircuitService
Gestiona la creación, modificación y simulación de circuitos cuánticos.

```typescript
// Crear un nuevo circuito
const circuit = circuitService.createCircuit(2, 'Mi Circuito');

// Agregar puertas
circuitService.addGate('h', [0]);
circuitService.addGate('cx', [1], [0]);

// Simular
const results = await circuitService.simulateCircuit(circuit);
```

### VisualizationService
Maneja las visualizaciones 3D con Three.js.

```typescript
// Inicializar escena
visualizationService.initializeScene(container, config);

// Crear esfera de Bloch
const blochSphere = visualizationService.createBlochSphere();

// Actualizar estado
visualizationService.updateBlochSphereState(theta, phi);
```

### StorageService
Gestiona el almacenamiento local de configuraciones.

```typescript
// Guardar configuración
storageService.saveConfiguration(config);

// Cargar configuraciones
const configs = storageService.getAllConfigurations();

// Exportar a JSON
const json = storageService.exportConfiguration(id);
```

### PythonIntegrationService
Servicio preparado para integración con backend Python/Qiskit.

```typescript
// Ejecutar algoritmo
pythonService.executeAlgorithm('grover', { target: 3 })
  .subscribe(results => console.log(results));

// Simular circuito
pythonService.simulateCircuit(qiskitCode, 1000)
  .subscribe(results => console.log(results));
```

## 🐍 Integración con Python

Los archivos Python en el directorio raíz (`ejemplo_01_qubit_basico.py`, `ejemplo_02_puertas_basicas.py`, etc.) contienen los algoritmos cuánticos implementados con Qiskit.

### Para integrar con el backend Python:

1. Crear un servidor Flask/FastAPI:

```python
# backend/server.py
from flask import Flask, request, jsonify
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

app = Flask(__name__)

@app.route('/api/simulate', methods=['POST'])
def simulate_circuit():
    data = request.json
    code = data.get('code')
    shots = data.get('shots', 1000)
    
    # Ejecutar código Qiskit
    # ... implementación ...
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(port=5000)
```

2. Actualizar `PythonIntegrationService` para hacer llamadas HTTP reales:

```typescript
simulateCircuit(qiskitCode: string, shots: number = 1000): Observable<any> {
  return this.http.post(`${this.API_URL}/simulate`, { code: qiskitCode, shots });
}
```

## 💾 Almacenamiento de Datos

Los datos se guardan en `localStorage` en formato JSON:

```json
{
  "id": "config_1234567890",
  "name": "Mi Circuito Bell",
  "circuit": {
    "qubits": 2,
    "gates": [
      { "gateId": "h", "qubitTargets": [0], "position": 0 },
      { "gateId": "cx", "qubitTargets": [1], "controlQubits": [0], "position": 1 }
    ]
  },
  "results": {
    "counts": { "00": 500, "11": 500 },
    "probabilities": { "00": 0.5, "11": 0.5 }
  }
}
```

## 🎯 Próximos Pasos

1. **Backend Python**: Implementar servidor Flask/FastAPI para ejecutar código Qiskit real
2. **Más Algoritmos**: Agregar VQE, QAOA, Quantum Teleportation
3. **Animaciones Avanzadas**: Mejorar transiciones entre estados cuánticos
4. **Editor de Código**: Agregar editor Monaco para editar código Qiskit directamente
5. **Colaboración**: Permitir compartir circuitos entre usuarios
6. **Tutoriales Interactivos**: Guías paso a paso para aprender conceptos cuánticos

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 📧 Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

Desarrollado con ❤️ para la comunidad de computación cuántica
