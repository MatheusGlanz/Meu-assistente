import { useState, useEffect } from 'react';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';
import axios from 'axios';

const API = 'http://localhost:5000/api/compras';

function Compras() {
  const [itens, setItens] = useState([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    axios.get(API)
      .then(res => setItens(res.data))
      .catch(err => console.error('Erro ao carregar itens:', err));
  }, []);

  const adicionar = async () => {
    if (!nome.trim()) {
      alert('Por favor, preencha o nome do item.');
      return;
    }
    if (quantidade <= 0) {
      alert('Quantidade deve ser maior que zero.');
      return;
    }

    const novo = {
      nome: nome.trim(),
      categoria: categoria.trim() || 'Sem categoria',
      quantidade,
      comprado: false,
    };

    try {
      const res = await axios.post(API, novo);
      setItens([res.data, ...itens]);
      setNome('');
      setCategoria('');
      setQuantidade(1);
    } catch (err) {
      console.error('Erro ao adicionar item:', err.response?.data || err.message);
      alert('Erro ao adicionar item.');
    }
  };

  const alternarCompra = async (id, compradoAtual) => {
    try {
      const res = await axios.put(`${API}/${id}`, { comprado: !compradoAtual });
      setItens(itens.map(i => i._id === id ? res.data : i));
    } catch (err) {
      console.error('Erro ao atualizar status:', err.response?.data || err.message);
      alert('Erro ao atualizar status de comprado.');
    }
  };

  const remover = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setItens(itens.filter(i => i._id !== id));
    } catch (err) {
      console.error('Erro ao remover item:', err.response?.data || err.message);
      alert('Erro ao remover item.');
    }
  };

  const categorias = [...new Set(itens.map(i => i.categoria))];

  return (
    <div>
      <h2>Lista de Compras</h2>

      <Cartao>
        <div style={estilos.formulario}>
          <input
            type="text"
            placeholder="Nome do item"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={estilos.input}
          />
          <input
            type="number"
            min="1"
            placeholder="Quantidade"
            value={quantidade}
            onChange={e => setQuantidade(Number(e.target.value) || 1)}
            style={estilos.input}
          />
          <input
            type="text"
            placeholder="Categoria (ex: Limpeza, Alimentos)"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            style={estilos.input}
          />
          <Botao onClick={adicionar}>Adicionar Item</Botao>
        </div>
      </Cartao>

      {categorias.map(cat => (
        <Cartao key={cat}>
          <h3>{cat}</h3>
          <ul style={{ paddingLeft: '1rem' }}>
            {itens.filter(i => i.categoria === cat).map(i => (
              <li key={i._id} style={{ marginBottom: '0.5rem' }}>
                <span style={{
                  textDecoration: i.comprado ? 'line-through' : 'none',
                  opacity: i.comprado ? 0.6 : 1,
                }}>
                  {i.nome} — {i.quantidade} un.
                </span>
                <br />
                <Botao onClick={() => alternarCompra(i._id, i.comprado)}>
                  {i.comprado ? 'Desmarcar' : 'Comprado'}
                </Botao>{' '}
                <Botao tipo="perigo" onClick={() => remover(i._id)}>Remover</Botao>
              </li>
            ))}
          </ul>
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

export default Compras;
