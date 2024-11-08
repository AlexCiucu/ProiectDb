
const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  painting: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
  // Add any other fields you need for the artwork
});

module.exports = mongoose.model('Artwork', artworkSchema);
