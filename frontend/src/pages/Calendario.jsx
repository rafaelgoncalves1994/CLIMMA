import { useNavigate } from 'react-router-dom'

function Calendario() {
  const navigate = useNavigate()

  return (
    <div className="container center-text">
      <header className="clima-header">
        <img src="/climma-logo.png" alt="Logo Climma" className="logo" />
      </header>

      <h2>Selecionar Data</h2>
      <input type="date" />
      <div className="nav-buttons">
        <button onClick={() => navigate('/clima')}>🔙 Voltar</button>
      </div>
    </div>
  )
}

export default Calendario
