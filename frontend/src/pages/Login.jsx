import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (res.ok) {
      navigate('/clima')
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="container center-text">
      <img src="/climma-logo.png" alt="Logo Climma" className="logo-login" />
      <h2>Login</h2>
      <input placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
      <div className="login-buttons">
  <button onClick={handleLogin}>Entrar</button>
  <button onClick={() => navigate('/register')}>Registrar</button>
</div>

    </div>
  )
}

export default Login
