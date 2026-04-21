const express = require('express');
const router = express.Router();
const Organization = require('../models/organization');

// CREATE
router.post('/', async (req, res) => {
  try {
    const doc = await Organization.create(req.body);
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const docs = await Organization.find().sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ BY NAME
router.get('/name/:name', async (req, res) => {
  try {
    const name = req.params.name;

    console.log(name);

    const doc = await Organization.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') } // case-insensitive exact match
    });

    if (!doc) return res.status(404).json({ error: 'Organization not found' });

    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await Organization.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Organization not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const doc = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) return res.status(404).json({ error: 'Organization not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Organization.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Organization not found' });
    return res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
