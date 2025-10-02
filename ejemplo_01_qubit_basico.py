# Ejemplo 1: Qubit Básico - Estados |0⟩ y |1⟩
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

print("=== EJEMPLO 1: QUBIT BÁSICO ===")
print("Demostración de los estados básicos |0⟩ y |1⟩")

# 1. Estado |0⟩ (por defecto)
print("\n--- Estado |0⟩ ---")
qc_0 = QuantumCircuit(1, 1)
qc_0.measure(0, 0)

simulator = AerSimulator()
job_0 = simulator.run(transpile(qc_0, simulator), shots=1000)
result_0 = job_0.result()
counts_0 = result_0.get_counts(qc_0)

print(f"Resultados: {counts_0}")
print("El qubit siempre se mide como 0")

# 2. Estado |1⟩ (aplicando puerta X)
print("\n--- Estado |1⟩ ---")
qc_1 = QuantumCircuit(1, 1)
qc_1.x(0)  # Puerta X (NOT cuántico)
qc_1.measure(0, 0)

job_1 = simulator.run(transpile(qc_1, simulator), shots=1000)
result_1 = job_1.result()
counts_1 = result_1.get_counts(qc_1)

print(f"Resultados: {counts_1}")
print("El qubit siempre se mide como 1")

# Visualización
print("\n--- Circuitos ---")
print("Estado |0⟩:")
print(qc_0.draw())
print("\nEstado |1⟩:")
print(qc_1.draw())
