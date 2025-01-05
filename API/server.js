const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/glavni_gradovi', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.use(express.json())

const homeRouter = require('./routes/home.routes');
app.use('/', homeRouter);

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index')
})



app.listen(8000)