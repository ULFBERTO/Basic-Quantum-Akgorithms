# Ejemplo 3: Entrelazamiento Cuántico
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

print("=== EJEMPLO 3: ENTRELAZAMIENTO CUÁNTICO ===")
print("Creando pares de qubits entrelazados")

simulator = AerSimulator()

# 1. Estado de Bell |Φ+⟩ = (|00⟩ + |11⟩)/√2
print("\n--- Estado de Bell |Φ+⟩ ---")
qc_bell = QuantumCircuit(2, 2)
qc_bell.h(0)        # Superposición en qubit 0
qc_bell.cx(0, 1)    # CNOT: entrelaza qubit 0 con qubit 1
qc_bell.measure([0, 1], [0, 1])

job = simulator.run(transpile(qc_bell, simulator), shots=1000)
counts = job.result().get_counts(qc_bell)
print(f"Resultados: {counts}")
print("Solo obtenemos |00⟩ y |11⟩ - ¡Los qubits están entrelazados!")
print(qc_bell.draw())

# 2. Estado de Bell |Φ-⟩ = (|00⟩ - |11⟩)/√2
print("\n--- Estado de Bell |Φ-⟩ ---")
qc_bell_minus = QuantumCircuit(2, 2)
qc_bell_minus.h(0)
qc_bell_minus.z(0)      # Fase negativa
qc_bell_minus.cx(0, 1)
qc_bell_minus.measure([0, 1], [0, 1])

job = simulator.run(transpile(qc_bell_minus, simulator), shots=1000)
counts = job.result().get_counts(qc_bell_minus)
print(f"Resultados: {counts}")
print(qc_bell_minus.draw())

# 3. Estado de Bell |Ψ+⟩ = (|01⟩ + |10⟩)/√2
print("\n--- Estado de Bell |Ψ+⟩ ---")
qc_psi_plus = QuantumCircuit(2, 2)
qc_psi_plus.h(0)
qc_psi_plus.cx(0, 1)
qc_psi_plus.x(1)        # Flip del segundo qubit
qc_psi_plus.measure([0, 1], [0, 1])

job = simulator.run(transpile(qc_psi_plus, simulator), shots=1000)
counts = job.result().get_counts(qc_psi_plus)
print(f"Resultados: {counts}")
print("Solo obtenemos |01⟩ y |10⟩ - Estados anti-correlacionados")
print(qc_psi_plus.draw())

# 4. Demostración de correlación cuántica
print("\n--- Demostración de Correlación ---")
print("En el entrelazamiento:")
print("- Si mides el primer qubit como 0, el segundo SIEMPRE será 0")
print("- Si mides el primer qubit como 1, el segundo SIEMPRE será 1")
print("- Esto ocurre instantáneamente, sin importar la distancia!")

# 5. Entrelazamiento de 3 qubits (Estado GHZ)
print("\n--- Estado GHZ (3 qubits) ---")
qc_ghz = QuantumCircuit(3, 3)
qc_ghz.h(0)
qc_ghz.cx(0, 1)
qc_ghz.cx(1, 2)
qc_ghz.measure([0, 1, 2], [0, 1, 2])

job = simulator.run(transpile(qc_ghz, simulator), shots=1000)
counts = job.result().get_counts(qc_ghz)
print(f"Resultados: {counts}")
print("Estado GHZ: (|000⟩ + |111⟩)/√2")
print(qc_ghz.draw())
