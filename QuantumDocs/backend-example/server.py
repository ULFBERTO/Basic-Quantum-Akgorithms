"""
Servidor Flask de ejemplo para integración con la aplicación Angular
Este servidor ejecuta los scripts Python de algoritmos cuánticos y devuelve los resultados
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import json
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.visualization import circuit_drawer
import matplotlib
matplotlib.use('Agg')  # Backend sin GUI
import matplotlib.pyplot as plt
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde Angular

# Configurar el simulador
simulator = AerSimulator()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({
        'status': 'ok',
        'message': 'Quantum Backend Server is running'
    })

@app.route('/api/simulate', methods=['POST'])
def simulate_circuit():
    """
    Simula un circuito cuántico desde código Qiskit
    
    Body:
    {
        "code": "qc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()",
        "shots": 1000
    }
    """
    try:
        data = request.json
        code = data.get('code', '')
        shots = data.get('shots', 1000)
        
        # Crear un namespace para ejecutar el código
        namespace = {
            'QuantumCircuit': QuantumCircuit,
            'transpile': transpile,
            'simulator': simulator
        }
        
        # Ejecutar el código Qiskit
        exec(code, namespace)
        
        # Obtener el circuito creado
        qc = namespace.get('qc')
        if qc is None:
            return jsonify({'error': 'No se encontró un circuito llamado "qc"'}), 400
        
        # Simular el circuito
        job = simulator.run(transpile(qc, simulator), shots=shots)
        result = job.result()
        counts = result.get_counts(qc)
        
        # Calcular probabilidades
        probabilities = {state: count / shots for state, count in counts.items()}
        
        # Obtener el statevector si es posible
        statevector = None
        try:
            sv_simulator = AerSimulator(method='statevector')
            sv_job = sv_simulator.run(transpile(qc, sv_simulator))
            sv_result = sv_job.result()
            sv = sv_result.get_statevector(qc)
            statevector = [{'real': float(amp.real), 'imaginary': float(amp.imag)} 
                          for amp in sv]
        except:
            pass
        
        return jsonify({
            'success': True,
            'counts': counts,
            'probabilities': probabilities,
            'statevector': statevector,
            'shots': shots
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/visualize', methods=['POST'])
def visualize_circuit():
    """
    Genera una imagen del circuito cuántico
    
    Body:
    {
        "code": "qc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)"
    }
    """
    try:
        data = request.json
        code = data.get('code', '')
        
        # Crear namespace y ejecutar código
        namespace = {'QuantumCircuit': QuantumCircuit}
        exec(code, namespace)
        
        qc = namespace.get('qc')
        if qc is None:
            return jsonify({'error': 'No se encontró un circuito'}), 400
        
        # Generar imagen del circuito
        fig = circuit_drawer(qc, output='mpl', style='iqp')
        
        # Convertir a base64
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=150)
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{image_base64}'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/execute/<algorithm_name>', methods=['POST'])
def execute_algorithm(algorithm_name):
    """
    Ejecuta un algoritmo cuántico predefinido
    
    Parámetros:
    - algorithm_name: nombre del algoritmo (grover, shor, deutsch_jozsa, etc.)
    
    Body: parámetros específicos del algoritmo
    """
    try:
        data = request.json or {}
        
        # Mapeo de algoritmos a archivos Python
        algorithm_files = {
            'qubit_basico': '../ejemplo_01_qubit_basico.py',
            'puertas_basicas': '../ejemplo_02_puertas_basicas.py',
            'entrelazamiento': '../ejemplo_03_entrelazamiento.py',
            'deutsch_jozsa': '../ejemplo_04_deutsch_jozsa.py',
            'grover': '../ejemplo_05_grover.py'
        }
        
        if algorithm_name not in algorithm_files:
            return jsonify({
                'error': f'Algoritmo "{algorithm_name}" no encontrado'
            }), 404
        
        # Leer y ejecutar el archivo Python
        file_path = os.path.join(os.path.dirname(__file__), algorithm_files[algorithm_name])
        
        with open(file_path, 'r', encoding='utf-8') as f:
            code = f.read()
        
        # Capturar la salida
        from io import StringIO
        old_stdout = sys.stdout
        sys.stdout = captured_output = StringIO()
        
        # Ejecutar el código
        namespace = {
            'QuantumCircuit': QuantumCircuit,
            'transpile': transpile,
            'AerSimulator': AerSimulator,
            'simulator': simulator
        }
        exec(code, namespace)
        
        # Restaurar stdout
        sys.stdout = old_stdout
        output = captured_output.getvalue()
        
        return jsonify({
            'success': True,
            'algorithm': algorithm_name,
            'output': output,
            'message': f'Algoritmo {algorithm_name} ejecutado exitosamente'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/validate', methods=['POST'])
def validate_code():
    """
    Valida código Qiskit sin ejecutarlo
    
    Body:
    {
        "code": "código Qiskit a validar"
    }
    """
    try:
        data = request.json
        code = data.get('code', '')
        
        # Intentar compilar el código
        compile(code, '<string>', 'exec')
        
        return jsonify({
            'valid': True,
            'message': 'Código válido'
        })
        
    except SyntaxError as e:
        return jsonify({
            'valid': False,
            'errors': [f'Error de sintaxis en línea {e.lineno}: {e.msg}']
        })
    except Exception as e:
        return jsonify({
            'valid': False,
            'errors': [str(e)]
        })

@app.route('/api/algorithms', methods=['GET'])
def list_algorithms():
    """Lista todos los algoritmos disponibles"""
    algorithms = [
        {
            'id': 'qubit_basico',
            'name': 'Qubit Básico',
            'description': 'Estados |0⟩ y |1⟩',
            'file': 'ejemplo_01_qubit_basico.py'
        },
        {
            'id': 'puertas_basicas',
            'name': 'Puertas Básicas',
            'description': 'Puertas X, Y, Z, H',
            'file': 'ejemplo_02_puertas_basicas.py'
        },
        {
            'id': 'entrelazamiento',
            'name': 'Entrelazamiento Cuántico',
            'description': 'Estados de Bell',
            'file': 'ejemplo_03_entrelazamiento.py'
        },
        {
            'id': 'deutsch_jozsa',
            'name': 'Deutsch-Jozsa',
            'description': 'Función constante vs balanceada',
            'file': 'ejemplo_04_deutsch_jozsa.py'
        },
        {
            'id': 'grover',
            'name': 'Grover',
            'description': 'Búsqueda cuántica',
            'file': 'ejemplo_05_grover.py'
        }
    ]
    
    return jsonify({
        'success': True,
        'algorithms': algorithms
    })

if __name__ == '__main__':
    print('🚀 Quantum Backend Server iniciado en http://localhost:5000')
    print('📡 Endpoints disponibles:')
    print('   GET  /api/health')
    print('   POST /api/simulate')
    print('   POST /api/visualize')
    print('   POST /api/execute/<algorithm_name>')
    print('   POST /api/validate')
    print('   GET  /api/algorithms')
    app.run(debug=True, port=5000)
