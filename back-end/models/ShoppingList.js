// models/ShoppingList.js

const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  nome: String,
  quantidade: Number,
  comprado: Boolean,
});

const ShoppingListSchema = new mongoose.Schema({
  userId: String, // você pode ignorar isso por enquanto
  categoria: String,
  itens: [ItemSchema],
});

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
