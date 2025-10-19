
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const seedDatabase = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Allow server to accept JSON in request body

// --- MongoDB Connection ---
// IMPORTANT: Replace this with your own MongoDB connection string!
const MONGO_URI = 'mongodb://localhost:27017/railpassDB'; 

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    // Optional: Seed the database with initial data if it's empty
    seedDatabase();
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// --- API Routes ---
app.use('/api', apiRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
