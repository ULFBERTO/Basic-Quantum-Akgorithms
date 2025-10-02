# 🚀 Computación Cuántica con Qiskit

Una colección completa de ejemplos prácticos de computación cuántica implementados con Qiskit, desde conceptos básicos hasta algoritmos avanzados.

## 📋 Tabla de Contenidos

- [Instalación](#instalación)
- [Ejemplos Básicos](#ejemplos-básicos)
- [Algoritmos Cuánticos Famosos](#algoritmos-cuánticos-famosos)
- [Aplicaciones Prácticas](#aplicaciones-prácticas)
- [Criptografía Cuántica](#criptografía-cuántica)
- [Optimización Cuántica](#optimización-cuántica)
- [Recursos Adicionales](#recursos-adicionales)

## 🛠️ Instalación

### Prerrequisitos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Configuración del Entorno

1. **Clonar o descargar los archivos**
2. **Crear entorno virtual:**
   ```bash
   python -m venv venv
   ```

3. **Activar el entorno virtual:**
   ```bash
   # Windows
   .\venv\Scripts\Activate.ps1
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

## 🎯 Ejemplos Básicos

### 1. Qubit Básico (`ejemplo_01_qubit_basico.py`)
**Concepto:** Estados fundamentales |0⟩ y |1⟩

```python
python ejemplo_01_qubit_basico.py
```

**Qué aprenderás:**
- Estados cuánticos básicos
- Medición de qubits
- Diferencia entre |0⟩ y |1⟩
- Puerta X (NOT cuántico)

**Conceptos clave:**
- **Estado |0⟩:** Estado fundamental del qubit
- **Estado |1⟩:** Estado excitado del qubit
- **Puerta X:** Intercambia |0⟩ ↔ |1⟩

### 2. Puertas Cuánticas Básicas (`ejemplo_02_puertas_basicas.py`)
**Concepto:** Operaciones fundamentales en qubits

```python
python ejemplo_02_puertas_basicas.py
```

**Qué aprenderás:**
- Puertas de Pauli (X, Y, Z)
- Puerta Hadamard (H)
- Rotaciones cuánticas
- Superposición cuántica

**Conceptos clave:**
- **Puerta H:** Crea superposición (|0⟩ + |1⟩)/√2
- **Puerta Z:** Aplica fase negativa a |1⟩
- **Superposición:** Estado cuántico en múltiples estados simultáneamente

### 3. Entrelazamiento Cuántico (`ejemplo_03_entrelazamiento.py`)
**Concepto:** Correlaciones cuánticas no-locales

```python
python ejemplo_03_entrelazamiento.py
```

**Qué aprenderás:**
- Estados de Bell
- Correlaciones cuánticas
- Entrelazamiento de múltiples qubits
- Estado GHZ

**Conceptos clave:**
- **Estados de Bell:** Máximo entrelazamiento entre 2 qubits
- **Correlación cuántica:** Medición instantánea correlacionada
- **No-localidad:** Efectos que trascienden la distancia

## 🧮 Algoritmos Cuánticos Famosos

### 4. Algoritmo de Deutsch-Jozsa (`ejemplo_04_deutsch_jozsa.py`)
**Problema:** Determinar si una función es constante o balanceada

```python
python ejemplo_04_deutsch_jozsa.py
```

**Ventaja cuántica:**
- **Clásico:** Hasta 2^(n-1) + 1 consultas
- **Cuántico:** Solo 1 consulta

**Conceptos clave:**
- **Oráculo cuántico:** Función implementada como circuito
- **Interferencia cuántica:** Amplificación de amplitudes correctas
- **Paralelismo cuántico:** Evaluar todas las entradas simultáneamente

### 5. Algoritmo de Grover (`ejemplo_05_grover.py`)
**Problema:** Búsqueda en base de datos no ordenada

```python
python ejemplo_05_grover.py
```

**Ventaja cuántica:**
- **Clásico:** O(N) consultas promedio
- **Cuántico:** O(√N) consultas

**Conceptos clave:**
- **Amplificación de amplitud:** Aumentar probabilidad del estado correcto
- **Operador de difusión:** Reflexión sobre el estado promedio
- **Rotación en espacio de amplitudes:** Geometría del algoritmo

### 6. Algoritmo de Simon (`ejemplo_06_simon.py`)
**Problema:** Encontrar el período oculto de una función

```python
python ejemplo_06_simon.py
```

**Ventaja cuántica:**
- **Clásico:** ~2^(n/2) consultas
- **Cuántico:** n consultas

**Conceptos clave:**
- **Período oculto:** f(x) = f(x ⊕ s) para s secreto
- **Sistema de ecuaciones lineales:** Resolver en GF(2)
- **Base para Shor:** Fundamento del algoritmo de factorización

## 🔬 Aplicaciones Prácticas

### 7. Teleportación Cuántica (`ejemplo_07_teleportacion.py`)
**Concepto:** Transferir estado cuántico usando entrelazamiento

```python
python ejemplo_07_teleportacion.py
```

**Protocolo:**
1. Alice y Bob comparten par entrelazado
2. Alice realiza medición de Bell
3. Alice envía 2 bits clásicos a Bob
4. Bob aplica correcciones
5. ¡Bob tiene el estado original!

**Conceptos clave:**
- **No-cloning theorem:** No se puede copiar estados cuánticos
- **Canal cuántico:** Transferencia de información cuántica
- **Medición de Bell:** Proyección en base de estados entrelazados

### 8. Transformada Cuántica de Fourier (`ejemplo_08_qft.py`)
**Concepto:** Versión cuántica de la FFT

```python
python ejemplo_08_qft.py
```

**Aplicaciones:**
- Algoritmo de Shor
- Estimación de fase
- Detección de periodicidad

**Conceptos clave:**
- **Rotaciones controladas:** Fases dependientes de qubits de control
- **Intercambio de registros:** Orden correcto de salida
- **Exponencial speedup:** Procesa 2^n amplitudes simultáneamente

### 9. Variational Quantum Eigensolver (`ejemplo_09_vqe.py`)
**Concepto:** Encontrar estados fundamentales de Hamiltonianos

```python
python ejemplo_09_vqe.py
```

**Aplicaciones:**
- Química cuántica (moléculas)
- Ciencia de materiales
- Optimización

**Conceptos clave:**
- **Algoritmo híbrido:** Combina cuántico + clásico
- **Ansatz variacional:** Circuito parametrizado
- **NISQ-friendly:** Tolerante a ruido

## 🔐 Criptografía Cuántica

### Protocolo BB84 (`practica_3_bb84.py`)
**Concepto:** Distribución cuántica de claves

```python
python practica_3_bb84.py
```

**Seguridad:**
- Basada en principios cuánticos
- Detección automática de espionaje
- Seguridad incondicional

### Estados de Bell (`practica_1_bell.py`)
**Concepto:** Entrelazamiento máximo

```python
python practica_1_bell.py
```

### Superposición (`practica_2_superposicion.py`)
**Concepto:** Estados cuánticos superpuestos

```python
python practica_2_superposicion.py
```

## ⚡ Optimización Cuántica

### QAOA MaxCut (`practica_4_qaoa_maxcut.py`)
**Concepto:** Optimización aproximada cuántica

```python
python practica_4_qaoa_maxcut.py
```

**Problema:** Encontrar el corte máximo en un grafo
**Método:** Algoritmo variacional híbrido

## 📊 Interpretación de Resultados

### Formato de Salida
Los resultados se muestran como diccionarios:
```python
{'00': 502, '11': 498}
```
- **Clave:** String binario (estado medido)
- **Valor:** Número de veces observado

### Probabilidades Cuánticas
- **Determinísticos:** Un solo resultado (ej: {'0': 1000})
- **Superposición:** Múltiples resultados (ej: {'0': 500, '1': 500})
- **Entrelazados:** Correlaciones específicas (ej: {'00': 500, '11': 500})

## 🎓 Conceptos Fundamentales

### Mecánica Cuántica Básica
- **Superposición:** |ψ⟩ = α|0⟩ + β|1⟩
- **Entrelazamiento:** Estados no separables
- **Medición:** Colapso del estado cuántico
- **No-cloning:** Imposible copiar estados cuánticos desconocidos

### Puertas Cuánticas
- **Unitarias:** Operaciones reversibles
- **Universales:** Conjunto completo para cualquier computación
- **Controladas:** Operaciones condicionales

### Algoritmos Cuánticos
- **Oráculo:** Función como caja negra
- **Amplificación:** Aumentar probabilidades deseadas
- **Interferencia:** Cancelar amplitudes no deseadas

## 🚀 Próximos Pasos

### Para Principiantes
1. Ejecuta los ejemplos básicos (01-03)
2. Experimenta con diferentes estados iniciales
3. Modifica los parámetros y observa los cambios

### Para Intermedios
1. Implementa variaciones de los algoritmos
2. Combina diferentes técnicas
3. Analiza la complejidad computacional

### Para Avanzados
1. Implementa algoritmos no incluidos (Shor, HHL)
2. Optimiza para hardware real
3. Desarrolla nuevas aplicaciones

## 📚 Recursos Adicionales

### Documentación
- [Qiskit Documentation](https://qiskit.org/documentation/)
- [Qiskit Textbook](https://qiskit.org/textbook/)
- [IBM Quantum Experience](https://quantum-computing.ibm.com/)

### Libros Recomendados
- "Quantum Computation and Quantum Information" - Nielsen & Chuang
- "Programming Quantum Computers" - Johnston, Harrigan & Gimeno-Segovia
- "Quantum Computing: An Applied Approach" - Hidary

### Cursos Online
- IBM Qiskit Global Summer School
- Microsoft Quantum Development Kit
- Coursera: Introduction to Quantum Computing

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para nuevos ejemplos o mejoras:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa tus cambios
4. Envía un pull request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🐛 Reporte de Errores

Si encuentras algún error o tienes sugerencias:
- Abre un issue en GitHub
- Incluye el código que causa el problema
- Describe el comportamiento esperado vs actual

---

**¡Feliz computación cuántica! 🌌⚛️**

*"Si crees que entiendes la mecánica cuántica, entonces no la entiendes"* - Richard Feynman
