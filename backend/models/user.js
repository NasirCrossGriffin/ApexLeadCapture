const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BodyShop',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);
