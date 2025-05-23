import { useState, useEffect } from 'react';
import axios from 'axios';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';

const API = 'https://meu-assistente.onrender.com/api/medicamentos';

function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [nome, setNome] = useState('');
  const [miligrama, setMiligrama] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    axios.get(API)
      .then(res => setMedicamentos(res.data))
      .catch(err => console.error('Erro ao carregar medicamentos:', err));
  }, []);

  const adicionar = async () => {
    if (!nome.trim()) {
      alert('Por favor, preencha o nome do medicamento.');
      return;
    }

    const novo = {
      nome: nome.trim(),
      miligrama: miligrama.trim(),
      observacao: observacao.trim(),
    };

    try {
      const res = await axios.post(API, novo);
      setMedicamentos([res.data, ...medicamentos]);
      setNome('');
      setMiligrama('');
      setObservacao('');
    } catch (err) {
      console.error('Erro ao adicionar medicamento:', err.response?.data || err.message);
      alert('Erro ao adicionar medicamento.');
    }
  };

  const remover = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setMedicamentos(medicamentos.filter(m => m._id !== id));
    } catch (err) {
      console.error('Erro ao remover medicamento:', err.response?.data || err.message);
      alert('Erro ao remover medicamento.');
    }
  };

  return (
    <div>
      <h2>Medicamentos</h2>

      <Cartao>
        <div style={estilos.formulario}>
          <input
            type="text"
            placeholder="Nome do medicamento"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={estilos.input}
          />
          <input
            type="text"
            placeholder="Miligrama"
            value={miligrama}
            onChange={e => setMiligrama(e.target.value)}
            style={estilos.input}
          />
          <textarea
            placeholder="Observação"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
            style={estilos.textarea}
          />
          <Botao onClick={adicionar}>Adicionar Medicamento</Botao>
        </div>
      </Cartao>

      <Cartao>
        <ul style={{ paddingLeft: '1rem' }}>
          {medicamentos.map(m => (
            <li key={m._id} style={{ marginBottom: '1rem' }}>
              <strong>{m.nome}</strong> — {m.miligrama} mg
              {m.observacao && <p style={{ margin: '0.3rem 0' }}>{m.observacao}</p>}
              <Botao tipo="perigo" onClick={() => remover(m._id)}>Remover</Botao>
            </li>
          ))}
        </ul>
      </Cartao>
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
  textarea: {
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    resize: 'vertical',
    minHeight: '3rem',
  },
};

export default Medicamentos;
