import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';

const API = 'https://meu-assistente.onrender.com/api/tarefas';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Função para obter o horário atual de Brasília no formato "HH:mm"
function horaAtualBrasilia() {
  const agora = new Date();

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const partes = formatter.formatToParts(agora);
  const hora = partes.find(p => p.type === 'hour')?.value || '00';
  const minuto = partes.find(p => p.type === 'minute')?.value || '00';

  return `${hora}:${minuto}`;
}

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [observacao, setObservacao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    setHora(horaAtualBrasilia());

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
      setHora(horaAtualBrasilia());
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

  // Filtrar tarefas pelo mês selecionado e ordenar por data e hora
  const tarefasFiltradas = tarefas
    .filter(t => {
      if (!t.data) return false;
      return new Date(t.data).getMonth() + 1 === mesSelecionado;
    })
    .sort((a, b) => {
      const dataHoraA = new Date(a.data);
      const dataHoraB = new Date(b.data);

      if (a.hora) {
        const [hA, mA] = a.hora.split(':');
        dataHoraA.setHours(parseInt(hA), parseInt(mA), 0, 0);
      } else {
        dataHoraA.setHours(0, 0, 0, 0);
      }

      if (b.hora) {
        const [hB, mB] = b.hora.split(':');
        dataHoraB.setHours(parseInt(hB), parseInt(mB), 0, 0);
      } else {
        dataHoraB.setHours(0, 0, 0, 0);
      }

      return dataHoraA - dataHoraB;
    });

  // Dados para o gráfico: conta quantas tarefas estão em cada status no mês filtrado
  const dadosGrafico = [
    {
      status: 'Pendentes',
      quantidade: tarefasFiltradas.filter(t => t.status === 'Pendente').length,
    },
    {
      status: 'Executadas',
      quantidade: tarefasFiltradas.filter(t => t.status === 'Executada').length,
    }
  ];

  return (
    <div style={estilos.container}>
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

      <div style={{ margin: '1rem 0', color: '#fff' }}>
        <label style={{ marginRight: '0.5rem' }}>Mês: </label>
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

      {/* Gráfico */}
      <Cartao style={{ marginBottom: '1rem', padding: '1rem' }}>
        <h3>Resumo de Tarefas - {MESES[mesSelecionado - 1]}</h3>
        {tarefasFiltradas.length === 0 ? (
          <p style={{ color: '#aaa' }}>Nenhuma tarefa para este mês.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={dadosGrafico}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="status" stroke="#ccc" />
              <YAxis allowDecimals={false} stroke="#ccc" />
              <Tooltip
                contentStyle={{ backgroundColor: '#222', borderRadius: '8px', border: 'none' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="quantidade" fill="#8884d8" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Cartao>

      {tarefasFiltradas.map(t => (
        <Cartao key={t._id}>
          <p><strong>{t.descricao}</strong></p>
          {t.observacao && <p>📝 {t.observacao}</p>}
          {(t.data || t.hora) && (
            <p>📅 {t.data} ⏰ {t.hora ? t.hora : '--:--'}</p>
          )}
          <p>Status: <strong style={{ color: t.status === 'Executada' ? 'lightgreen' : 'orange' }}>{t.status}</strong></p>
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

export default Tarefas;
