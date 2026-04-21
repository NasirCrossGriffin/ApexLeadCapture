const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// compound unique constraint
AdminSchema.index({ username: 1, bodyShop: 1 }, { unique: true });

module.exports = mongoose.model('Admin', AdminSchema);