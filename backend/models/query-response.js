const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema(
  {
    realEstateQuery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RealEstateQuery',
      required: true,
      index: true
    },

    response: {
      type: String,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('QueryResponse', ResponseSchema);
