from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

# Crear un circuito con 1 qubit y 1 bit clasico
qc = QuantumCircuit(1, 1)

# Aplicar una puerta Hadamard para crear superposicion
qc.h(0)

# Medir el qubit
qc.measure([0], [0])

# Simular la ejecucion
simulator = AerSimulator()
compiled_circuit = transpile(qc, simulator)
job = simulator.run(compiled_circuit, shots=1024)
result = job.result()
counts = result.get_counts(compiled_circuit)

# Imprimir resultados
print("Resultados del conteo:")
print(counts)
print("\nDiagrama del circuito:")
print(qc.draw("text"))
