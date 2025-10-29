# Ejemplo 5: Algoritmo de Grover (Búsqueda Cuántica)
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
import numpy as np

print("=== EJEMPLO 5: ALGORITMO DE GROVER ===")
print("Búsqueda cuántica en base de datos no ordenada")

simulator = AerSimulator()
 
def grover_oracle(marked_items, n_qubits):
    """
    Crea un oráculo que marca los elementos buscados
    marked_items: lista de elementos a marcar (en binario)
    """
    oracle = QuantumCircuit(n_qubits)
    
    for item in marked_items:
        # Convertir el item a binario y aplicar Z a los qubits correspondientes
        binary = format(item, f'0{n_qubits}b')
        
        # Aplicar X a los qubits que deben ser 0
        for i, bit in enumerate(binary):
            if bit == '0':
                oracle.x(i)
        
        # Aplicar Z controlado múltiple
        if n_qubits == 1:
            oracle.z(0)
        elif n_qubits == 2:
            oracle.cz(0, 1)
        else:
            # Para más qubits, usar Z controlado múltiple
            oracle.mcp(np.pi, list(range(n_qubits-1)), n_qubits-1)
        
        # Deshacer las X
        for i, bit in enumerate(binary):
            if bit == '0':
                oracle.x(i)
    
    return oracle

def grover_diffuser(n_qubits):
    """Operador de difusión de Grover"""
    diffuser = QuantumCircuit(n_qubits)
    
    # Aplicar H a todos los qubits
    for i in range(n_qubits):
        diffuser.h(i)
    
    # Aplicar X a todos los qubits
    for i in range(n_qubits):
        diffuser.x(i)
    
    # Z controlado múltiple
    if n_qubits == 1:
        diffuser.z(0)
    elif n_qubits == 2:
        diffuser.cz(0, 1)
    else:
        diffuser.mcp(np.pi, list(range(n_qubits-1)), n_qubits-1)
    
    # Deshacer las X
    for i in range(n_qubits):
        diffuser.x(i)
    
    # Deshacer las H
    for i in range(n_qubits):
        diffuser.h(i)
    
    return diffuser

def grover_algorithm(marked_items, n_qubits):
    """Implementa el algoritmo de Grover"""
    # Número óptimo de iteraciones
    N = 2**n_qubits
    iterations = int(np.pi/4 * np.sqrt(N))
    
    qc = QuantumCircuit(n_qubits, n_qubits)
    
    # 1. Inicialización: superposición uniforme
    for i in range(n_qubits):
        qc.h(i)
    
    # 2. Iteraciones de Grover
    oracle = grover_oracle(marked_items, n_qubits)
    diffuser = grover_diffuser(n_qubits)
    
    for _ in range(iterations):
        # Aplicar oráculo
        qc = qc.compose(oracle)
        # Aplicar difusor
        qc = qc.compose(diffuser)
    
    # 3. Medición
    qc.measure(range(n_qubits), range(n_qubits))
    
    return qc, iterations

# Ejemplo 1: Buscar en 4 elementos (2 qubits)
print("\n--- Búsqueda en 4 elementos ---")
n_qubits = 2
marked_items = [3]  # Buscar el elemento "11" (3 en decimal)

qc_grover, iterations = grover_algorithm(marked_items, n_qubits)

job = simulator.run(transpile(qc_grover, simulator), shots=1000)
counts = job.result().get_counts(qc_grover)

print(f"Elemento buscado: {marked_items[0]} (binario: {format(marked_items[0], f'0{n_qubits}b')})")
print(f"Iteraciones de Grover: {iterations}")
print(f"Resultados: {counts}")

# Calcular probabilidad de éxito
total_shots = sum(counts.values())
success_count = counts.get(format(marked_items[0], f'0{n_qubits}b'), 0)
success_probability = success_count / total_shots
print(f"Probabilidad de éxito: {success_probability:.2%}")

print(qc_grover.draw())

# Ejemplo 2: Buscar múltiples elementos
print("\n--- Búsqueda de múltiples elementos ---")
marked_items_multi = [1, 3]  # Buscar "01" y "11"

qc_grover_multi, iterations_multi = grover_algorithm(marked_items_multi, n_qubits)

job = simulator.run(transpile(qc_grover_multi, simulator), shots=1000)
counts_multi = job.result().get_counts(qc_grover_multi)

print(f"Elementos buscados: {marked_items_multi}")
print(f"Iteraciones: {iterations_multi}")
print(f"Resultados: {counts_multi}")

# Comparación con búsqueda clásica
print("\n--- Ventaja Cuántica ---")
N = 2**n_qubits
classical_average = N/2
quantum_iterations = int(np.pi/4 * np.sqrt(N))
print(f"Base de datos de {N} elementos:")
print(f"Búsqueda clásica promedio: {classical_average} consultas")
print(f"Búsqueda cuántica: {quantum_iterations} iteraciones")
print(f"Aceleración: ~{classical_average/quantum_iterations:.1f}x")
