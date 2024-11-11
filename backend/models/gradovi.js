const mongoose = require('mongoose');

// Define the schema for the cities (gradovi)
const citySchema = new mongoose.Schema({
  Naziv: {
    type: String,
    required: true,  // The city must have a name
    trim: true       // Removes any leading or trailing spaces
  },
  Zemlja: {
    type: String,
    required: true,  // The country must be specified
    trim: true
  },
  Gradonacelnik: {
    type: String,
    required: true,
    trim: true
  },
  Broj_stanovnika_grada: {
    type: Number,
    required: true,
    min: 0  // Population cannot be negative
  },
  Povrsina_grada_km2: {
    type: Number,
    required: true,
    min: 0  // Area cannot be negative
  },
  Vremenska_zona: {
    type: String,
    required: true,
    trim: true
  },
  Indeks_sigurnosti: {
    type: Number,
    required: true,
    min: 0,
    max: 10  // Security index can range from 0 to 10
  },
  Nadmorska_visina_m: {
    type: Number,
    default: 0  // Default value if not provided
  },
  Rijeke: {
    type: [String],  // Array of rivers
    default: []      // Default empty array if no rivers are provided
  }
});

// Create the model for 'gradovi' collection
const City = mongoose.model('City', citySchema, 'gradovi');  // Explicitly specify 'gradovi' as the collection name

module.exports = City;
