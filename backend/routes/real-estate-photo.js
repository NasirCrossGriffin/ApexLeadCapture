const express = require('express');
const router = express.Router();
const RealEstatePhoto = require('../models/real-estate-photo');


// CREATE
router.post('/', async (req, res) => {
  try {
    const doc = await RealEstatePhoto.create(req.body);
    const populated = await RealEstatePhoto.findById(doc._id).populate('realEstateQuery');
    return res.status(201).json(populated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL (optional filter: ?estimateQuery=<id>)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.realEstateQuery) filter.realEstateQuery = req.query.realEstateQuery;

    console.log(req.query.realEstateQuery);

    const docs = await RealEstatePhoto.find(filter).sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await RealEstatePhoto.findById(req.params.id).populate('realEstateQuery');
    if (!doc) return res.status(404).json({ error: 'RealEstatePhoto not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const doc = await RealEstatePhoto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('realEstateQuery');

    if (!doc) return res.status(404).json({ error: 'RealEstatePhoto not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await RealEstatePhoto.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'RealEstatePhoto not found' });
    return res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
