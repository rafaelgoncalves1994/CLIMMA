import { useEffect, useState } from 'react'

function Alertas() {
  const [city, setCity] = useState('Recife')
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAlerts = async (cidade) => {
    const cidadeFinal = cidade || city
    if (!cidadeFinal) return

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/alerts?city=${cidadeFinal}`)
      const data = await res.json()
      if (data.alertas) {
        setAlertas(data.alertas)
      } else {
        alert('Nenhum alerta encontrado para esta cidade.')
        setAlertas([])
      }
    } catch (err) {
      alert('Erro ao buscar alertas')
    } finally {
      setLoading(false)
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
    if (city === 'Recife') {
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
          ) : alertas.length === 0 ? (
            <p>Sem alertas no momento</p>
          ) : (
            alertas.map((alerta, idx) => (
  <div key={idx} style={{ textAlign: 'left', marginTop: '1rem' }}>
    {Object.entries(alerta).map(([key, value]) => (
      <div key={key}>
        <strong>{key}:</strong> {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
      </div>
    ))}
    <hr />
  </div>
))

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
