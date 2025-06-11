// models/SavedGame.js

const mongoose = require('mongoose');

const savedGameSchema = new mongoose.Schema({
  code: String,
  name: String,
  winner: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedGame', savedGameSchema);
