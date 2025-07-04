import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Clima from './pages/Clima'
import Calendario from './pages/Calendario'
import Alertas from './pages/Alertas'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clima" element={<Clima />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/alertas" element={<Alertas />} />
      </Routes>
    </Router>
  )
}

export default App