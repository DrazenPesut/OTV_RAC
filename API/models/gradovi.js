const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  Naziv: {
    type: String,
    required: true,
    trim: true     
  },
  Zemlja: {
    type: String,
    required: true,  
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
    min: 0  
  },
  Povrsina_grada_km2: {
    type: Number,
    required: true,
    min: 0  
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
    max: 100  
  },
  Nadmorska_visina_m: {
    type: Number,
    default: 0  
  },
  Rijeke: {
    type: [String], 
    default: []      
  }
});

const Cities = mongoose.model('City', citySchema, 'gradovi'); 

module.exports = Cities;
