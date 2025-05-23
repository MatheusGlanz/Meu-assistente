import { useState, useEffect } from 'react';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';
import axios from 'axios';

const API = 'https://meu-assistente.onrender.com/api/contas';

function Contas() {
  const [contas, setContas] = useState([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroAno, setFiltroAno] = useState('');

  useEffect(() => {
    axios.get(API)
      .then(res => setContas(res.data))
      .catch(err => console.error('Erro ao carregar contas:', err));
  }, []);

  const adicionar = async () => {
    if (!nome.trim() || !valor || !vencimento) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const nova = {
      nome: nome.trim(),
      categoria: categoria.trim() || 'Outros',
      valor: parseFloat(valor),
      pago: false,
      vencimento,
    };

    try {
      const res = await axios.post(API, nova);
      setContas([res.data, ...contas]);
      setNome('');
      setCategoria('');
      setValor('');
      setVencimento('');
    } catch (err) {
      console.error('Erro ao adicionar conta:', err);
      alert('Erro ao adicionar conta.');
    }
  };

  const alternarPago = async (id, pagoAtual) => {
    try {
      const res = await axios.put(`${API}/${id}`, { pago: !pagoAtual });
      setContas(contas.map(c => c._id === id ? res.data : c));
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status.');
    }
  };

  const remover = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setContas(contas.filter(c => c._id !== id));
    } catch (err) {
      console.error('Erro ao remover conta:', err);
      alert('Erro ao remover conta.');
    }
  };

  const contasFiltradas = contas.filter(c => {
    const data = new Date(c.vencimento);
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    return (!filtroMes || mes === Number(filtroMes)) &&
           (!filtroAno || ano === Number(filtroAno));
  });

  const total = contasFiltradas.reduce((soma, c) => soma + c.valor, 0);

  const categorias = [...new Set(contasFiltradas.map(c => c.categoria))];

  return (
    <div>
      <h2>Contas Domésticas</h2>

      <Cartao>
        <div style={estilos.formulario}>
          <input
            type="text"
            placeholder="Nome da conta"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={estilos.input}
          />
          <input
            type="number"
            placeholder="Valor (R$)"
            value={valor}
            onChange={e => setValor(e.target.value)}
            style={estilos.input}
          />
          <input
            type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            style={estilos.input}
          />
          <input
            type="date"
            value={vencimento}
            onChange={e => setVencimento(e.target.value)}
            style={estilos.input}
          />
          <Botao onClick={adicionar}>Adicionar Conta</Botao>
        </div>
      </Cartao>

      <Cartao>
        <h3>Filtro por mês/ano</h3>
        <div style={estilos.formulario}>
          <input
            type="number"
            min="1"
            max="12"
            placeholder="Mês (1-12)"
            value={filtroMes}
            onChange={e => setFiltroMes(e.target.value)}
            style={estilos.input}
          />
          <input
            type="number"
            placeholder="Ano (ex: 2025)"
            value={filtroAno}
            onChange={e => setFiltroAno(e.target.value)}
            style={estilos.input}
          />
        </div>
      </Cartao>

      <Cartao>
        <h3>Total das contas: R$ {total.toFixed(2)}</h3>
      </Cartao>

      {categorias.map(cat => (
        <Cartao key={cat}>
          <h3>{cat}</h3>
          <ul style={{ paddingLeft: '1rem' }}>
            {contasFiltradas.filter(c => c.categoria === cat).map(c => (
              <li key={c._id} style={{ marginBottom: '0.5rem' }}>
                <span style={{
                  textDecoration: c.pago ? 'line-through' : 'none',
                  opacity: c.pago ? 0.6 : 1,
                }}>
                  {c.nome} — R$ {c.valor.toFixed(2)}<br />
                  Vencimento: {new Date(c.vencimento).toLocaleDateString()}
                </span>
                <br />
                <Botao onClick={() => alternarPago(c._id, c.pago)}>
                  {c.pago ? 'Desmarcar' : 'Pago'}
                </Botao>{' '}
                <Botao tipo="perigo" onClick={() => remover(c._id)}>Remover</Botao>
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

export default Contas;
