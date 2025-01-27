const express = require('express');
const Cities = require('../models/gradovi');
const router = express.Router();

router.get('/cities', async (req, res) => {
  try {
    const cities = await Cities.find();

    if (!cities || cities.length === 0) {
      return res.status(404).json({
        status: "Not Found",
        message: "No cities found.",
        response: null
      });
    }

    res.status(200).json({
      status: "OK",
      message: "Fetched all cities successfully",
      response: {
        name: "Glavni gradovi",
        data: cities
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Internal Server Error",
      message: "An unexpected error occurred while fetching cities.",
      response: null
    });
  }
});

router.post('/cities', async (req, res) => {
  const {
    Naziv,
    Zemlja,
    Gradonacelnik,
    Broj_stanovnika_grada,
    Povrsina_grada_km2,
    Vremenska_zona,
    Indeks_sigurnosti,
    Nadmorska_visina_m,
    Rijeke
  } = req.body;

  try {
    const newCity = new Cities({
      Naziv,
      Zemlja,
      Gradonacelnik,
      Broj_stanovnika_grada,
      Povrsina_grada_km2,
      Vremenska_zona,
      Indeks_sigurnosti,
      Nadmorska_visina_m,
      Rijeke
    });

    await newCity.save();
    const cities = await Cities.find();

    return res.status(200).json({
      status: 'OK',
      message: 'City added successfully.',
      response: cities
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'Internal Server Error',
      message: 'An error occurred while saving the city.',
      response: null
    });
  }
});

router.put('/cities/:id', async (req, res) => {
  try {
    const cityIndex = parseInt(req.params.id);

    if (isNaN(cityIndex) || cityIndex < 0) {
      return res.status(400).json({
        status: 'Bad Request',
        message: 'Invalid city index. Index must be a valid number and a non-negative integer.',
        response: null
      });
    }

    const {
      Naziv,
      Zemlja,
      Gradonacelnik,
      Broj_stanovnika_grada,
      Povrsina_grada_km2,
      Vremenska_zona,
      Indeks_sigurnosti,
      Nadmorska_visina_m,
      Rijeke
    } = req.body;

    const cities = await Cities.find();

    if (cityIndex >= cities.length || cityIndex < 0) {
      return res.status(404).json({
        status: 'Not Found',
        message: `City with index ${cityIndex} not found.`,
        response: null
      });
    }

    const city = cities[cityIndex];

    city.Naziv = Naziv;
    city.Zemlja = Zemlja;
    city.Gradonacelnik = Gradonacelnik;
    city.Broj_stanovnika_grada = Broj_stanovnika_grada;
    city.Povrsina_grada_km2 = Povrsina_grada_km2;
    city.Vremenska_zona = Vremenska_zona;
    city.Indeks_sigurnosti = Indeks_sigurnosti;
    city.Nadmorska_visina_m = Nadmorska_visina_m;
    city.Rijeke = Rijeke;

    await city.save();
    const new_cities = await Cities.find();

    return res.status(200).json({
      status: 'OK',
      message: 'City updated successfully.',
      response: {
        name: city.Naziv,
        data: new_cities
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Internal Server Error',
      message: 'An error occurred while updating the city.',
      response: null
    });
  }
});

router.delete('/cities/:id', async (req, res) => {
  try {
    const cityIndex = parseInt(req.params.id);

    const cities = await Cities.find();

    if (isNaN(cityIndex) || cityIndex < 0 || cityIndex >= cities.length) {
      return res.status(404).json({
        status: 'Not Found',
        message: `City with index ${cityIndex} does not exist.`,
        response: null
      });
    }

    cities.splice(cityIndex, 1);

    await Cities.deleteMany({});
    await Cities.insertMany(cities);

    const new_cities = await Cities.find();

    return res.status(200).json({
      status: 'OK',
      message: 'City deleted successfully.',
      response: new_cities
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Internal Server Error',
      message: 'An error occurred while deleting the city.',
      response: null
    });
  }
});

module.exports = router;
