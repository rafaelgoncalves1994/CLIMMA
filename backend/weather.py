from flask import Blueprint, request, jsonify
import requests

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', default='Recife', type=str)
    api_key = '18e3ecb76303610fd0cf4e74e415ac2f'  #chave da OpenWeatherMap
    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=pt_br'

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        weather_info = {
            'cidade': data['name'],
            'temperatura': round(data['main']['temp']),
            'descricao': data['weather'][0]['description'],
            'icone': data['weather'][0]['icon'],
        }
        return jsonify(weather_info)
    else:
        return jsonify({'error': 'Cidade não encontrada'}), 404
