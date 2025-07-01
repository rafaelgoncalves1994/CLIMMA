# CLIMMA — Aplicação Web de Clima com Login, Registro e Calendário

Aplicação full stack desenvolvida com **Flask (Python)** no backend e **React + Vite** no frontend, com **CSS puro**, sem frameworks externos de estilo. O objetivo é fornecer uma interface moderna, centrada, responsiva e com visual mobile first — exibindo a previsão do tempo de forma limpa e objetiva.

---

# Funcionalidades

- Tela de login com botão de acesso e de cadastro
- Tela de registro de usuário (redireciona para login após sucesso)
- Tela de clima com:
  - Previsão do tempo em tempo real (OpenWeatherMap)
  - Campo de busca por cidade (com lupa funcional)
  - Botões de navegação: Calendário e Logout
- Tela de calendário com seletor de data
- Rodapé com navegação fixa estilo mobile
- Visual baseado em mockups modernos e com fundo bege claro
- Layout otimizado para visualização em dispositivos móveis

---

## Tecnologias utilizadas

### Backend
- [Python 3.11+](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
- API de clima: [OpenWeatherMap](https://openweathermap.org/)

### Frontend
- [Node.js](https://nodejs.org/) (v16+ recomendado)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/) — build tool para React
- CSS puro e responsivo

---

## Estrutura de Pastas

```plaintext
/backend
  ├── app.py               # Inicialização do Flask
  ├── auth.py              # Rotas de login/registro
  ├── weather.py           # Rota de busca de clima
  └── requirements.txt     # Bibliotecas Python

/frontend
  ├── index.html
  ├── main.jsx
  ├── App.jsx
  ├── pages/
  │   ├── Login.jsx
  │   ├── Register.jsx
  │   ├── Clima.jsx
  │   └── Calendario.jsx
  ├── assets/
  │   └── climma-logo.png
  └── styles/
      └── global.css
```

---

## Instalação e Execução

### Backend (Flask)

```bash
# 1. Acesse a pasta backend
cd backend

# 2. Crie e ative um ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# 3. Instale os pacotes
pip install -r requirements.txt

# 4. Inicie o servidor Flask
python app.py
```

> O servidor Flask estará rodando em: `http://localhost:5000`

---

# Frontend (React + Vite)

```bash
# 1. Acesse a pasta frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor React
npm run dev
```

> O app React estará disponível em: `http://localhost:5173`

---

# Variáveis importantes

No backend (Flask), se quiser configurar a chave da API do OpenWeatherMap, edite `weather.py`:

```python
API_KEY = "SUA_CHAVE_AQUI"
```

---

# Como funciona a busca do clima?

Na tela de clima:
- Ao digitar o nome de uma cidade e pressionar `Enter`, ou clicar na lupa, a aplicação consulta a rota:
```
GET /weather?city=NomeDaCidade
```
- O backend conecta-se ao OpenWeatherMap, busca os dados e retorna:
```json
{
  "cidade": "Recife",
  "temperatura": 26,
  "descricao": "céu limpo",
  "icone": "01d"
}
```

---

# Banco de dados

Por simplicidade, o backend atual utiliza **armazenamento de usuários em memória (dicionário)**.  
Para produção, recomenda-se usar:
- SQLite ou PostgreSQL
- Autenticação com JWT ou Flask-Login

---

## Autores e contribuições

> RAFAEL GONÇALVES

---

# Futuras melhorias (roadmap)

- Integração com banco real (SQLite)
- Autenticação persistente (JWT/Flask-Login)
- Histórico de clima consultado
- Sistema de alertas de chuva
- Versão PWA (instalável)

---

# Status do projeto

🔧 **Em desenvolvimento contínuo** — todas as telas funcionais e integradas. Estilo e layout já padronizados.  
APIs conectadas e funcionando corretamente.