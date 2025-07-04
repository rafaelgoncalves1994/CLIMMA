from flask import Blueprint, request, jsonify
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()  # Carrega variáveis do .env

weather_bp = Blueprint('weather', __name__)


API_KEY = os.getenv('OPENWEATHER_API_KEY')

@weather_bp.route('/weather')
def get_weather():
    city = request.args.get('city', default='Recife', type=str)
    if not API_KEY:
        return jsonify({'error': 'Chave da API não configurada'}), 500

    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric&lang=pt_br'
    res = requests.get(url)
    if res.status_code != 200:
        return jsonify({'error': 'Cidade não encontrada'}), 404

    data = res.json()
    return jsonify({
        'cidade': data['name'],
        'temperatura': round(data['main']['temp']),
        'descricao': data['weather'][0]['description'].capitalize(),
        'icone': data['weather'][0]['icon']
    })

@weather_bp.route('/weather/coords')
def get_weather_by_coords():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({'error': 'Latitude e longitude obrigatórias'}), 400
    if not API_KEY:
        return jsonify({'error': 'Chave da API não configurada'}), 500

    url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=pt_br'
    res = requests.get(url)
    if res.status_code != 200:
        return jsonify({'error': 'Erro ao obter clima'}), 500

    data = res.json()
    return jsonify({
        'cidade': data['name'],
        'temperatura': round(data['main']['temp']),
        'descricao': data['weather'][0]['description'].capitalize(),
        'icone': data['weather'][0]['icon']
    })

@weather_bp.route('/alerts')
def get_alerts():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'Cidade não especificada'}), 400
    if not API_KEY:
        return jsonify({'error': 'Chave da API não configurada'}), 500

    # Geocodificação da cidade
    geocode_url = f'https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}'
    geo_res = requests.get(geocode_url)
    if geo_res.status_code != 200:
        return jsonify({'error': 'Erro ao buscar coordenadas'}), 500

    geo_data = geo_res.json()
    if not geo_data:
        return jsonify({'error': 'Cidade não encontrada'}), 404

    lat = geo_data[0]['lat']
    lon = geo_data[0]['lon']

    # Chamada da OneCall para alertas
    onecall_url = (
    f'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}'
    f'&exclude=current,minutely,hourly,daily&appid={API_KEY}&lang=pt_br'
)

    weather_res = requests.get(onecall_url)
    if weather_res.status_code != 200:
        return jsonify({'error': 'Erro ao buscar dados de alertas'}), 500

    data = weather_res.json()

    # Retorna os alertas como vieram da API
    return jsonify({'alertas': data.get('alerts', [])})

def formatar_unix(timestamp):
    return datetime.fromtimestamp(timestamp).strftime('%d/%m/%Y %H:%M') if timestamp else ''
