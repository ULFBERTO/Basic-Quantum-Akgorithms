# Ejemplo 6: Algoritmo de Simon
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
import numpy as np

print("=== EJEMPLO 6: ALGORITMO DE SIMON ===")
print("Encuentra el período oculto de una función")

simulator = AerSimulator()

def simon_oracle(secret_string):
    """
    Crea un oráculo para el algoritmo de Simon
    secret_string: string secreto s (en binario)
    La función satisface f(x) = f(x ⊕ s) para s ≠ 0
    """
    n = len(secret_string)
    oracle = QuantumCircuit(2 * n)
    
    # Convertir string secreto a lista de bits
    s = [int(bit) for bit in secret_string]
    
    # Implementar f(x) = f(x ⊕ s)
    # Para simplicidad, usamos f(x) = x si x < s, sino f(x) = x ⊕ s
    
    # Copiar x a la salida
    for i in range(n):
        oracle.cx(i, n + i)
    
    # Si s ≠ 0, aplicar la propiedad f(x) = f(x ⊕ s)
    if any(s):
        # Para cada bit del string secreto
        for i in range(n):
            if s[i] == 1:
                # Aplicar XOR condicional
                oracle.cx(i, n + i)
    
    return oracle

def simon_algorithm(secret_string):
    """Implementa el algoritmo de Simon"""
    n = len(secret_string)
    
    # Necesitamos n-1 mediciones independientes
    results = []
    
    for measurement in range(n):
        qc = QuantumCircuit(2 * n, n)
        
        # 1. Preparar superposición en los primeros n qubits
        for i in range(n):
            qc.h(i)
        
        # 2. Aplicar el oráculo
        oracle = simon_oracle(secret_string)
        qc = qc.compose(oracle)
        
        # 3. Aplicar Hadamard a los primeros n qubits
        for i in range(n):
            qc.h(i)
        
        # 4. Medir solo los primeros n qubits
        qc.measure(range(n), range(n))
        
        # Ejecutar el circuito
        job = simulator.run(transpile(qc, simulator), shots=1)
        result = job.result().get_counts(qc)
        
        # Obtener el resultado (solo uno debido a shots=1)
        measured_string = list(result.keys())[0]
        results.append(measured_string)
        
        if measurement == 0:
            print(f"\nCircuito de Simon:")
            print(qc.draw())
    
    return results

def solve_linear_system(measurements, n):
    """
    Resuelve el sistema de ecuaciones lineales para encontrar s
    measurements · s = 0 (mod 2)
    """
    # Convertir mediciones a matriz binaria
    matrix = []
    for measurement in measurements:
        row = [int(bit) for bit in measurement]
        matrix.append(row)
    
    # Resolver usando eliminación gaussiana en GF(2)
    # Para simplicidad, asumimos que tenemos suficientes ecuaciones linealmente independientes
    
    # En este ejemplo simplificado, intentamos encontrar s por fuerza bruta
    for s_candidate in range(1, 2**n):
        s_bits = [int(bit) for bit in format(s_candidate, f'0{n}b')]
        
        # Verificar si s_candidate satisface todas las ecuaciones
        valid = True
        for measurement in measurements:
            m_bits = [int(bit) for bit in measurement]
            dot_product = sum(m_bits[i] * s_bits[i] for i in range(n)) % 2
            if dot_product != 0:
                valid = False
                break
        
        if valid:
            return format(s_candidate, f'0{n}b')
    
    return "0" * n  # Si no se encuentra, s = 0

# Ejemplo con n = 3 qubits
print("\n--- Ejemplo con 3 qubits ---")
secret_string = "101"  # String secreto s
print(f"String secreto real: {secret_string}")

# Ejecutar el algoritmo de Simon
measurements = simon_algorithm(secret_string)

print(f"\nMediciones obtenidas:")
for i, measurement in enumerate(measurements):
    print(f"  Medición {i+1}: {measurement}")

# Resolver el sistema de ecuaciones
found_secret = solve_linear_system(measurements, len(secret_string))
print(f"\nString secreto encontrado: {found_secret}")

# Verificación
if found_secret == secret_string:
    print("¡Éxito! El algoritmo encontró el string secreto correcto.")
else:
    print("El algoritmo necesita más mediciones o ecuaciones linealmente independientes.")

# Ejemplo más simple con n = 2
print("\n--- Ejemplo simple con 2 qubits ---")
secret_string_2 = "11"
print(f"String secreto: {secret_string_2}")

measurements_2 = simon_algorithm(secret_string_2)
print(f"Mediciones: {measurements_2}")

found_secret_2 = solve_linear_system(measurements_2, 2)
print(f"String encontrado: {found_secret_2}")

print("\n--- Ventaja Cuántica ---")
print("Clásicamente: necesitas ~2^(n/2) consultas para encontrar el período")
print("Cuánticamente: solo necesitas n mediciones")
print("Para n=10: Clásico ~32 vs Cuántico 10 consultas")
