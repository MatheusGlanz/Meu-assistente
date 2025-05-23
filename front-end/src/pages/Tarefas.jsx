import { useState, useEffect } from 'react';
import axios from 'axios';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';

const API = 'https://meu-assistente.onrender.com/api/tarefas';

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [observacao, setObservacao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    axios.get(API)
      .then(res => setTarefas(res.data))
      .catch(err => console.error('Erro ao carregar tarefas:', err));
  }, []);

  const adicionar = async () => {
    if (!descricao.trim()) {
      alert('Descrição é obrigatória.');
      return;
    }

    try {
      const nova = {
        descricao,
        observacao,
        data,
        hora,
        status: 'Pendente',
      };
      const res = await axios.post(API, nova);
      setTarefas([res.data, ...tarefas]);
      setDescricao('');
      setObservacao('');
      setData('');
      setHora('');
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
    }
  };

  const alternarStatus = async (id, statusAtual) => {
    const novoStatus = statusAtual === 'Executada' ? 'Pendente' : 'Executada';
    try {
      const res = await axios.put(`${API}/${id}`, { status: novoStatus });
      setTarefas(tarefas.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  const remover = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTarefas(tarefas.filter(t => t._id !== id));
    } catch (err) {
      console.error('Erro ao remover tarefa:', err);
    }
  };

  return (
    <div>
      {/* CSS embutido para inputs date e time com texto branco e ícones invertidos */}
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
        input[type="date"]::-moz-calendar-picker-indicator,
        input[type="time"]::-moz-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>

      <h2>Minhas Tarefas</h2>
      <Cartao>
        <div style={estilos.formulario}>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            style={estilos.input}
          />
          <input
            type="text"
            placeholder="Observação"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
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
          <Botao onClick={adicionar}>Adicionar Tarefa</Botao>
        </div>
      </Cartao>

      {tarefas.map(t => (
        <Cartao key={t._id}>
          <p><strong>{t.descricao}</strong></p>
          {t.observacao && <p>📝 {t.observacao}</p>}
          {(t.data || t.hora) && (
            <p>📅 {t.data || ''} ⏰ {t.hora || ''}</p>
          )}
          <p>Status: <strong>{t.status}</strong></p>
          <Botao onClick={() => alternarStatus(t._id, t.status)}>
            {t.status === 'Executada' ? 'Marcar como Pendente' : 'Marcar como Executada'}
          </Botao>{' '}
          <Botao tipo="perigo" onClick={() => remover(t._id)}>Remover</Botao>
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
};

export default Tarefas;
