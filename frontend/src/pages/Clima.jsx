import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Clima() {
  const navigate = useNavigate()
  const [weather, setWeather] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchWeather = async (city) => {
    if (!city) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/weather?city=${city}`)
      const data = await res.json()
      if (res.ok) {
        setWeather(data)
        localStorage.setItem('lastCity', city)
      } else {
        alert(data.error || 'Erro ao buscar clima')
      }
    } catch (error) {
      alert('Erro na conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchWeather(search.trim())
    }
  }

  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity') || 'Recife'
    setSearch(lastCity)
    fetchWeather(lastCity)
  }, [])

 const handleGeolocate = () => {
  if (!navigator.geolocation) {
    alert('Geolocalização não suportada pelo navegador')
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords

      console.log('Latitude:', latitude)
      console.log('Longitude:', longitude)
      console.log('Precisão (metros):', accuracy)

      // ⚠️ Se a precisão for ruim, avise o usuário
      if (accuracy > 1000) {
        alert('Localização imprecisa. Tente novamente em local aberto.')
      }

      try {
        const res = await fetch(
          `http://localhost:5000/weather/coords?lat=${latitude}&lon=${longitude}`
        )
        const data = await res.json()
        if (res.ok) {
          setWeather(data)
          setSearch(data.cidade)
        } else {
          alert(data.error || 'Erro ao buscar clima por localização')
        }
      } catch (error) {
        alert('Erro na conexão com servidor')
      }
    },
    (error) => {
      console.error(error)
      alert('Erro ao obter localização')
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}



  return (
    <div className="mobile-wrapper">
      <div className="clima-screen">
        <header className="clima-header">
          <img src="/climma-logo.png" alt="Logo Climma" className="logo" />
          <div className="avatar">👤</div>
        </header>

        <main className="clima-main">
          <div className="search-container">
            <input
              className="search neumorphic"
              type="text"
              placeholder="Buscar cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
         <button className="search-icon-button" onClick={() => fetchWeather(search.trim())} aria-label="Buscar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18"
                viewBox="0 0 24 24"
                width="18"
                fill="currentColor"
              >
    <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.17 
    5.59 12.53 3 9.25 3S3.33 5.59 3.33 8.39 5.97 13.78 9.25 13.78c1.61 
    0 3.07-.59 4.18-1.56l.27.28v.79l4.99 4.99 1.49-1.49L15.5 14zm-6.25 
    0C7.01 14 5.33 12.32 5.33 10.28S7.01 6.56 9.25 6.56 13.17 8.24 13.17
     10.28 11.49 14 9.25 14z" />
  </svg>
</button>

          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : weather ? (
            <>
              <h2 className="cidade">{weather.cidade}</h2>
              <p className="dia">{weather.descricao}</p>

              <div className="clima-icon">
                <img
                  src={`http://openweathermap.org/img/wn/${weather.icone}@2x.png`}
                  alt="Ícone clima"
                  style={{ width: '80px' }}
                />
              </div>
              <div className="clima-temp">{weather.temperatura}°</div>
              <p className="clima-chance">Tempo real via OpenWeatherMap</p>
            </>
          ) : (
            <p>Digite uma cidade e pressione Enter ou clique na lupa</p>
          )}

          <div className="clima-actions">
            <button onClick={() => navigate('/calendario')}>📅 Calendário</button>
            <button onClick={() => navigate('/')}>🔙 Sair</button>
          </div>
        </main>

        <footer className="clima-footer">
  <button className="icon-button" onClick={handleGeolocate}>
  <img src="/icons/mapa.png" alt="Localização" className="icon-img" />
  </button>
  <button className="icon-button" onClick={() => navigate('/compartilhados')}>
    <img src="/icons/pasta.png" alt="Compartilhados" />
  </button>
  <button className="icon-button" onClick={() => navigate('/alertas')}>
    <img src="/icons/notificacao.png" alt="Alertas" />
  </button>
</footer>

      </div>
    </div>
  )
}

export default Clima
