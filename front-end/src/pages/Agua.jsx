import { useState, useEffect } from 'react';
import axios from 'axios';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API = 'https://meu-assistente.onrender.com/api/agua';
const META_DIARIA = 4000;

// Função que retorna a data atual no horário de Brasília no formato YYYY-MM-DD
const getHoje = () => {
  const agora = new Date();
  const utc = agora.getTime() + (agora.getTimezoneOffset() * 60000);
  const brasilia = new Date(utc - 3 * 3600000);
  return brasilia.toISOString().split('T')[0];
};

// Função que retorna a hora atual no horário de Brasília no formato HH:mm
const getHoraBrasilia = () => {
  const agora = new Date();
  const utc = agora.getTime() + (agora.getTimezoneOffset() * 60000);
  const brasilia = new Date(utc - 3 * 3600000);
  const h = brasilia.getHours().toString().padStart(2, '0');
  const m = brasilia.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

function Agua() {
  const [registros, setRegistros] = useState([]);
  const [quantidade, setQuantidade] = useState('');
  const [horario, setHorario] = useState(getHoraBrasilia());
  const [data, setData] = useState(getHoje());
  const [filtroData, setFiltroData] = useState(getHoje());

  useEffect(() => {
    axios.get(API)
      .then(res => setRegistros(res.data))
      .catch(err => console.error('Erro ao carregar ingestões:', err));
  }, []);

  const adicionar = async () => {
    if (!quantidade || !horario || !data) {
      alert('Preencha todos os campos.');
      return;
    }

    const novo = { quantidade: Number(quantidade), horario, data };

    try {
      const res = await axios.post(API, novo);
      setRegistros([res.data, ...registros]);
      setQuantidade('');
      setHorario(getHoraBrasilia());
      setData(getHoje());
    } catch (err) {
      console.error('Erro ao adicionar registro:', err.response?.data || err.message);
      alert('Erro ao adicionar ingestão.');
    }
  };

  const remover = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setRegistros(registros.filter(r => r._id !== id));
    } catch (err) {
      console.error('Erro ao remover registro:', err.response?.data || err.message);
      alert('Erro ao remover ingestão.');
    }
  };

  // Filtra registros do dia selecionado e ordena por horário
  const registrosDoDia = registros
    .filter(r => r.data === filtroData)
    .sort((a, b) => a.horario.localeCompare(b.horario));

  const totalDia = registrosDoDia.reduce((soma, r) => soma + r.quantidade, 0);
  const percentual = Math.min((totalDia / META_DIARIA) * 100, 100);

  // Dados para gráfico
  const dadosGrafico = registrosDoDia.map(r => ({
    horario: r.horario.slice(0, 5),
    quantidade: r.quantidade,
  }));

  return (
    <div>
      <style>{`
        input[type="date"],
        input[type="time"] {
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
      `}</style>

      <h2>Ingestão de Água</h2>

      <Cartao>
        <div style={estilos.formulario}>
          <input
            type="number"
            placeholder="Quantidade (ml)"
            value={quantidade}
            onChange={e => setQuantidade(e.target.value)}
            style={estilos.input}
            min="1"
          />
          <input
            type="time"
            value={horario}
            onChange={e => setHorario(e.target.value)}
            style={estilos.input}
          />
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            style={estilos.input}
          />
          <Botao onClick={adicionar}>Registrar Ingestão</Botao>
        </div>
      </Cartao>

      <Cartao>
        <div style={{ marginBottom: '1rem' }}>
          <label>Filtrar por data:</label>
          <input
            type="date"
            value={filtroData}
            onChange={e => setFiltroData(e.target.value)}
            style={estilos.input}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Total ingerido:</strong> {totalDia} ml / {META_DIARIA} ml
        </div>
        <div style={estilos.barraContainer}>
          <div style={{ ...estilos.barraInterna, width: `${percentual}%` }}>
            {percentual.toFixed(0)}%
          </div>
        </div>
      </Cartao>

      {registrosDoDia.length > 0 && (
        <Cartao>
          <h4>Gráfico por horário</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosGrafico}>
              <XAxis dataKey="horario" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#4fc3f7" />
            </BarChart>
          </ResponsiveContainer>
        </Cartao>
      )}

      {registrosDoDia.map(r => (
        <Cartao key={r._id}>
          <p><strong>{r.quantidade} ml</strong> — {r.horario}</p>
          <Botao tipo="perigo" onClick={() => remover(r._id)}>Remover</Botao>
        </Cartao>
      ))}
    </div>
  );
}

const estilos = {
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
  barraContainer: {
    backgroundColor: '#333',
    borderRadius: '20px',
    height: '25px',
    width: '100%',
    overflow: 'hidden',
  },
  barraInterna: {
    height: '100%',
    backgroundColor: '#4fc3f7',
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '25px',
  },
};

export default Agua;
