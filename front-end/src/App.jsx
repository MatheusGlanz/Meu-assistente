import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Agua from './pages/Agua';
import Agenda from './pages/Agenda';
import Tarefas from './pages/Tarefas';
import Compras from './pages/Compras';
import Contas from './pages/Contas';
import Medicamentos from './pages/Medicamentos';  
import PagamentosCorolla from './pages/PagamentosCorolla';



function App() {
  return (
    <Router>
      <div style={estilos.app}>
        <header style={estilos.header}>
          <h1>Assistente Pessoal</h1>
          <nav style={estilos.nav}>
            <Link to="/" style={estilos.link}>Ingestão de Água</Link>
            <Link to="/agenda" style={estilos.link}>Agenda</Link>
            <Link to="/tarefas" style={estilos.link}>Tarefas</Link>
            <Link to="/compras" style={estilos.link}>Lista de Mercado</Link>
            <Link to="/contas" style={estilos.link}>Contas</Link>
            <Link to="/medicamentos" style={estilos.link}>Medicamentos</Link>
            <Link to="/pagamentosCorolla" style={estilos.link}>Pagamentos Corolla</Link>


          </nav>
        </header>

         {/* CSS global para responsividade */}
        <style>{`
          @media (max-width: 600px) {
            nav {
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            nav a {
              font-size: 1.1rem !important;
              padding: 0.5rem;
              display: block;
              border-radius: 6px;
              background-color: #333;
            }
            nav a:hover {
              background-color: #00bcd4;
              color: #121212 !important;
            }
            main {
              padding: 1rem !important;
              max-width: 100% !important;
            }
            header h1 {
              font-size: 1.5rem;
              margin: 0;
            }
          }
        `}</style>
      </div>
    </Router>
  );
}

const estilos = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: '#ffffff',
    fontFamily: 'sans-serif',
  },
  header: {
    backgroundColor: '#1e1e1e',
    padding: '1rem 2rem',
    borderBottom: '1px solid #333',
  },
  nav: {
    marginTop: '0.5rem',
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: '#00bcd4',
    textDecoration: 'none',
  },
  main: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
};

export default App;
