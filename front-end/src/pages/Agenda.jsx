import { useState, useEffect } from 'react';
import axios from 'axios';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';

const API = 'http://localhost:5000/api/agenda';

function Agenda() {
  const [compromissos, setCompromissos] = useState([]);
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [observacao, setObservacao] = useState('');

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
      setData('');
      setHora('');
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

  return (
    <div>
      <h2>Agenda</h2>
      <Cartao>
        <div style={estilos.formulario}>
          <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} style={estilos.input} />
          <input type="date" value={data} onChange={e => setData(e.target.value)} style={estilos.input} />
          <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={estilos.input} />
          <input type="text" placeholder="Observação" value={observacao} onChange={e => setObservacao(e.target.value)} style={estilos.input} />
          <Botao onClick={adicionar}>Adicionar</Botao>
        </div>
      </Cartao>

      {compromissos.map(c => (
        <Cartao key={c._id}>
          <strong>{c.nome}</strong> — {c.data} às {c.hora}<br />
          <small>{c.observacao}</small><br />
          <span style={{ color: c.status === 'executado' ? 'lightgreen' : 'orange' }}>
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
