import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

from qiskit_aer import AerSimulator
from qiskit.quantum_info import SparsePauliOp
from qiskit_algorithms import QAOA
from qiskit_algorithms.optimizers import COBYLA
from qiskit_aer.primitives import Sampler

# --- 1. Definición del Problema (El Grafo) ---

# Creamos un grafo con 4 nodos. Las aristas representan las conexiones.
num_nodes = 4
G = nx.Graph()
G.add_nodes_from(range(num_nodes))
G.add_edges_from([(0, 1), (1, 2), (2, 3), (3, 0), (0, 2)])

# Dibujamos el grafo inicial para visualizarlo
print("--- Grafo del Problema ---")
print("Nodos:", G.nodes())
print("Aristas:", G.edges())

# --- 2. Mapeo del Problema a un Hamiltoniano Cuántico ---

# El problema de Max-Cut puede ser representado como un Hamiltoniano de Ising.
# Qiskit puede hacer esta conversión automáticamente.
# Creamos un "qubit operator" a partir del grafo.

# El objetivo es encontrar el estado |psi> que maximiza <psi|H|psi>
pauli_list = []
coeffs = []

for i, j in G.edges():
    pauli_str = ['I'] * num_nodes
    pauli_str[i] = 'Z'
    pauli_str[j] = 'Z'
    pauli_list.append("".join(pauli_str))
    coeffs.append(0.5)  # Coeficiente para cada término

qubit_op = SparsePauliOp(pauli_list, coeffs)

# --- 3. Configuración del Algoritmo QAOA ---

# Usaremos un simulador cuántico de Qiskit Aer
sampler = Sampler()

# Creamos una instancia de QAOA
# Le pasamos el operador del problema y un optimizador clásico
qaoa = QAOA(sampler=sampler, optimizer=COBYLA(), reps=1)

# --- 4. Ejecución y Obtención de Resultados ---

print("\n--- Ejecutando QAOA en el simulador ---")
result = qaoa.compute_minimum_eigenvalue(qubit_op)

# El resultado nos da la división de los nodos
# Extraemos la solución más probable
if hasattr(result, 'best_measurement'):
    solution = result.best_measurement['bitstring']
else:
    # Fallback para versiones diferentes
    solution = format(result.eigenstate.argmax(), f'0{num_nodes}b')

print(f"\nSolución encontrada (string de bits): {solution}")
print("Esto representa la asignación de cada nodo a uno de los dos equipos (0 o 1).")

# --- 5. Visualización de la Solución ---

# Asignamos colores a los nodos según la solución encontrada
colors = ['r' if solution[i] == '0' else 'g' for i in range(num_nodes)]

# Dibujamos el grafo con los nodos coloreados
pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos, with_labels=True, node_color=colors, font_color='w')

# Calculamos y mostramos el número de aristas cortadas
cut_edges = [(u, v) for u, v in G.edges() if solution[u] != solution[v]]
uncut_edges = [(u, v) for u, v in G.edges() if solution[u] == solution[v]]

nx.draw_networkx_edges(G, pos, edgelist=cut_edges, edge_color='y', width=2.0)
nx.draw_networkx_edges(G, pos, edgelist=uncut_edges, edge_color='w', style='dashed')

plt.title(f"Solución de Max-Cut con QAOA (Corte = {len(cut_edges)})")
plt.show()

print(f"\nEl objetivo es maximizar las aristas amarillas (las que conectan equipos diferentes)." )
print(f"La solución óptima encontró un corte de {len(cut_edges)} aristas.")
