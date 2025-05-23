const express = require('express');
const router = express.Router();
const Conta = require('../models/conta');
// GET todas
router.get('/', async (req, res) => {
  const contas = await Conta.find();
  res.json(contas);
});

// POST nova conta
router.post('/', async (req, res) => {
  const nova = new Conta(req.body);
  const salva = await nova.save();
  res.json(salva);
});

// PATCH pagamento
router.patch('/:id/pagar', async (req, res) => {
  const conta = await Conta.findByIdAndUpdate(req.params.id, { pago: req.body.pago }, { new: true });
  res.json(conta);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Conta.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
