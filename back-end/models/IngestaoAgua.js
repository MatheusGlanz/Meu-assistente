const mongoose = require('mongoose');

const IngestaoAguaSchema = new mongoose.Schema({
  quantidade: { type: Number, required: true }, // em ml
  horario: { type: String, required: true },    // formato HH:mm
  data: { type: String, required: true },       // formato YYYY-MM-DD
}, { timestamps: true });

module.exports = mongoose.model('IngestaoAgua', IngestaoAguaSchema);
