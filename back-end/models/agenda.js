// models/Agenda.js
const mongoose = require('mongoose');

const AgendaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  data: { type: String, required: true },  // formato 'YYYY-MM-DD'
  hora: { type: String, required: true },  // formato 'HH:mm'
  observacao: { type: String, default: '' },
  status: { type: String, enum: ['pendente', 'executado'], default: 'pendente' },
}, { timestamps: true });

module.exports = mongoose.model('Agenda', AgendaSchema);
