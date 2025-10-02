# Ejemplo 4: Algoritmo de Deutsch-Jozsa
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

print("=== EJEMPLO 4: ALGORITMO DE DEUTSCH-JOZSA ===")
print("Determina si una función es constante o balanceada en una sola consulta")

simulator = AerSimulator()

def deutsch_jozsa_oracle(function_type, n_qubits):
    """
    Crea un oráculo para el algoritmo de Deutsch-Jozsa
    function_type: 'constant_0', 'constant_1', 'balanced'
    """
    oracle = QuantumCircuit(n_qubits + 1)
    
    if function_type == 'constant_0':
        # f(x) = 0 para todos los x (no hacer nada)
        pass
    elif function_type == 'constant_1':
        # f(x) = 1 para todos los x
        oracle.x(n_qubits)  # Flip del qubit auxiliar
    elif function_type == 'balanced':
        # f(x) = x₀ (función balanceada simple)
        oracle.cx(0, n_qubits)  # CNOT del primer qubit al auxiliar
    
    return oracle

def deutsch_jozsa_algorithm(oracle, n_qubits):
    """Implementa el algoritmo de Deutsch-Jozsa"""
    qc = QuantumCircuit(n_qubits + 1, n_qubits)
    
    # 1. Inicialización
    # Preparar qubits de entrada en superposición
    for i in range(n_qubits):
        qc.h(i)
    
    # Preparar qubit auxiliar en |1⟩
    qc.x(n_qubits)
    qc.h(n_qubits)
    
    # 2. Aplicar el oráculo
    qc = qc.compose(oracle)
    
    # 3. Aplicar Hadamard a los qubits de entrada
    for i in range(n_qubits):
        qc.h(i)
    
    # 4. Medir solo los qubits de entrada
    qc.measure(range(n_qubits), range(n_qubits))
    
    return qc

# Ejemplo con 2 qubits
n_qubits = 2

# 1. Función constante f(x) = 0
print("\n--- Función Constante f(x) = 0 ---")
oracle_const_0 = deutsch_jozsa_oracle('constant_0', n_qubits)
qc_const_0 = deutsch_jozsa_algorithm(oracle_const_0, n_qubits)

job = simulator.run(transpile(qc_const_0, simulator), shots=1000)
counts = job.result().get_counts(qc_const_0)
print(f"Resultados: {counts}")
print("Resultado: 00 → Función CONSTANTE")
print(qc_const_0.draw())

# 2. Función constante f(x) = 1
print("\n--- Función Constante f(x) = 1 ---")
oracle_const_1 = deutsch_jozsa_oracle('constant_1', n_qubits)
qc_const_1 = deutsch_jozsa_algorithm(oracle_const_1, n_qubits)

job = simulator.run(transpile(qc_const_1, simulator), shots=1000)
counts = job.result().get_counts(qc_const_1)
print(f"Resultados: {counts}")
print("Resultado: 00 → Función CONSTANTE")

# 3. Función balanceada f(x) = x₀
print("\n--- Función Balanceada f(x) = x₀ ---")
oracle_balanced = deutsch_jozsa_oracle('balanced', n_qubits)
qc_balanced = deutsch_jozsa_algorithm(oracle_balanced, n_qubits)

job = simulator.run(transpile(qc_balanced, simulator), shots=1000)
counts = job.result().get_counts(qc_balanced)
print(f"Resultados: {counts}")
print("Resultado: ≠ 00 → Función BALANCEADA")
print(qc_balanced.draw())

print("\n--- Ventaja Cuántica ---")
print("Clásicamente: necesitarías 2^(n-1) + 1 consultas en el peor caso")
print("Cuánticamente: ¡Solo 1 consulta!")
print(f"Para n={n_qubits}: Clásico = {2**(n_qubits-1) + 1} vs Cuántico = 1")
