import { useState, useEffect } from 'react';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';
import axios from 'axios';

const API = 'https://meu-assistente.onrender.com/api/compras';

function Compras() {
  const [itens, setItens] = useState([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const opcoesCategorias = [
    'Hortifruti',
    'Alimento',
    'Fruta',
    'Carne',
    'Guloseimas',
    'Princesa',
    'Limpeza'
  ];

  useEffect(() => {
    axios.get(API)
      .then(res => setItens(res.data))
      .catch(err => console.error('Erro ao carregar itens:', err));
  }, []);

  const adicionar = async () => {
    const qtd = Number(quantidade);

    if (!nome.trim()) {
      alert('Por favor, preencha o nome do item.');
      return;
    }

    if (!categoria.trim()) {
      alert('Por favor, selecione uma categoria.');
      return;
    }

    if (isNaN(qtd) || qtd <= 0) {
      alert('Quantidade deve ser um número maior que zero.');
      return;
    }

    const novo = {
      nome: nome.trim(),
      categoria,
      quantidade: qtd,
    };

    try {
      if (editandoId) {
        // Atualizar item existente
        const res = await axios.put(`${API}/${editandoId}`, novo);
        setItens(itens.map(i => i._id === editandoId ? res.data : i));
        setEditandoId(null);
      } else {
        // Adicionar novo item
        const res = await axios.post(API, { ...novo, comprado: false });
        setItens([res.data, ...itens]);
      }

      // Limpar formulário
      setNome('');
      setCategoria('');
      setQuantidade('');
    } catch (err) {
      console.error('Erro ao salvar item:', err.response?.data || err.message);
      alert('Erro ao salvar item.');
    }
  };

  const editar = (item) => {
    setEditandoId(item._id);
    setNome(item.nome);
    setCategoria(item.categoria);
    setQuantidade(item.quantidade.toString());
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
      if (editandoId === id) {
        setEditandoId(null);
        setNome('');
        setCategoria('');
        setQuantidade('');
      }
    } catch (err) {
      console.error('Erro ao remover item:', err.response?.data || err.message);
      alert('Erro ao remover item.');
    }
  };

  const itensFiltrados = categoriaFiltro
    ? itens.filter(i => i.categoria === categoriaFiltro)
    : itens;

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
            placeholder="Quantidade"
            value={quantidade}
            onChange={e => setQuantidade(e.target.value)}
            style={estilos.input}
          />
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            style={estilos.input}
          >
            <option value="">Selecione a categoria</option>
            {opcoesCategorias.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          <Botao onClick={adicionar}>
            {editandoId ? 'Salvar Alteração' : 'Adicionar Item'}
          </Botao>
        </div>
      </Cartao>

      <Cartao>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label>
            Filtrar por categoria:{' '}
            <select
              value={categoriaFiltro}
              onChange={e => setCategoriaFiltro(e.target.value)}
              style={estilos.input}
            >
              <option value="">Todas</option>
              {opcoesCategorias.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <Botao onClick={() => setCategoriaFiltro('')}>Limpar Filtro</Botao>
        </div>
      </Cartao>

      <Cartao>
        <ul style={{ paddingLeft: '1rem' }}>
          {itensFiltrados.map(i => (
            <li key={i._id} style={{ marginBottom: '0.5rem' }}>
              <span style={{
                textDecoration: i.comprado ? 'line-through' : 'none',
                opacity: i.comprado ? 0.6 : 1,
              }}>
                {i.nome} — {i.quantidade} un. {i.categoria && `(${i.categoria})`}
              </span>
              <br />
              <Botao onClick={() => alternarCompra(i._id, i.comprado)}>
                {i.comprado ? 'Desmarcar' : 'Comprado'}
              </Botao>{' '}
              <Botao onClick={() => editar(i)}>Editar</Botao>{' '}
              <Botao tipo="perigo" onClick={() => remover(i._id)}>Remover</Botao>
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
};

export default Compras;
