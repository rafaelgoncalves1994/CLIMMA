import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    const res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (res.ok) {
      alert('Registrado com sucesso!')
      navigate('/')
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="container">
      <h2>Registro - Climma</h2>
      <input placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrar</button>
    </div>
  )
}

export default Register