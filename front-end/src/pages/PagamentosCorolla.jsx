import { useEffect, useState } from 'react';
import axios from 'axios';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const API = 'https://meu-assistente.onrender.com/api/pagamentoscorolla';

function PagamentosCorolla() {
  const [pagamentos, setPagamentos] = useState([]);
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

  const anos = Array.from({ length: 2030 - 2020 + 1 }, (_, i) => 2020 + i);

  const carregarPagamentos = async () => {
    try {
      const res = await axios.get(`${API}?ano=${anoSelecionado}`);
      setPagamentos(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar pagamentos:', err);
    }
  };

  useEffect(() => {
    carregarPagamentos();
  }, [anoSelecionado]);

  const adicionarPagamento = async () => {
    if (!valor || !data) {
      alert('Preencha todos os campos');
      return;
    }

    const novo = {
      valor: Number(valor),
      data,
      status,
    };

    try {
      const res = await axios.post(API, novo);
      setPagamentos([res.data, ...pagamentos]);
      setValor('');
      setData('');
      setStatus('Pendente');
    } catch (err) {
      console.error('Erro ao adicionar pagamento:', err.response?.data || err.message);
      alert('Erro ao adicionar pagamento.');
    }
  };

  const alterarStatus = async (id, statusAtual) => {
    try {
      const novoStatus = statusAtual === 'Pago' ? 'Pendente' : 'Pago';
      const res = await axios.put(`${API}/${id}`, { status: novoStatus });
      setPagamentos(pagamentos.map(p => p._id === id ? res.data : p));
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const remover = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setPagamentos(pagamentos.filter(p => p._id !== id));
    } catch (err) {
      console.error('Erro ao remover pagamento:', err);
    }
  };

  const total = pagamentos.reduce((soma, p) => soma + (p.valor || 0), 0);
  const parcelasPagas = pagamentos.filter(p => p.status === 'Pago').length;
  const totalParcelas = pagamentos.length;

  // Dados para o gráfico (total pago e pendente)
  const totalPago = pagamentos
    .filter(p => p.status === 'Pago')
    .reduce((soma, p) => soma + (p.valor || 0), 0);

  const totalPendente = pagamentos
    .filter(p => p.status !== 'Pago')
    .reduce((soma, p) => soma + (p.valor || 0), 0);

  const dadosGrafico = [
    { nome: 'Pago', valor: totalPago },
    { nome: 'Pendente', valor: totalPendente },
  ];

  // Formatador de data no fuso horário de Brasília
  const formatarDataBrasilia = (dataStr) => {
    return new Date(dataStr).toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
  };

  return (
    <div>
      <h2>Pagamentos Corolla</h2>

      <Cartao>
        <div style={estilos.formulario}>
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={e => setValor(e.target.value)}
            style={estilos.input}
          />
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            style={estilos.input}
          />
          <Botao onClick={adicionarPagamento}>Adicionar Pagamento</Botao>
        </div>
      </Cartao>

      <Cartao>
        <div style={{ marginBottom: '1rem' }}>
          <label>Ano: </label>
          <select value={anoSelecionado} onChange={e => setAnoSelecionado(Number(e.target.value))}>
            {anos.map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>

        <h3>Total: R$ {total.toFixed(2)}</h3>
        <p>Parcelas pagas: {parcelasPagas} de {totalParcelas}</p>

        {/* Gráfico */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={dadosGrafico}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="valor" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ul style={{ paddingLeft: '1rem' }}>
          {pagamentos
            .slice()
            .sort((a, b) => new Date(a.data) - new Date(b.data))
            .map(p => (
              <li key={p._id} style={{ marginBottom: '0.5rem' }}>
                {formatarDataBrasilia(p.data)} — R$ {p.valor.toFixed(2)} — {p.status}
                <br />
                <Botao onClick={() => alterarStatus(p._id, p.status)}>
                  {p.status === 'Pago' ? 'Marcar como Pendente' : 'Marcar como Pago'}
                </Botao>{' '}
                <Botao tipo="perigo" onClick={() => remover(p._id)}>Remover</Botao>
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

export default PagamentosCorolla;
