# Ejemplo 7: Teleportación Cuántica
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
import numpy as np

print("=== EJEMPLO 7: TELEPORTACIÓN CUÁNTICA ===")
print("Transferir el estado de un qubit usando entrelazamiento")

simulator = AerSimulator()

def create_bell_pair():
    """Crea un par de Bell entrelazado"""
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.cx(0, 1)
    return qc

def alice_gates(qc, psi, a):
    """Operaciones de Alice para teleportación"""
    qc.cx(psi, a)
    qc.h(psi)
    return qc

def measure_and_send(qc, a, b):
    """Alice mide y envía los resultados clásicos a Bob"""
    qc.barrier()
    qc.measure(a, 0)
    qc.measure(b, 1)
    return qc

def bob_gates(qc, qubit, crz, crx):
    """Bob aplica correcciones basadas en los bits clásicos de Alice"""
    qc.cx(crx, qubit)
    qc.cz(crz, qubit)
    return qc

def quantum_teleportation(initial_state="0"):
    """
    Implementa el protocolo completo de teleportación cuántica
    initial_state: "0", "1", "plus", "minus", o "custom"
    """
    # Circuito con 3 qubits y 3 bits clásicos
    # qubit 0: estado a teleportar (|ψ⟩)
    # qubit 1: qubit de Alice del par entrelazado
    # qubit 2: qubit de Bob del par entrelazado
    qc = QuantumCircuit(3, 3)
    
    # 1. Preparar el estado inicial a teleportar
    if initial_state == "1":
        qc.x(0)
    elif initial_state == "plus":
        qc.h(0)
    elif initial_state == "minus":
        qc.x(0)
        qc.h(0)
    elif initial_state == "custom":
        # Estado |ψ⟩ = cos(π/6)|0⟩ + sin(π/6)|1⟩
        qc.ry(np.pi/3, 0)
    
    qc.barrier()
    
    # 2. Crear par de Bell entre Alice (qubit 1) y Bob (qubit 2)
    qc.h(1)
    qc.cx(1, 2)
    qc.barrier()
    
    # 3. Alice realiza medición de Bell en sus qubits (0 y 1)
    qc.cx(0, 1)
    qc.h(0)
    qc.barrier()
    
    # 4. Alice mide sus qubits
    qc.measure(0, 0)
    qc.measure(1, 1)
    
    # 5. Bob aplica correcciones basadas en los resultados de Alice
    qc.cx(1, 2)  # Corrección X si el bit 1 es 1
    qc.cz(0, 2)  # Corrección Z si el bit 0 es 1
    
    # 6. Medir el qubit de Bob para verificar
    qc.measure(2, 2)
    
    return qc

# Ejemplo 1: Teleportar |0⟩
print("\n--- Teleportación de |0⟩ ---")
qc_0 = quantum_teleportation("0")
job = simulator.run(transpile(qc_0, simulator), shots=1000)
counts_0 = job.result().get_counts(qc_0)
print(f"Resultados: {counts_0}")
print("El qubit de Bob debería estar en |0⟩")
print(qc_0.draw())

# Ejemplo 2: Teleportar |1⟩
print("\n--- Teleportación de |1⟩ ---")
qc_1 = quantum_teleportation("1")
job = simulator.run(transpile(qc_1, simulator), shots=1000)
counts_1 = job.result().get_counts(qc_1)
print(f"Resultados: {counts_1}")
print("El qubit de Bob debería estar en |1⟩")

# Ejemplo 3: Teleportar |+⟩ = (|0⟩ + |1⟩)/√2
print("\n--- Teleportación de |+⟩ ---")
qc_plus = quantum_teleportation("plus")
job = simulator.run(transpile(qc_plus, simulator), shots=1000)
counts_plus = job.result().get_counts(qc_plus)
print(f"Resultados: {counts_plus}")
print("El qubit de Bob debería mostrar 50% |0⟩ y 50% |1⟩")

# Ejemplo 4: Teleportar estado personalizado
print("\n--- Teleportación de estado personalizado ---")
qc_custom = quantum_teleportation("custom")
job = simulator.run(transpile(qc_custom, simulator), shots=1000)
counts_custom = job.result().get_counts(qc_custom)
print(f"Resultados: {counts_custom}")
print("Estado: cos(π/6)|0⟩ + sin(π/6)|1⟩")

# Análisis de los resultados
print("\n--- Análisis de Teleportación ---")
print("Formato de resultados: abc donde:")
print("  a = medición de Alice (qubit 0)")
print("  b = medición de Alice (qubit 1)")  
print("  c = estado final de Bob (qubit 2)")
print("\nLa teleportación es exitosa cuando:")
print("- El estado de Bob (bit c) coincide con el estado original")
print("- Independientemente de los resultados de Alice (bits a,b)")

# Demostración del protocolo paso a paso
print("\n--- Protocolo de Teleportación ---")
print("1. Alice tiene un qubit en estado desconocido |ψ⟩")
print("2. Alice y Bob comparten un par de Bell entrelazado")
print("3. Alice realiza una medición de Bell en sus dos qubits")
print("4. Alice envía los 2 bits clásicos a Bob (por canal clásico)")
print("5. Bob aplica correcciones según los bits recibidos")
print("6. ¡El qubit de Bob ahora está en el estado |ψ⟩ original!")
print("\n¡Importante! El estado original de Alice se destruye (no-cloning theorem)")

# Verificación estadística
def verify_teleportation(counts, expected_prob_0):
    """Verifica si la teleportación fue exitosa estadísticamente"""
    total = sum(counts.values())
    
    # Contar cuántas veces Bob obtuvo 0 (último bit = 0)
    bob_0_count = sum(count for state, count in counts.items() if state[-1] == '0')
    bob_1_count = total - bob_0_count
    
    actual_prob_0 = bob_0_count / total
    actual_prob_1 = bob_1_count / total
    
    print(f"\nVerificación estadística:")
    print(f"Probabilidad esperada |0⟩: {expected_prob_0:.2%}")
    print(f"Probabilidad medida |0⟩: {actual_prob_0:.2%}")
    print(f"Probabilidad medida |1⟩: {actual_prob_1:.2%}")
    
    error = abs(actual_prob_0 - expected_prob_0)
    if error < 0.05:  # 5% de tolerancia
        print("✓ Teleportación exitosa!")
    else:
        print("✗ Error en la teleportación")

# Verificar algunos casos
print("\n=== VERIFICACIONES ===")
verify_teleportation(counts_0, 1.0)  # |0⟩ debería dar 100% |0⟩
verify_teleportation(counts_plus, 0.5)  # |+⟩ debería dar 50% |0⟩
