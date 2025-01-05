const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,  
    trim: true
  },
  City: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'City',  
    required: true  
  },
  Opis: {
    type: String,
    required: true,  
    trim: true
  },
  Godina_osnivanja: {
    type: Number, 
    min: 0  
  },
  Kategorija: {
    type: String,
    enum: ['Prirodna', 'Kulturna', 'Povijesna', 'Zabavna'],  
    required: true
  }
});

const Attractions = mongoose.model('Attraction', attractionSchema, 'znamenitosti'); 

module.exports = Attractions;
