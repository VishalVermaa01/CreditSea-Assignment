// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Use dotenv

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully.'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Define Routes
app.use('/api/upload', require('./routes/upload'));

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));