# 1. Importar las herramientas necesarias
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram

# 2. Crear un circuito cuántico con 2 qubits y 2 bits clásicos
# Los qubits son para las operaciones cuánticas y los bits clásicos para guardar el resultado
qc = QuantumCircuit(2, 2)

# 3. Añadir las puertas para crear un estado de Bell
# Aplicar una puerta Hadamard al primer qubit (q0)
qc.h(0)
# Aplicar una puerta Controlled-NOT (CNOT) con q0 como control y q1 como objetivo
qc.cx(0, 1)

# 4. Mapear la medida de los qubits a los bits clásicos
qc.measure([0,1], [0,1])

# 5. Usar el simulador Aer de Qiskit
simulator = AerSimulator()

# 6. Compilar el circuito para el simulador (un paso de optimización)
compiled_circuit = transpile(qc, simulator)

# 7. Ejecutar el circuito en el simulador 1024 veces (shots)
job = simulator.run(compiled_circuit, shots=1024)

# 8. Obtener los resultados
result = job.result()
counts = result.get_counts(compiled_circuit)

# 9. Imprimir los resultados y el circuito
print("\nResultados del conteo:")
print(counts)
print("\nDiagrama del circuito:")
print(qc.draw("text"))

# Para mostrar un histograma gráfico, necesitarías ejecutar esto en un entorno que lo soporte (como un Jupyter Notebook)
# descomentando la siguiente línea:
# plot_histogram(counts).show()