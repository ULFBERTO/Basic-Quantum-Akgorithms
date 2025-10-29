# Backend Python para QuantumLeap

Este es un servidor Flask que ejecuta los algoritmos cuánticos de Qiskit y proporciona una API REST para la aplicación Angular.

## Instalación

1. Crear un entorno virtual:
```bash
python -m venv venv
```

2. Activar el entorno virtual:
- Windows:
```bash
venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

## Uso

1. Iniciar el servidor:
```bash
python server.py
```

2. El servidor estará disponible en `http://localhost:5000`

## Endpoints

### GET /api/health
Verifica que el servidor está funcionando.

### POST /api/simulate
Simula un circuito cuántico.

**Body:**
```json
{
  "code": "qc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()",
  "shots": 1000
}
```

### POST /api/visualize
Genera una imagen del circuito.

**Body:**
```json
{
  "code": "qc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)"
}
```

### POST /api/execute/<algorithm_name>
Ejecuta un algoritmo predefinido.

**Algoritmos disponibles:**
- `qubit_basico`
- `puertas_basicas`
- `entrelazamiento`
- `deutsch_jozsa`
- `grover`

### POST /api/validate
Valida código Qiskit.

**Body:**
```json
{
  "code": "código a validar"
}
```

### GET /api/algorithms
Lista todos los algoritmos disponibles.

## Integración con Angular

Para conectar la aplicación Angular con este backend:

1. Asegúrate de que el servidor esté corriendo en `http://localhost:5000`

2. En `python-integration.service.ts`, descomenta las llamadas HTTP reales y comenta los mocks

3. La aplicación Angular ahora ejecutará código Qiskit real
