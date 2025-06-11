const express = require('express');
const mongoose = require('mongoose');
const SavedGame = require('./models/SavedGame');

const app = express();
app.use(express.json());

// ✅ Optional: Allow cross-origin requests (for front-end testing)
const cors = require('cors');
app.use(cors());

// ✅ MongoDB connection
mongoose.connect('mongodb://localhost:27017/gamesdb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Save game endpoint
app.post('/save-game', async (req, res) => {
  const { code, name, winner } = req.body;
  try {
    const game = new SavedGame({ code, name, winner });
    await game.save();
    res.json({ message: 'Saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start the server
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
s