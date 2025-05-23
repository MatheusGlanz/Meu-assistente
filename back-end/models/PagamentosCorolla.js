const mongoose = require('mongoose');

const PagamentosCorollaSchema = new mongoose.Schema({
  valor: { type: Number, required: true },
  data: { type: Date, required: true },
  status: { type: String, enum: ['Pago', 'Pendente'], default: 'Pendente' },
}, { timestamps: true });

module.exports = mongoose.model('PagamentosCorolla', PagamentosCorollaSchema);
