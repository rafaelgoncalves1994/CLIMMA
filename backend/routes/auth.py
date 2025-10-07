# routes/auth.py
from flask import Blueprint, request, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

auth_bp = Blueprint('auth', __name__)

# --- Configuração do Supabase ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400

    # Verifica se o usuário já existe
    existing_user = supabase.table("usuarios").select("username").eq("username", username).execute()
    if existing_user.data:
        return jsonify({'message': 'Usuário já existe!'}), 400

    # Insere novo usuário
    result = supabase.table("usuarios").insert({
        "username": username,
        "password": password
    }).execute()

    return jsonify({'message': 'Registro realizado com sucesso!', 'data': result.data}), 200


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400

    # Verifica credenciais no Supabase
    result = supabase.table("usuarios").select("*").eq("username", username).eq("password", password).execute()

    if not result.data:
        return jsonify({'message': 'Credenciais inválidas!'}), 401

    return jsonify({'message': 'Login bem-sucedido!', 'user': result.data[0]}), 200
