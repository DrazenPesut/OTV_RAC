const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Cities = require('./models/gradovi');
const fs = require('fs');

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/glavni_gradovi', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:8000',
  clientID: 'omCA5hV0Nel7NntVMFeww5ph1MiX2guK',
  issuerBaseURL: 'https://dev-3l3dkvir3l37v28t.eu.auth0.com'
};

app.use(auth(config));

const { requiresAuthError } = require('./middleware/authorization');

app.get('/', (req, res) => {
  let logged_in = req.oidc.isAuthenticated();

  if (logged_in) {
    res.redirect('/user_home');
    console.log('user logged in');
  } else {
    console.log('user logged out');
    res.render('home');
  }
});

app.get('/user_home', requiresAuthError, (req, res) => {
  res.render('user_home');
});

app.get('/user_profile', requiresAuthError, (req, res) => {
  res.render("user_profile");
});

app.get('/getUserData', requiresAuthError, (req, res) => {
  res.json(req.oidc.user);
});

app.get('/getCitiesData', requiresAuthError, async (req, res) => {
  try {
    const cities = await Cities.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities and attractions' });
  }
});

const fetchDataFromDatabase = async() => {
  return Cities.find();
}

app.post('/updateFiles', requiresAuthError, async (req, res) => {
  try {
    const data = await fetchDataFromDatabase(); 

    const jsonData = JSON.stringify(data, null, 2);
    const csvData = data.map(item => Object.values(item).join(',')).join('\n');
    const csvHeader = Object.keys(data[0]).join(',');

    const publicFolderPath = path.join(__dirname, 'public');

    fs.writeFileSync(path.join(publicFolderPath, 'glavni_gradovi.json'), jsonData);
    fs.writeFileSync(path.join(publicFolderPath, 'glavni_gradovi.csv'), `${csvHeader}\n${csvData}`);

    res.status(200).send('Files updated successfully!');
  } catch (err) {
    res.status(500).send('Failed to update files');
  }
});

app.get('/api/download/json', (req, res) => {
  const jsonFilePath = path.join(__dirname, 'public', 'glavni_gradovi.json');
  res.sendFile(jsonFilePath);
});

app.get('/api/download/csv', (req, res) => {
  const csvFilePath = path.join(__dirname, 'public',  'glavni_gradovi.csv');
  res.sendFile(csvFilePath);
});

const home_userRouter = require('./routes/user_home.routes.js');

home_userRouter.use(requiresAuthError);

app.use('/user_home', home_userRouter);

app.get('/profile', requiresAuthError, (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

const PORT = 8000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
