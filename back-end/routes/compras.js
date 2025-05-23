const express = require('express');
const router = express.Router();
const Compra = require('../routes/compras');

// GET: listar todos
router.get('/', async (req, res) => {
  const itens = await Compra.find();
  res.json(itens);
});

// POST: adicionar
router.post('/', async (req, res) => {
  const novo = new Compra(req.body);
  await novo.save();
  res.status(201).json(novo);
});

// PUT: alternar comprado
router.put('/:id', async (req, res) => {
  const item = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

// DELETE: remover
router.delete('/:id', async (req, res) => {
  await Compra.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
