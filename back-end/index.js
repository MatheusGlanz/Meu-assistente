const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Compra = require('./models/compra');
const Conta = require('./models/conta');
const Tarefa = require('./models/tarefa');
const Agenda = require('./models/agenda');
const IngestaoAgua = require('./models/IngestaoAgua');
const PagamentoCorolla = require('./models/PagamentosCorolla');


const app = express();
const PORT = 5000;

// Configurações


app.use(cors());
app.use(express.json());

// Conectar MongoDB
mongoose.connect('mongodb+srv://glanzmatheus:Z3rhVfzBfLheHrcc@cluster0.zhhzmoh.mongodb.net/minhaBase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado!'))
.catch(err => console.error('Erro MongoDB:', err));

// Rotas

// Listar todas compras
app.get('/api/compras', async (req, res) => {
  try {
    const compras = await Compra.find().sort({ createdAt: -1 });
    res.json(compras);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar compra
app.post('/api/compras', async (req, res) => {
  try {
    const compra = new Compra(req.body);
    await compra.save();
    res.status(201).json(compra);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar compra (ex: comprado)
app.put('/api/compras/:id', async (req, res) => {
  try {
    const compra = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!compra) return res.status(404).json({ message: 'Item não encontrado' });
    res.json(compra);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar compra
app.delete('/api/compras/:id', async (req, res) => {
  try {
    await Compra.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removido' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect('mongodb+srv://glanzmatheus:Z3rhVfzBfLheHrcc@cluster0.zhhzmoh.mongodb.net/minhaBase?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro MongoDB:', err));

// Rotas de contas

// Listar contas
app.get('/api/contas', async (req, res) => {
  try {
    const contas = await Conta.find().sort({ createdAt: -1 });
    res.json(contas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar conta
app.post('/api/contas', async (req, res) => {
  try {
    const conta = new Conta(req.body);
    await conta.save();
    res.status(201).json(conta);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar status de pagamento
app.put('/api/contas/:id', async (req, res) => {
  try {
    const conta = await Conta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!conta) return res.status(404).json({ message: 'Conta não encontrada' });
    res.json(conta);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remover conta
app.delete('/api/contas/:id', async (req, res) => {
  try {
    await Conta.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conta removida' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar todas as tarefas
app.get('/api/tarefas', async (req, res) => {
  try {
    const tarefas = await Tarefa.find().sort({ createdAt: -1 });
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar tarefa
app.post('/api/tarefas', async (req, res) => {
  try {
    const tarefa = new Tarefa(req.body);
    await tarefa.save();
    res.status(201).json(tarefa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar tarefa
app.put('/api/tarefas/:id', async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });
    res.json(tarefa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar tarefa
app.delete('/api/tarefas/:id', async (req, res) => {
  try {
    await Tarefa.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tarefa removida' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar compromissos
app.get('/api/agenda', async (req, res) => {
  try {
    const compromissos = await Agenda.find().sort({ data: 1, hora: 1 });
    res.json(compromissos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar compromisso
app.post('/api/agenda', async (req, res) => {
  try {
    const compromisso = new Agenda(req.body);
    await compromisso.save();
    res.status(201).json(compromisso);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar compromisso
app.put('/api/agenda/:id', async (req, res) => {
  try {
    const compromisso = await Agenda.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!compromisso) return res.status(404).json({ message: 'Compromisso não encontrado' });
    res.json(compromisso);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remover compromisso
app.delete('/api/agenda/:id', async (req, res) => {
  try {
    await Agenda.findByIdAndDelete(req.params.id);
    res.json({ message: 'Compromisso removido' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar ingestões
app.get('/api/agua', async (req, res) => {
  try {
    const registros = await IngestaoAgua.find().sort({ createdAt: -1 });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar registro de ingestão
app.post('/api/agua', async (req, res) => {
  try {
    const registro = new IngestaoAgua(req.body);
    await registro.save();
    res.status(201).json(registro);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar ingestão
app.put('/api/agua/:id', async (req, res) => {
  try {
    const registro = await IngestaoAgua.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!registro) return res.status(404).json({ message: 'Registro não encontrado' });
    res.json(registro);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar ingestão
app.delete('/api/agua/:id', async (req, res) => {
  try {
    await IngestaoAgua.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registro removido' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const medicamentosRouter = require('./routes/medicamentos');
app.use('/api/medicamentos', medicamentosRouter);

app.get('/api/pagamentoscorolla', async (req, res) => {
  try {
    const { ano } = req.query;
    const filtro = ano ? {
      data: {
        $gte: new Date(`${ano}-01-01T00:00:00Z`),
        $lte: new Date(`${ano}-12-31T23:59:59Z`)
      }
    } : {};

    const pagamentos = await PagamentoCorolla.find(filtro).sort({ data: -1 });
    res.json(pagamentos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/pagamentoscorolla', async (req, res) => {
  try {
    const novoPagamento = new PagamentoCorolla(req.body);
    await novoPagamento.save();
    res.status(201).json(novoPagamento);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/pagamentoscorolla/:id', async (req, res) => {
  try {
    const atualizado = await PagamentoCorolla.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ message: 'Pagamento não encontrado' });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/pagamentoscorolla/:id', async (req, res) => {
  try {
    await PagamentoCorolla.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pagamento removido' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const path = require('path');

// Serve os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../front-end/dist')));

// Rota fallback para o React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../front-end', 'dist', 'index.html'));
});


// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
