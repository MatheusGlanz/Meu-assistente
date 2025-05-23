const mongoose = require('mongoose');

const MedicamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  miligrama: { type: Number, required: true },
  observacao: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Medicamento', MedicamentoSchema);
