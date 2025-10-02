# Ejemplo 9: Variational Quantum Eigensolver (VQE)
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.quantum_info import SparsePauliOp
from qiskit_algorithms import VQE
from qiskit_algorithms.optimizers import COBYLA, SPSA
from qiskit.circuit.library import TwoLocal
from qiskit_aer.primitives import Estimator
import numpy as np

print("=== EJEMPLO 9: VARIATIONAL QUANTUM EIGENSOLVER (VQE) ===")
print("Encuentra el estado fundamental de un Hamiltoniano")

# Configurar simulador
simulator = AerSimulator()
estimator = Estimator()

# Ejemplo 1: Molécula de H₂ (Hidrógeno)
print("\n--- Molécula de H₂ ---")

# Hamiltoniano de H₂ en la base de qubits (simplificado)
# H = -1.0523732 * I - 0.39793742 * Z₀ - 0.39793742 * Z₁ - 0.01128010 * Z₀Z₁ + 0.18093119 * X₀X₁
h2_pauli_strings = ['II', 'ZI', 'IZ', 'ZZ', 'XX']
h2_coefficients = [-1.0523732, -0.39793742, -0.39793742, -0.01128010, 0.18093119]

h2_hamiltonian = SparsePauliOp(h2_pauli_strings, h2_coefficients)

print("Hamiltoniano de H₂:")
print(h2_hamiltonian)

# Crear ansatz variacional
def create_h2_ansatz():
    """Crea un ansatz simple para H₂"""
    qc = QuantumCircuit(2)
    
    # Parámetros variacionales
    from qiskit.circuit import Parameter
    theta = Parameter('θ')
    
    # Ansatz: preparación del estado + rotaciones
    qc.ry(theta, 0)
    qc.ry(theta, 1)
    qc.cx(0, 1)
    
    return qc

# Ansatz más sofisticado usando TwoLocal
ansatz = TwoLocal(num_qubits=2, rotation_blocks='ry', entanglement_blocks='cx', 
                  entanglement='linear', reps=1)

print(f"\nAnsatz variacional:")
print(ansatz.draw())

# Configurar VQE
optimizer = COBYLA(maxiter=100)
vqe = VQE(estimator=estimator, ansatz=ansatz, optimizer=optimizer)

print("\n--- Ejecutando VQE ---")
print("Buscando el estado fundamental...")

# Ejecutar VQE
result = vqe.compute_minimum_eigenvalue(h2_hamiltonian)

print(f"\nResultados VQE:")
print(f"Energía del estado fundamental: {result.eigenvalue:.6f} Hartree")
print(f"Parámetros óptimos: {result.optimal_parameters}")
print(f"Número de evaluaciones: {result.cost_function_evals}")

# Valor exacto para comparación
exact_energy = -1.8572750302023786
print(f"Energía exacta (referencia): {exact_energy:.6f} Hartree")
print(f"Error: {abs(result.eigenvalue - exact_energy):.6f} Hartree")

# Ejemplo 2: Hamiltoniano de Ising
print("\n--- Modelo de Ising ---")

# Hamiltoniano de Ising: H = -J Σᵢ ZᵢZᵢ₊₁ - h Σᵢ Xᵢ
n_qubits = 3
J = 1.0  # Acoplamiento
h = 0.5  # Campo magnético

# Construir Hamiltoniano de Ising
ising_pauli_strings = []
ising_coefficients = []

# Términos de acoplamiento ZZ
for i in range(n_qubits - 1):
    pauli_str = ['I'] * n_qubits
    pauli_str[i] = 'Z'
    pauli_str[i + 1] = 'Z'
    ising_pauli_strings.append(''.join(pauli_str))
    ising_coefficients.append(-J)

# Términos de campo magnético X
for i in range(n_qubits):
    pauli_str = ['I'] * n_qubits
    pauli_str[i] = 'X'
    ising_pauli_strings.append(''.join(pauli_str))
    ising_coefficients.append(-h)

ising_hamiltonian = SparsePauliOp(ising_pauli_strings, ising_coefficients)

print(f"Hamiltoniano de Ising ({n_qubits} qubits):")
print(f"J = {J}, h = {h}")
print(ising_hamiltonian)

# Ansatz para Ising
ising_ansatz = TwoLocal(num_qubits=n_qubits, rotation_blocks='ry', 
                        entanglement_blocks='cx', entanglement='circular', reps=2)

# VQE para Ising
vqe_ising = VQE(estimator=estimator, ansatz=ising_ansatz, optimizer=COBYLA(maxiter=200))

print("\n--- Ejecutando VQE para Ising ---")
result_ising = vqe_ising.compute_minimum_eigenvalue(ising_hamiltonian)

print(f"Energía del estado fundamental: {result_ising.eigenvalue:.6f}")
print(f"Parámetros óptimos: {len(result_ising.optimal_parameters)} parámetros")

# Ejemplo 3: Optimización de parámetros paso a paso
print("\n--- Análisis de Convergencia ---")

# Función para evaluar energía con parámetros específicos
def evaluate_energy(parameters, hamiltonian, ansatz):
    """Evalúa la energía para parámetros dados"""
    bound_circuit = ansatz.assign_parameters(parameters)
    job = estimator.run([bound_circuit], [hamiltonian])
    result = job.result()
    return result.values[0]

# Crear ansatz simple para análisis
simple_ansatz = QuantumCircuit(2)
from qiskit.circuit import ParameterVector
params = ParameterVector('θ', 2)
simple_ansatz.ry(params[0], 0)
simple_ansatz.ry(params[1], 1)
simple_ansatz.cx(0, 1)

print("Ansatz simple para análisis:")
print(simple_ansatz.draw())

# Evaluar energía para diferentes valores de parámetros
print("\nEvaluación de energía vs parámetros:")
test_params = [
    [0.0, 0.0],
    [np.pi/4, np.pi/4],
    [np.pi/2, np.pi/2],
    [np.pi, np.pi]
]

for i, param_values in enumerate(test_params):
    energy = evaluate_energy(param_values, h2_hamiltonian, simple_ansatz)
    print(f"θ = {param_values}: E = {energy:.6f}")

# Ejemplo 4: Comparación de optimizadores
print("\n--- Comparación de Optimizadores ---")

optimizers = [
    ("COBYLA", COBYLA(maxiter=50)),
    ("SPSA", SPSA(maxiter=50))
]

for name, opt in optimizers:
    print(f"\n{name}:")
    vqe_opt = VQE(estimator=estimator, ansatz=ansatz, optimizer=opt)
    result_opt = vqe_opt.compute_minimum_eigenvalue(h2_hamiltonian)
    print(f"  Energía: {result_opt.eigenvalue:.6f}")
    print(f"  Evaluaciones: {result_opt.cost_function_evals}")

print("\n--- Aplicaciones del VQE ---")
print("1. Química cuántica (estados fundamentales moleculares)")
print("2. Ciencia de materiales (propiedades electrónicas)")
print("3. Optimización combinatoria")
print("4. Simulación de sistemas cuánticos")
print("5. Machine learning cuántico")

print("\n--- Ventajas del VQE ---")
print("• Algoritmo híbrido cuántico-clásico")
print("• Tolerante a ruido (NISQ-friendly)")
print("• Escalable a sistemas más grandes")
print("• Puede encontrar estados excitados")
print("• Aplicable a hardware cuántico actual")

print("\n--- Limitaciones ---")
print("• Puede quedar atrapado en mínimos locales")
print("• Requiere muchas evaluaciones del circuito")
print("• La elección del ansatz es crucial")
print("• Sensible al ruido en hardware real")
