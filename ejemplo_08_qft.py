# Ejemplo 8: Transformada Cuántica de Fourier (QFT)
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
import numpy as np

print("=== EJEMPLO 8: TRANSFORMADA CUÁNTICA DE FOURIER (QFT) ===")
print("Versión cuántica de la Transformada Discreta de Fourier")

simulator = AerSimulator()

def qft_rotations(circuit, n):
    """Aplica las rotaciones de la QFT"""
    if n == 0:
        return circuit
    
    n -= 1
    circuit.h(n)
    
    for qubit in range(n):
        circuit.cp(np.pi/2**(n-qubit), qubit, n)
    
    qft_rotations(circuit, n)

def swap_registers(circuit, n):
    """Intercambia los qubits para obtener el orden correcto"""
    for qubit in range(n//2):
        circuit.swap(qubit, n-qubit-1)
    return circuit

def qft(n):
    """Crea un circuito QFT para n qubits"""
    qc = QuantumCircuit(n)
    qft_rotations(qc, n)
    swap_registers(qc, n)
    return qc

def inverse_qft(n):
    """Crea un circuito QFT inversa para n qubits"""
    qc = qft(n)
    return qc.inverse()

# Ejemplo 1: QFT de 3 qubits
print("\n--- QFT de 3 qubits ---")
n_qubits = 3
qc_qft = QuantumCircuit(n_qubits, n_qubits)

# Preparar un estado inicial específico |101⟩
qc_qft.x(0)  # qubit 0 = 1
qc_qft.x(2)  # qubit 2 = 1
qc_qft.barrier()

# Aplicar QFT
qft_circuit = qft(n_qubits)
qc_qft = qc_qft.compose(qft_circuit)
qc_qft.barrier()

# Medir
qc_qft.measure(range(n_qubits), range(n_qubits))

print("Estado inicial: |101⟩")
print("Circuito QFT:")
print(qc_qft.draw())

job = simulator.run(transpile(qc_qft, simulator), shots=1000)
counts = job.result().get_counts(qc_qft)
print(f"Resultados después de QFT: {counts}")

# Ejemplo 2: QFT + QFT inversa (debería recuperar el estado original)
print("\n--- QFT + QFT Inversa ---")
qc_round_trip = QuantumCircuit(n_qubits, n_qubits)

# Estado inicial |110⟩
qc_round_trip.x(1)
qc_round_trip.x(2)
qc_round_trip.barrier()

# Aplicar QFT
qc_round_trip = qc_round_trip.compose(qft(n_qubits))
qc_round_trip.barrier()

# Aplicar QFT inversa
qc_round_trip = qc_round_trip.compose(inverse_qft(n_qubits))
qc_round_trip.barrier()

# Medir
qc_round_trip.measure(range(n_qubits), range(n_qubits))

print("Estado inicial: |110⟩")
job = simulator.run(transpile(qc_round_trip, simulator), shots=1000)
counts_round_trip = job.result().get_counts(qc_round_trip)
print(f"Después de QFT + QFT⁻¹: {counts_round_trip}")
print("Debería recuperar |110⟩")

# Ejemplo 3: Detección de periodicidad
print("\n--- Detección de Periodicidad con QFT ---")

def create_periodic_state(n, period):
    """Crea un estado con periodicidad específica"""
    qc = QuantumCircuit(n)
    
    # Crear superposición uniforme
    for i in range(n):
        qc.h(i)
    
    # Simular una función periódica aplicando fases
    for i in range(2**n):
        if i % period == 0:
            # Aplicar fase a los estados que son múltiplos del período
            binary = format(i, f'0{n}b')
            # Aplicar Z controlado múltiple para este estado específico
            controls = []
            targets = []
            for j, bit in enumerate(binary):
                if bit == '1':
                    controls.append(j)
                else:
                    targets.append(j)
            
            # Aplicar X a los qubits que deben ser 0
            for target in targets:
                qc.x(target)
            
            # Aplicar fase
            if len(controls) > 0:
                if len(controls) == 1:
                    qc.z(controls[0])
                else:
                    qc.mcp(np.pi, controls[:-1], controls[-1])
            
            # Deshacer las X
            for target in targets:
                qc.x(target)
    
    return qc

# Crear estado con período 2
period = 2
qc_periodic = create_periodic_state(n_qubits, period)
qc_periodic.barrier()

# Aplicar QFT para detectar la periodicidad
qc_periodic = qc_periodic.compose(qft(n_qubits))
qc_periodic.measure(range(n_qubits), range(n_qubits))

print(f"Función con período {period}:")
job = simulator.run(transpile(qc_periodic, simulator), shots=1000)
counts_periodic = job.result().get_counts(qc_periodic)
print(f"Resultados QFT: {counts_periodic}")
print("Los picos en la QFT revelan la periodicidad")

# Ejemplo 4: QFT manual para 2 qubits (educativo)
print("\n--- QFT Manual para 2 qubits ---")
qc_manual = QuantumCircuit(2, 2)

# Estado inicial |11⟩
qc_manual.x(0)
qc_manual.x(1)
qc_manual.barrier()

# QFT manual paso a paso
print("Aplicando QFT paso a paso:")

# Paso 1: H en qubit 1
qc_manual.h(1)
print("1. Aplicar H al qubit 1")

# Paso 2: Rotación controlada
qc_manual.cp(np.pi/2, 0, 1)  # R₂ controlada
print("2. Aplicar rotación R₂ controlada")

# Paso 3: H en qubit 0
qc_manual.h(0)
print("3. Aplicar H al qubit 0")

# Paso 4: Intercambiar qubits
qc_manual.swap(0, 1)
print("4. Intercambiar qubits")

qc_manual.barrier()
qc_manual.measure([0, 1], [0, 1])

print("\nCircuito QFT manual:")
print(qc_manual.draw())

job = simulator.run(transpile(qc_manual, simulator), shots=1000)
counts_manual = job.result().get_counts(qc_manual)
print(f"Resultados: {counts_manual}")

# Comparar con QFT automática
qc_auto = QuantumCircuit(2, 2)
qc_auto.x(0)
qc_auto.x(1)
qc_auto.barrier()
qc_auto = qc_auto.compose(qft(2))
qc_auto.measure([0, 1], [0, 1])

job = simulator.run(transpile(qc_auto, simulator), shots=1000)
counts_auto = job.result().get_counts(qc_auto)
print(f"QFT automática: {counts_auto}")

print("\n--- Aplicaciones de la QFT ---")
print("1. Algoritmo de Shor (factorización)")
print("2. Estimación de fase cuántica")
print("3. Algoritmos de período oculto")
print("4. Procesamiento de señales cuánticas")
print("5. Algoritmos de optimización cuántica")

print("\n--- Complejidad ---")
print("QFT clásica (FFT): O(n log n)")
print("QFT cuántica: O(n²) puertas, pero exponencialmente más información")
print("¡La QFT puede procesar 2ⁿ amplitudes simultáneamente!")
