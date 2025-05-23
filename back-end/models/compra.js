const mongoose = require('mongoose');

const CompraSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  categoria: { type: String, default: 'Sem categoria' },
  quantidade: { type: Number, default: 1 },
  comprado: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Compra', CompraSchema);
