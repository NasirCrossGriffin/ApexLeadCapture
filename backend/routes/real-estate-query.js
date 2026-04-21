const express = require('express');
const router = express.Router();
const RealEstateQuery = require('../models/real-estate-query');

// CREATE
router.post('/', async (req, res) => {
  try {
    const doc = await RealEstateQuery.create(req.body);

    const populated = await RealEstateQuery.findById(doc._id)
      .populate('organization')
      .populate('user');

    return res.status(201).json(populated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL
// Optional filters:
// ?organization=<id>
// ?user=<id>
// ?service=buy
// ?facingForeclosure=true
// ?city=Philadelphia
// ?state=PA
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.organization) filter.organization = req.query.organization;
    if (req.query.user) filter.user = req.query.user;
    if (req.query.service) filter.service = req.query.service;
    if (req.query.city) filter.city = req.query.city;
    if (req.query.state) filter.state = req.query.state;

    if (req.query.facingForeclosure !== undefined) {
      filter.facingForeclosure = req.query.facingForeclosure === 'true';
    }

    const docs = await RealEstateQuery.find(filter)
      .populate('organization')
      .populate('user')
      .sort({ createdAt: -1 });

    return res.status(200).json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ ALL BY ORGANIZATION
router.get('/organization/:organizationId', async (req, res) => {
  try {
    const docs = await RealEstateQuery.find({
      organization: req.params.organizationId,
    })
      .populate('organization')
      .populate('user')
      .sort({ createdAt: -1 });

    return res.status(200).json(docs);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL BY USER
router.get('/user/:userId', async (req, res) => {
  try {
    const docs = await RealEstateQuery.find({
      user: req.params.userId,
    })
      .populate('organization')
      .populate('user')
      .sort({ createdAt: -1 });

    return res.status(200).json(docs);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await RealEstateQuery.findById(req.params.id)
      .populate('organization')
      .populate('user');

    if (!doc) {
      return res.status(404).json({ error: 'RealEstateQuery not found' });
    }

    return res.status(200).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const doc = await RealEstateQuery.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('organization')
      .populate('user');

    if (!doc) {
      return res.status(404).json({ error: 'RealEstateQuery not found' });
    }

    return res.status(200).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await RealEstateQuery.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: 'RealEstateQuery not found' });
    }

    return res.status(200).json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;