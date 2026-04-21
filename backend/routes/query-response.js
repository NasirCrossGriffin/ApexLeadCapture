const express = require('express');
const router = express.Router();
const QueryResponse = require('../models/query-response');

// CREATE
router.post('/', async (req, res) => {
  try {
    const doc = await QueryResponse.create(req.body);

    const populated = await QueryResponse.findById(doc._id).populate({
      path: 'realEstateQuery',
      populate: [{ path: 'user' }, { path: 'organization' }]
    });

    return res.status(201).json(populated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL
// Optional filter: ?realEstateQuery=<id>
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.realEstateQuery) {
      filter.realEstateQuery = req.query.realEstateQuery;
    }

    const docs = await QueryResponse.find(filter)
      .populate({
        path: 'realEstateQuery',
        populate: [{ path: 'user' }, { path: 'organization' }]
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await QueryResponse.findById(req.params.id).populate({
      path: 'realEstateQuery',
      populate: [{ path: 'user' }, { path: 'organization' }]
    });

    if (!doc) {
      return res.status(404).json({ error: 'QueryResponse not found' });
    }

    return res.status(200).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const doc = await QueryResponse.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'realEstateQuery',
      populate: [{ path: 'user' }, { path: 'organization' }]
    });

    if (!doc) {
      return res.status(404).json({ error: 'QueryResponse not found' });
    }

    return res.status(200).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await QueryResponse.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: 'QueryResponse not found' });
    }

    return res.status(200).json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;