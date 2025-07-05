from flask import Blueprint, request, jsonify
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

weather_bp = Blueprint('weather', __name__)
API_KEY = os.getenv('OPENWEATHER_API_KEY')

# ---------- Previsão do tempo via OpenWeather ----------
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

    # Geocodificação para lat/lon
    geocode_url = f'https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}'
    geo_res = requests.get(geocode_url)
    if geo_res.status_code != 200:
        return jsonify({'error': 'Erro ao buscar coordenadas'}), 500

    geo_data = geo_res.json()
    if not geo_data:
        return jsonify({'error': 'Cidade não encontrada'}), 404

    lat = geo_data[0]['lat']
    lon = geo_data[0]['lon']

    # Consulta a alertas (OneCall da OpenWeather)
    onecall_url = (
        f'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}'
        f'&exclude=current,minutely,hourly,daily&appid={API_KEY}&lang=pt_br'
    )
    weather_res = requests.get(onecall_url)
    if weather_res.status_code != 200:
        return jsonify({'error': 'Erro ao buscar dados de alertas'}), 500

    data = weather_res.json()
    alertas = data.get('alerts', [])

    # Se não houver alertas, busca dados climáticos da Open-Meteo como fallback
    info = {}
    if not alertas:
        try:
            cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
            retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
            openmeteo = openmeteo_requests.Client(session=retry_session)

            url = "https://api.open-meteo.com/v1/forecast"
            params = {
                "latitude": lat,
                "longitude": lon,
                "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "wind_speed_10m"],
                "timezone": "America/Sao_Paulo"
            }

            responses = openmeteo.weather_api(url, params=params)
            current = responses[0].Current()

            info = {
                "temperatura": current.Variables(0).Value(),
                "umidade": current.Variables(1).Value(),
                "sensacao_termica": current.Variables(2).Value(),
                "vento": current.Variables(3).Value(),
                "timestamp": current.Time()
            }
        except Exception as e:
            info = {"erro_open_meteo": str(e)}

    return jsonify({
        'alertas': alertas,
        'info': info
    })



# --- [AQUI COMEÇA A ROTA OPEN-METEO] ---
# Esta rota consulta dados climáticos atuais usando a API Open-Meteo, baseada em latitude/longitude.
# Se precisar alterar, buscar por: "get_open_meteo_weather"

import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry

@weather_bp.route('/weather/open-meteo')
def get_open_meteo_weather():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    if lat is None or lon is None:
        return jsonify({'error': 'Latitude e longitude são obrigatórias'}), 400

    try:
        cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
        retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
        openmeteo = openmeteo_requests.Client(session=retry_session)

        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "wind_speed_10m"],
            "timezone": "America/Sao_Paulo"
        }

        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]
        current = response.Current()

        return jsonify({
            "latitude": response.Latitude(),
            "longitude": response.Longitude(),
            "temperatura": current.Variables(0).Value(),
            "umidade": current.Variables(1).Value(),
            "sensacao_termica": current.Variables(2).Value(),
            "vento": current.Variables(3).Value(),
            "timestamp": current.Time()
        })

    except Exception as e:
        return jsonify({'error': f'Erro ao consultar Open-Meteo: {str(e)}'}), 500
