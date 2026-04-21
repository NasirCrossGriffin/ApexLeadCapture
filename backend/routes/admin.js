const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
require('dotenv').config();

// CREATE
router.post('/register', async (req, res) => {
  if (req.body.key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const { username, password, organization } = req.body;

    if (!username || !password || !organization) {
      return res.status(400).json({ error: 'username, password, and organization are required' });
    }

    const existingAdmin = await Admin.findOne({
      username,
      organization
    });

    if (existingAdmin) {
      return res.status(409).json({ error: 'Admin already exists for this organization' });
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const newAdmin = await Admin.create({
      username,
      password: hash,
      organization
    });

    return res.status(201).json({
      _id: newAdmin._id,
      username: newAdmin.username,
      organization: newAdmin.organization
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// AUTHENTICATE
router.post('/authenticate', async (req, res) => {
  try {
    const { username, password, organization } = req.body;

    if (!username || !password || !organization) {
      return res.status(400).json({ error: 'username, password, and organization are required' });
    }

    const admin = await Admin.findOne({
      username,
      organization
    });

    if (!admin) {
      return res.status(401).json({ error: 'Incorrect credentials' });
    }

    if (admin.organization.toString() !== organization) {
      return res.status(401).json({ error: 'Incorrect credentials' });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ error: 'Incorrect credentials' });
    }

    // Set session
    req.session.adminId = admin._id.toString();
    req.session.username = admin.username;
    req.session.organization = admin.organization.toString();

    return res.status(200).json({
      _id: admin._id,
      username: admin.username,
      organization: admin.organization
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL (optional filters: ?organization=<id>)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.organization) filter.organization = req.query.organization;

    const docs = await Admin.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// SESSION CHECK
router.post('/check', async (req, res) => {
  try {
    const adminId = req.session.adminId;
    const organizationId = req.body.organizationId;

    if (!adminId) {
      return res.status(401).json({ error: 'Admin verification failed' });
    }

    const verifyAdmin = await Admin.findById(adminId);

    if (!verifyAdmin) {
      return res.status(401).json({ error: 'Admin verification failed' });
    }

    if (verifyAdmin.organization.toString() !== organizationId) {
      return res.status(401).json({ error: 'Admin verification failed' });
    }

    return res.status(200).json({ message: 'Admin verification passed' });
  } catch (err) {
    return res.status(500).json({ error: 'Admin verification failed' });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await Admin.findById(req.params.id).select('-password');

    if (!doc) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    return res.status(200).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.password;

    const doc = await Admin.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!doc) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    return res.status(200).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Admin.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    return res.status(200).json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;