import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Erro ao fazer login: " + error.message);
      return;
    }

    // Guarda dados do usuário localmente
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/clima");
  };

  return (
    <div className="container center-text">
      <img src="/climma-logo.png" alt="Logo Climma" className="logo-login" />
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="login-buttons">
        <button onClick={handleLogin}>Entrar</button>
        <button onClick={() => navigate("/register")}>Registrar</button>
      </div>
    </div>
  );
}

export default Login;
