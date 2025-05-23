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

        <main style={estilos.main}>
          <Routes>
            <Route path="/" element={<Agua />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/contas" element={<Contas />} />
            <Route path="/medicamentos" element={<Medicamentos />} />
            <Route path="/pagamentosCorolla" element={<PagamentosCorolla />} />
          </Routes>
        </main>
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
