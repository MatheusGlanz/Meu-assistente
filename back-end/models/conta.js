const mongoose = require('mongoose');

const ContaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  categoria: { type: String, default: 'Outros' },
  valor: { type: Number, required: true },
  pago: { type: Boolean, default: false },
  vencimento: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Conta', ContaSchema);
