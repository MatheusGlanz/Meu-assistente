const express = require('express');
const router = express.Router();
const Medicamento = require('../models/Medicamento');

// Listar todos os medicamentos
router.get('/', async (req, res) => {
  try {
    const meds = await Medicamento.find().sort({ createdAt: -1 });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar novo medicamento
router.post('/', async (req, res) => {
  try {
    const medicamento = new Medicamento(req.body);
    await medicamento.save();
    res.status(201).json(medicamento);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar medicamento pelo ID
router.put('/:id', async (req, res) => {
  try {
    const medicamento = await Medicamento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicamento) return res.status(404).json({ message: 'Medicamento não encontrado' });
    res.json(medicamento);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar medicamento pelo ID
router.delete('/:id', async (req, res) => {
  try {
    await Medicamento.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicamento removido' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
