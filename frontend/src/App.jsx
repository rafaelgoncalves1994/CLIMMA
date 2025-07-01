import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Clima from './pages/Clima'
import Calendario from './pages/Calendario'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clima" element={<Clima />} />
        <Route path="/calendario" element={<Calendario />} />
      </Routes>
    </Router>
  )
}

export default App