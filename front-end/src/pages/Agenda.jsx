import { useState, useEffect } from 'react';
import axios from 'axios';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';

const API = 'https://meu-assistente.onrender.com/api/agenda';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Função que retorna a data atual no horário de Brasília (YYYY-MM-DD)
const getHojeBrasilia = () => {
  const agora = new Date();
  const utc = agora.getTime() + (agora.getTimezoneOffset() * 60000);
  const brasilia = new Date(utc - 3 * 3600000);
  return brasilia.toISOString().split('T')[0];
};

// Função que retorna a hora atual no horário de Brasília (HH:mm)
const getHoraBrasilia = () => {
  const agora = new Date();
  const utc = agora.getTime() + (agora.getTimezoneOffset() * 60000);
  const brasilia = new Date(utc - 3 * 3600000);
  const h = brasilia.getHours().toString().padStart(2, '0');
  const m = brasilia.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

function Agenda() {
  const [compromissos, setCompromissos] = useState([]);
  const [nome, setNome] = useState('');
  const [data, setData] = useState(getHojeBrasilia());
  const [hora, setHora] = useState(getHoraBrasilia());
  const [observacao, setObservacao] = useState('');
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1); // 1 a 12

  useEffect(() => {
    axios.get(API)
      .then(res => setCompromissos(res.data))
      .catch(err => console.error('Erro ao carregar agenda:', err));
  }, []);

  const adicionar = async () => {
    if (!nome || !data || !hora) {
      alert('Preencha nome, data e hora');
      return;
    }

    const novo = { nome, data, hora, observacao, status: 'pendente' };

    try {
      const res = await axios.post(API, novo);
      setCompromissos([res.data, ...compromissos]);
      setNome('');
      setData(getHojeBrasilia());
      setHora(getHoraBrasilia());
      setObservacao('');
    } catch (err) {
      alert('Erro ao adicionar compromisso');
    }
  };

  const alternarStatus = async (id, statusAtual) => {
    try {
      const res = await axios.put(`${API}/${id}`, {
        status: statusAtual === 'pendente' ? 'executado' : 'pendente'
      });
      setCompromissos(compromissos.map(c => c._id === id ? res.data : c));
    } catch (err) {
      alert('Erro ao alterar status');
    }
  };

  const remover = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setCompromissos(compromissos.filter(c => c._id !== id));
    } catch (err) {
      alert('Erro ao remover compromisso');
    }
  };

  // Filtra compromissos pelo mês selecionado e ordena pela data e hora, considerando o horário de Brasília
  const compromissosFiltrados = compromissos
    .filter(c => {
      // Pega o mês no horário de Brasília
      const utc = new Date(c.data).getTime() + (new Date(c.data).getTimezoneOffset() * 60000);
      const brasiliaDate = new Date(utc - 3 * 3600000);
      return brasiliaDate.getMonth() + 1 === mesSelecionado;
    })
    .sort((a, b) => {
      // Usa data e hora concatenados para ordenar, já no fuso correto
      const dataHoraA = new Date(`${a.data}T${a.hora}`);
      const dataHoraB = new Date(`${b.data}T${b.hora}`);
      return dataHoraA - dataHoraB;
    });

  return (
    <div style={estilos.container}>
      {/* Estilo dark para inputs e select */}
      <style>{`
        input[type="date"],
        input[type="time"],
        input[type="text"],
        select {
          color: #fff;
          background-color: #1e1e1e;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 0.5rem;
          font-family: sans-serif;
        }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
        select {
          cursor: pointer;
        }
      `}</style>

      <h2>Agenda</h2>

      <Cartao>
        <div style={estilos.formulario}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={estilos.input}
          />
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            style={estilos.input}
          />
          <input
            type="time"
            value={hora}
            onChange={e => setHora(e.target.value)}
            style={estilos.input}
          />
          <input
            type="text"
            placeholder="Observação"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
            style={estilos.input}
          />
          <Botao onClick={adicionar}>Adicionar</Botao>
        </div>
      </Cartao>

      <div style={{ margin: '1rem 0' }}>
        <label style={{ marginRight: '0.5rem', color: '#fff' }}>Mês: </label>
        <select
          value={mesSelecionado}
          onChange={e => setMesSelecionado(Number(e.target.value))}
          aria-label="Selecionar mês"
        >
          {MESES.map((mes, index) => (
            <option key={index + 1} value={index + 1}>{mes}</option>
          ))}
        </select>
      </div>

      {compromissosFiltrados.length === 0 && (
        <p style={{ color: '#aaa' }}>Nenhum compromisso para este mês.</p>
      )}

      {compromissosFiltrados.map(c => (
        <Cartao key={c._id}>
          <strong>{c.nome}</strong> — {new Date(c.data).toLocaleDateString('pt-BR')} às {c.hora}<br />
          {c.observacao && <small>{c.observacao}</small>}<br />
          <span style={{ color: c.status === 'executado' ? 'lightgreen' : 'orange', fontWeight: 'bold' }}>
            {c.status}
          </span>
          <div style={{ marginTop: '0.5rem' }}>
            <Botao onClick={() => alternarStatus(c._id, c.status)}>
              {c.status === 'executado' ? 'Marcar como pendente' : 'Marcar como executado'}
            </Botao>{' '}
            <Botao tipo="perigo" onClick={() => remover(c._id)}>Remover</Botao>
          </div>
        </Cartao>
      ))}
    </div>
  );
}

const estilos = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '1rem',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#fff',
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
};

export default Agenda;
