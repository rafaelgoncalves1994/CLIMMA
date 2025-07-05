import { useEffect, useState } from 'react'

function Alertas() {
  const [city, setCity] = useState('')
  const [alertas, setAlertas] = useState([])
  const [clima, setClima] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchAlerts = async (cidade) => {
    const cidadeFinal = cidade || city
    if (!cidadeFinal) return

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/alerts?city=${cidadeFinal}`)
      const data = await res.json()

      setAlertas(data.alertas || [])
      fetchWeatherByCity(cidadeFinal)
    } catch (err) {
      alert('Erro ao buscar alertas')
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCity = async (cidade) => {
    try {
      const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cidade}&limit=1&appid=18e3ecb76303610fd0cf4e74e415ac2f`)
      const geoData = await geoRes.json()
      if (!geoData || geoData.length === 0) return
      const { lat, lon } = geoData[0]

      const climaRes = await fetch(`http://localhost:5000/weather/open-meteo?lat=${lat}&lon=${lon}`)
      const climaData = await climaRes.json()

      if (!climaData.error) {
        setClima(climaData)
      }
    } catch (err) {
      console.warn('Erro ao buscar clima atual:', err)
    }
  }

  const fetchCityByLocation = async () => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords

      try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=18e3ecb76303610fd0cf4e74e415ac2f`)
        const data = await res.json()
        if (data.length > 0) {
          const cidadeGeo = data[0].name
          setCity(cidadeGeo)
          fetchAlerts(cidadeGeo)
        }
      } catch (err) {
        alert('Erro ao determinar cidade pela localização')
      }
    }, () => {
      alert('Erro ao obter sua localização')
    })
  }

  useEffect(() => {
    if (city === '') {
      fetchCityByLocation()
    } else {
      fetchAlerts()
    }
  }, [])

  return (
    <div className="mobile-wrapper">
      <div className="clima-screen">
        <header className="clima-header">
          <h2>🔔 Alertas Climáticos</h2>
        </header>

        <main className="clima-main">
          {alertas.length === 0 && !loading && (
            <div className="alerta-sem-alerta">
              <h3>🎉 Tudo tranquilo!</h3>
              <p>Não há alertas climáticos para <strong>{city}</strong> no momento.</p>
              <p>🌤️ A vida segue leve e sem surpresas prejudiciais!</p>
            </div>
          )}

          <input
            className="search"
            type="text"
            placeholder="Buscar cidade..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAlerts()}
          />
          <button className="search-button" onClick={() => fetchAlerts()}>🔍 Buscar</button>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            alertas.map((alerta, idx) => (
              <div key={idx} style={{ textAlign: 'left', marginTop: '1rem', background: '#fff3e0', padding: '1rem', borderRadius: '8px' }}>
                {Object.entries(alerta).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
                  </div>
                ))}
                <hr />
              </div>
            ))
          )}

          {clima && (
            <div style={{ textAlign: 'left', marginTop: '2rem', background: '#f1f8e9', padding: '1rem', borderRadius: '8px' }}>
              <h4>☀️ Clima Atual</h4>
              <p><strong>Temperatura:</strong> {clima.temperatura} °C</p>
              <p><strong>Sensação Térmica:</strong> {clima.sensacao_termica} °C</p>
              <p><strong>Umidade:</strong> {clima.umidade} %</p>
              <p><strong>Vento:</strong> {clima.vento} m/s</p>
              <p><strong>Atualizado:</strong> {new Date(clima.timestamp * 1000).toLocaleString()}</p>
            </div>
          )}
        </main>

        <footer className="clima-footer">
          <button onClick={() => (window.location.href = '/clima')}>
            <img src="/icons/Clima.png" alt="Clima" className="icon-img" />
          </button>
          <button onClick={() => (window.location.href = '/calendario')}>
            <img src="/icons/Calendario.png" alt="Calendário" className="icon-img" />
          </button>
          <button onClick={() => (window.location.href = '/alertas')}>
            <img src="/icons/notificacao.png" alt="Alertas" className="icon-img" />
          </button>
        </footer>
      </div>
    </div>
  )
}

export default Alertas
