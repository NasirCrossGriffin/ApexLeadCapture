const express = require('express');
const router = express.Router();
const User = require('../models/user');

// CREATE
// CREATE
router.post('/', async (req, res) => {
  try {
    const doc = await User.create(req.body);
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL (optional filters: ?bodyShop=<id>)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.bodyShop) filter.bodyShop = req.query.bodyShop;

    const docs = await User.find(filter).sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await User.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'User not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) return res.status(404).json({ error: 'User not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'User not found' });
    return res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
