const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/glavni_gradovi', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Import models
const City = require('./models/gradovi');  // City model for 'gradovi' collection
const Attraction = require('./models/znamenitosti');  // Attraction model for 'znamenitosti' collection

// Set up EJS view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Define routes

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Form route (for handling data tables, etc.)
app.get('/form', (req, res) => {
  res.render('datatable');
});

app.get('/cities', async (req, res) => {
  try {
    
    const cities = await City.find();
    const attractions = await Attraction.find();

    const cities_attractions = [cities, attractions]
    res.json(cities_attractions);
  } catch (error) {
    console.error('Error fetching cities and attractions:', error);
    res.status(500).json({ error: 'Error fetching data from the database' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
