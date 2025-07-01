from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

users = {}

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    if username in users:
        return jsonify({'message': 'Usuário já existe!'}), 400
    users[username] = password
    return jsonify({'message': 'Registro realizado com sucesso!'}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    if users.get(username) == password:
        return jsonify({'message': 'Login bem-sucedido!'}), 200
    return jsonify({'message': 'Credenciais inválidas!'}), 401