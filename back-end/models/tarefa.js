const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  observacao: { type: String, default: '' },
  data: { type: String }, // formato: YYYY-MM-DD
  hora: { type: String }, // formato: HH:mm
  status: { type: String, enum: ['Pendente', 'Executada'], default: 'Pendente' },
  concluida: { type: Boolean, default: false }, // opcional: manter compatibilidade visual
}, { timestamps: true });

module.exports = mongoose.model('Tarefa', TarefaSchema);
