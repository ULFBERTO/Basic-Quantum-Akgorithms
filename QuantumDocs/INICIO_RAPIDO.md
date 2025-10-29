# 🚀 Inicio Rápido - QuantumLeap

## Opción 1: Solo Frontend (Simulación Mock)

### Paso 1: Instalar Dependencias
```bash
cd D:\EVIROMENT\Basic-Quantum-Akgorithms\QuantumDocs
npm install
```

### Paso 2: Iniciar la Aplicación
```bash
npm start
```

### Paso 3: Abrir en el Navegador
Navega a: `http://localhost:4200`

¡Listo! La aplicación funcionará con simulaciones mock (sin backend Python).

---

## Opción 2: Frontend + Backend Python (Simulación Real)

### Paso 1: Configurar el Backend

#### 1.1 Crear entorno virtual Python
```bash
cd D:\EVIROMENT\Basic-Quantum-Akgorithms\QuantumDocs\backend-example
python -m venv venv
```

#### 1.2 Activar entorno virtual
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

#### 1.3 Instalar dependencias Python
```bash
pip install -r requirements.txt
```

#### 1.4 Iniciar el servidor Flask
```bash
python server.py
```

El servidor estará disponible en `http://localhost:5000`

### Paso 2: Configurar el Frontend

#### 2.1 Abrir una nueva terminal
```bash
cd D:\EVIROMENT\Basic-Quantum-Akgorithms\QuantumDocs
```

#### 2.2 Instalar dependencias (si no lo hiciste antes)
```bash
npm install
```

#### 2.3 Habilitar integración con backend

Editar `src/app/services/python-integration.service.ts`:

**Comentar las líneas mock:**
```typescript
// Mock response por ahora
// return of({...}).pipe(delay(500));
```

**Descomentar las llamadas HTTP reales:**
```typescript
// Descomentar esta línea:
return this.http.post(`${this.API_URL}/execute`, { algorithmName, parameters });
```

#### 2.4 Agregar HttpClient

Editar `src/app/app.config.ts`:
```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()  // Agregar esta línea
  ]
};
```

#### 2.5 Iniciar la aplicación Angular
```bash
npm start
```

### Paso 3: Verificar la Integración

1. Abre `http://localhost:4200`
2. Ve al "Diseñador de Circuitos"
3. Crea un circuito simple (H + CNOT)
4. Haz clic en "Simular"
5. Deberías ver resultados reales de Qiskit

---

## 🎯 Primeros Pasos en la Aplicación

### 1. Explorar la Landing Page
- Navega por las secciones
- Lee sobre computación cuántica
- Haz clic en "Comienza tu Viaje"

### 2. Visualizador de Puertas
- Ve a "Puertas Cuánticas"
- Selecciona una puerta (ej: Hadamard)
- Observa la visualización 3D de la Esfera de Bloch
- Ajusta los controles θ y φ
- Aplica diferentes puertas

### 3. Diseñador de Circuitos
- Ve a "Diseñador"
- Selecciona puertas del panel izquierdo
- Construye un circuito simple:
  1. Selecciona puerta H
  2. Aplícala al qubit 0
  3. Selecciona puerta CNOT
  4. Aplícala entre qubits 0 y 1
- Haz clic en "Simular"
- Observa los resultados en el panel derecho

### 4. Explorador de Algoritmos
- Ve a "Algoritmos"
- Selecciona "Algoritmo de Grover"
- Lee la explicación
- Observa el código Python
- Ve la visualización interactiva

### 5. Guardar tu Trabajo
- En el Diseñador, haz clic en el ícono de guardar
- Tu circuito se guardará en localStorage
- Puedes exportarlo como JSON o código Qiskit

---

## 🔧 Solución de Problemas

### Error: "Cannot find module 'three'"
```bash
npm install three @types/three --save
```

### Error: "Port 4200 is already in use"
```bash
# Cambiar el puerto
ng serve --port 4300
```

### Error: Backend no responde
1. Verifica que el servidor Flask esté corriendo
2. Verifica que no haya errores en la consola del servidor
3. Verifica que CORS esté habilitado

### Error: "Module not found" en Python
```bash
# Asegúrate de estar en el entorno virtual
pip install -r requirements.txt
```

### La Esfera de Bloch no se muestra
1. Abre la consola del navegador (F12)
2. Busca errores de Three.js
3. Verifica que WebGL esté habilitado en tu navegador

---

## 📱 Acceso desde Otros Dispositivos

### En la misma red local:

1. Obtén tu IP local:
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

2. Inicia la aplicación con:
```bash
ng serve --host 0.0.0.0
```

3. Accede desde otro dispositivo:
```
http://TU_IP_LOCAL:4200
```

---

## 🎓 Tutoriales Recomendados

### Tutorial 1: Crear tu Primer Circuito Bell
1. Ve al Diseñador
2. Aplica puerta H al qubit 0
3. Aplica puerta CNOT (control: 0, target: 1)
4. Simula
5. Observa el entrelazamiento: solo verás |00⟩ y |11⟩

### Tutorial 2: Superposición con Hadamard
1. Ve al Visualizador de Puertas
2. Selecciona "Hadamard Gate"
3. Observa cómo el vector de estado se mueve a la posición ecuatorial
4. Esto representa una superposición 50/50 de |0⟩ y |1⟩

### Tutorial 3: Explorar Grover
1. Ve al Explorador de Algoritmos
2. Selecciona "Algoritmo de Grover"
3. Lee la explicación paso a paso
4. Observa cómo encuentra elementos en una base de datos

---

## 📊 Ejemplos de Circuitos

### Circuito Bell State
```python
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()
```

### Superposición de 3 Qubits
```python
qc = QuantumCircuit(3, 3)
qc.h([0, 1, 2])
qc.measure_all()
```

### Teletransportación Cuántica
```python
qc = QuantumCircuit(3, 3)
qc.h(1)
qc.cx(1, 2)
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])
```

---

## 🎉 ¡Felicidades!

Ya tienes QuantumLeap funcionando. Explora, experimenta y aprende sobre computación cuántica de forma interactiva.

### Próximos Pasos:
- [ ] Crear tus propios circuitos
- [ ] Experimentar con diferentes puertas
- [ ] Estudiar los algoritmos incluidos
- [ ] Modificar el código para agregar nuevas funcionalidades
- [ ] Compartir tus descubrimientos

### Recursos de Aprendizaje:
- [Qiskit Textbook](https://qiskit.org/textbook/)
- [IBM Quantum Experience](https://quantum-computing.ibm.com/)
- [Quantum Computing for Computer Scientists](https://www.youtube.com/watch?v=F_Riqjdh2oM)

---

¿Necesitas ayuda? Abre un issue en el repositorio o consulta la documentación completa en `README.md` y `GUIA_DESARROLLO.md`.
