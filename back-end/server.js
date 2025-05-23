const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // necessário para resolver caminhos de arquivos
const comprasRoutes = require('./routes/compras');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://glanzmatheus:Z3rhVfzBfLheHrcc@cluster0.zhhzmoh.mongodb.net/assistente?retryWrites=true&w=majority');

// Rotas da API
app.use('/api/compras', comprasRoutes);

// Servir arquivos estáticos do frontend (dist do Vite)
app.use(express.static(path.join(__dirname, 'dist')));

// Redirecionar qualquer rota desconhecida para o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Servidor rodando na porta', PORT));
