# Ejemplo 2: Puertas Cuánticas Básicas
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
import numpy as np

print("=== EJEMPLO 2: PUERTAS CUÁNTICAS BÁSICAS ===")

simulator = AerSimulator()

# 1. Puerta X (NOT cuántico)
print("\n--- Puerta X (NOT) ---")
qc_x = QuantumCircuit(1, 1)
qc_x.x(0)
qc_x.measure(0, 0)

job = simulator.run(transpile(qc_x, simulator), shots=1000)
counts = job.result().get_counts(qc_x)
print(f"X|0⟩ = |1⟩: {counts}")
print(qc_x.draw())

# 2. Puerta Y
print("\n--- Puerta Y ---")
qc_y = QuantumCircuit(1, 1)
qc_y.y(0)
qc_y.measure(0, 0)

job = simulator.run(transpile(qc_y, simulator), shots=1000)
counts = job.result().get_counts(qc_y)
print(f"Y|0⟩ = i|1⟩: {counts}")
print(qc_y.draw())

# 3. Puerta Z
print("\n--- Puerta Z ---")
qc_z = QuantumCircuit(1, 1)
qc_z.z(0)
qc_z.measure(0, 0)

job = simulator.run(transpile(qc_z, simulator), shots=1000)
counts = job.result().get_counts(qc_z)
print(f"Z|0⟩ = |0⟩: {counts}")
print(qc_z.draw())

# 4. Puerta Hadamard (H) - Crea superposición
print("\n--- Puerta Hadamard (H) ---")
qc_h = QuantumCircuit(1, 1)
qc_h.h(0)
qc_h.measure(0, 0)

job = simulator.run(transpile(qc_h, simulator), shots=1000)
counts = job.result().get_counts(qc_h)
print(f"H|0⟩ = (|0⟩ + |1⟩)/√2: {counts}")
print("¡Superposición! 50% probabilidad de 0 y 50% de 1")
print(qc_h.draw())

# 5. Rotaciones
print("\n--- Puerta de Rotación RX(π/4) ---")
qc_rx = QuantumCircuit(1, 1)
qc_rx.rx(np.pi/4, 0)  # Rotación de π/4 radianes
qc_rx.measure(0, 0)

job = simulator.run(transpile(qc_rx, simulator), shots=1000)
counts = job.result().get_counts(qc_rx)
print(f"RX(π/4)|0⟩: {counts}")
print(qc_rx.draw())
