from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

# Dicionário simples para armazenar credenciais em tempo de execução
users = {}

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400

    if username in users:
        return jsonify({'message': 'Usuário já existe!'}), 400

    users[username] = password
    return jsonify({'message': 'Registro realizado com sucesso!'}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400

    if users.get(username) == password:
        return jsonify({'message': 'Login bem-sucedido!'}), 200

    return jsonify({'message': 'Credenciais inválidas!'}), 401
