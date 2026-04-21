const mongoose = require('mongoose');

const RealEstatePhotoSchema = new mongoose.Schema(
  {
    realEstateQuery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RealEstateQuery',
      required: true,
      index: true
    },

    url: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RealEstatePhoto', RealEstatePhotoSchema);
