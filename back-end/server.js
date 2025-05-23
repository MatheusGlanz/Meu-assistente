const express = require('express');
const mongoose = require('mongoose');
const comprasRoutes = require('./routes/compras');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://glanzmatheus:Z3rhVfzBfLheHrcc@cluster0.zhhzmoh.mongodb.net/assistente?retryWrites=true&w=majority');

app.use('/api/compras', comprasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Servidor rodando na porta', PORT));
