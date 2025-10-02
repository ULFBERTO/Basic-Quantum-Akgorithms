
import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

def encode_message(bits, bases):
    """Codifica los bits en qubits usando las bases dadas."""
    message = []
    for i in range(len(bits)):
        qc = QuantumCircuit(1, 1)
        if bases[i] == 0: # Base Z (|0> o |1>)
            if bits[i] == 1:
                qc.x(0)
        else: # Base X (|+> o |->)
            if bits[i] == 0:
                qc.h(0)
            else:
                qc.x(0)
                qc.h(0)
        qc.barrier()
        message.append(qc)
    return message

# --- 1. Preparación de Alice ---

# Definimos la longitud de la clave que queremos generar
np.random.seed(seed=0) # Para que los resultados sean reproducibles
KEY_LENGTH = 16 

# Alice genera sus bits y bases aleatorias
alice_bits = np.random.randint(2, size=KEY_LENGTH)
alice_bases = np.random.randint(2, size=KEY_LENGTH) # 0 para base Z, 1 para base X

# Alice codifica sus bits en una secuencia de qubits
message_qubits = encode_message(alice_bits, alice_bases)

print("--- Lado de Alice ---")
print(f"Clave secreta de Alice (original): {''.join(map(str, alice_bits))}")
print(f"Bases de Alice:                     {''.join(map(str, alice_bases))}")
print(f"Qubits preparados para enviar a Bob ({len(message_qubits)}).")

def measure_message(message, bases):
    """Mide los qubits usando las bases de Bob."""
    backend = AerSimulator()
    measurements = []
    for i in range(len(bases)):
        qc = message[i]
        if bases[i] == 1: # Si la base es X, aplicar H antes de medir
            qc.h(0)
        qc.measure(0, 0)
        
        # Compilar y ejecutar
        t_qc = transpile(qc, backend)
        result = backend.run(t_qc, shots=1, memory=True).result()
        measured_bit = int(result.get_memory()[0])
        measurements.append(measured_bit)
    return measurements

# --- 2. Medición de Bob ---

# Bob genera sus bases aleatorias para medir
bob_bases = np.random.randint(2, size=KEY_LENGTH)

# Bob mide los qubits que le envía Alice
bob_results = measure_message(message_qubits, bob_bases)

print("\n--- Lado de Bob ---")
print(f"Bases de Bob:                       {''.join(map(str, bob_bases))}")
print(f"Resultados de Bob (medidos):        {''.join(map(str, bob_results))}")

# --- 3. Conciliación (Sifting) ---

def sift_key(a_bases, b_bases, bits):
    """Filtra la clave, quedándose solo con los bits donde las bases coincidieron."""
    good_bits = []
    for i in range(len(bits)):
        if a_bases[i] == b_bases[i]:
            good_bits.append(bits[i])
    return good_bits

# Alice y Bob comparan sus bases y descartan los bits donde no coinciden
alice_key = sift_key(alice_bases, bob_bases, alice_bits)
bob_key = sift_key(alice_bases, bob_bases, bob_results)

print("\n--- 3. Conciliación de Claves ---")
print(f"Coincidencia de bases:              {' '.join(['|' if a == b else 'X' for a, b in zip(alice_bases, bob_bases)])}")
print(f"Clave final de Alice:               {''.join(map(str, alice_key))}")
print(f"Clave final de Bob:                 {''.join(map(str, bob_key))}")

# --- 4. Verificación y Cifrado ---

if alice_key == bob_key:
    print("\n¡Éxito! La clave ha sido compartida de forma segura.")
    shared_key = "".join(map(str, alice_key))
    print(f"Clave secreta compartida: {shared_key}")
    
    # Ahora, usemos la clave para encriptar un mensaje
    message_to_encrypt = "HolaMundo"
    print(f"\nMensaje original: {message_to_encrypt}")
    
    def xor_cipher(message, key):
        """Aplica un cifrado XOR usando la clave. Se repite la clave si es necesario."""
        # Asegurarse de que la clave no estÃ© vacÃ­a
        if not key:
            raise ValueError("La clave no puede estar vacÃ­a.")
            
        key_int = int(key, 2)
        key_bytes = key_int.to_bytes((key_int.bit_length() + 7) // 8, 'big')
        
        # Si el mensaje es string, codificarlo a bytes
        if isinstance(message, str):
            message = message.encode('utf-8')
            
        output_bytes = bytearray()
        for i in range(len(message)):
            output_bytes.append(message[i] ^ key_bytes[i % len(key_bytes)])
        return output_bytes

    # Encriptar
    try:
        encrypted = xor_cipher(message_to_encrypt, shared_key)
        print(f"Mensaje encriptado (hex): {encrypted.hex()}")

        # Desencriptar
        decrypted = xor_cipher(encrypted, shared_key)
        print(f"Mensaje desencriptado: {decrypted.decode('utf-8')}")
    except ValueError as e:
        print(f"\nError durante el cifrado: {e}")
        print("No se pudo generar una clave suficientemente larga en esta ejecuciÃ³n.")

else:
    print("\nError: Las claves no coinciden. ¡Posible espía!")

