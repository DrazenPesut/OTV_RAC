const mongoose = require('mongoose');

// Define the schema for attractions (znamenitosti)
const attractionSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,  // Attraction must have a name
    trim: true
  },
  City: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the 'gradovi' collection
    ref: 'City',  // Referencing the City model
    required: true  // Every attraction must be associated with a city
  },
  Opis: {
    type: String,
    required: true,  // Description of the attraction must be provided
    trim: true
  },
  Godina_osnivanja: {
    type: Number,  // Year the attraction was founded (if applicable)
    min: 0  // Year cannot be negative
  },
  Kategorija: {
    type: String,
    enum: ['Prirodna', 'Kulturna', 'Povijesna', 'Zabavna'],  // Categories of attractions
    required: true
  }
});

// Create the model for 'znamenitosti' collection
const Attraction = mongoose.model('Attraction', attractionSchema, 'znamenitosti');  // Explicitly specify 'znamenitosti' as the collection name

module.exports = Attraction;
