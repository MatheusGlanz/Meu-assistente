import { useState, useEffect } from 'react';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';
import axios from 'axios';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

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

  // Filtra contas por mês e ano (se selecionado)
  const contasFiltradas = contas.filter(c => {
    const data = new Date(c.vencimento);
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    return (!filtroMes || mes === Number(filtroMes)) &&
           (!filtroAno || ano === Number(filtroAno));
  });

  // Agrupa e soma as contas por mês/ano (para o gráfico)
  const dadosGrafico = contasFiltradas.reduce((acc, c) => {
    const data = new Date(c.vencimento);
    const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;

    const idx = acc.findIndex(item => item.mes === mesAno);
    if (idx >= 0) {
      acc[idx].total += c.valor;
    } else {
      acc.push({ mes: mesAno, total: c.valor });
    }
    return acc;
  }, []);

  // Ordena os dados do gráfico pela data
  dadosGrafico.sort((a, b) => a.mes.localeCompare(b.mes));

  // Soma total geral das contas filtradas
  const totalGeral = contasFiltradas.reduce((s, c) => s + c.valor, 0);

  return (
    <div>
      {/* CSS embutido para inputs number com estilo dark e ícones invertidos */}
      <style>{`
        input[type="number"], input[type="text"], input[type="date"] {
          color: #fff;
          background-color: #1e1e1e;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 0.5rem;
          font-family: sans-serif;
          width: 100%;
          box-sizing: border-box;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          filter: invert(1);
          cursor: pointer;
        }
        input[type="number"]::-moz-inner-spin-button,
        input[type="number"]::-moz-outer-spin-button {
          filter: invert(1);
          cursor: pointer;
        }
        /* Estilo para filtro mês/ano */
        .inputFiltro {
          color: #fff !important;
          background-color: #1e1e1e !important;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 0.5rem;
          font-family: sans-serif;
          width: 100%;
          box-sizing: border-box;
        }
      `}</style>

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
            className="inputFiltro"
          />
          <input
            type="number"
            placeholder="Ano (ex: 2025)"
            value={filtroAno}
            onChange={e => setFiltroAno(e.target.value)}
            className="inputFiltro"
          />
        </div>
      </Cartao>

      <Cartao>
        <h3>Total Geral: R$ {totalGeral.toFixed(2)}</h3>

        {/* Gráfico de barras: soma total por mês */}
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={dadosGrafico}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="mes" stroke="#ccc" 
                tickFormatter={(tick) => {
                  const [ano, mes] = tick.split('-');
                  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                  return `${meses[Number(mes) - 1]}/${ano}`;
                }}
              />
              <YAxis stroke="#ccc" />
              <Tooltip
                formatter={(value) => `R$ ${value.toFixed(2)}`}
                labelFormatter={(label) => {
                  const [ano, mes] = label.split('-');
                  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                  return `${meses[Number(mes) - 1]}/${ano}`;
                }}
                contentStyle={{ backgroundColor: '#222', borderRadius: '8px', border: 'none' }}
                labelStyle={{ color: '#ddd' }}
              />
              <Legend wrapperStyle={{ color: '#ddd' }} />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Cartao>

      {/* Lista das contas agrupadas por categoria */}
      {Array.from(new Set(contasFiltradas.map(c => c.categoria))).map(cat => (
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
