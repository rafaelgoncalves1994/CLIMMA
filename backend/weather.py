from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Carrega variáveis do .env

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', default='Recife', type=str)
    api_key = os.getenv('OPENWEATHER_API_KEY')

    if not api_key:
        return jsonify({'error': 'Chave da API não configurada'}), 500

    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=pt_br'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return jsonify({
            'cidade': data['name'],
            'temperatura': round(data['main']['temp']),
            'descricao': data['weather'][0]['description'],
            'icone': data['weather'][0]['icon'],
        })
    else:
        return jsonify({'error': 'Cidade não encontrada'}), 404
