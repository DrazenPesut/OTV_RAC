const express = require('express');
const Cities = require('../models/gradovi');
const Attractions = require('../models/znamenitosti')
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


router.get('/attractions', async (req, res) => {
  try {
      const attractions = await Attractions.find();

      if (!attractions || attractions.length === 0) {
          return res.status(404).json({
              status: "Not Found",
              message: "No attractions found.",
              response: null
          });
      }

      res.status(200).json({
          status: "OK",
          message: "Fetched all attractions successfully",
          response: {
              name: "Znamenitosti",
              data: attractions
          }
      });
  } catch (error) {
      console.error(error); 
      res.status(500).json({
          status: "Internal Server Error",
          message: "An unexpected error occurred while fetching attractions.",
          response: null
      });
  }
});





router.get('/cities/:id', async (req, res) => {
  try {
    const cityID = parseInt(req.params.id);

    if (isNaN(cityID) || cityID < 0) {
      return res.status(400).json({
        status: 'Bad Request',
        message: 'Invalid city ID. ID must be a valid number and a non-negative integer.',
        response: null
      });
    }

    const cities = await Cities.find();

    if (cityID >= cities.length) {
      return res.status(404).json({
        status: 'Not Found',
        message: `City with the provided ID (${cityID}) doesn't exist.`,
        response: null
      });
    }

    const city = cities[cityID];
    const cityName = city.Naziv;

    return res.status(200).json({
      status: 'OK',
      message: 'Fetched city object successfully',
      response: {
        name: cityName,
        data: city
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 'Internal Server Error',
      message: 'An unexpected error occurred while fetching the city.',
      response: null
    });
  }
});



router.post('/cities/add', async (req, res) => {
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

  if (!Naziv || !Zemlja || !Gradonacelnik || !Broj_stanovnika_grada || !Povrsina_grada_km2 || !Vremenska_zona || !Indeks_sigurnosti || !Nadmorska_visina_m) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'All fields are required.',
      response: null
    });
  }

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
    console.log(error)
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

    if (!Naziv || !Zemlja || !Gradonacelnik || !Broj_stanovnika_grada || !Povrsina_grada_km2 || !Vremenska_zona || !Indeks_sigurnosti || !Nadmorska_visina_m) {
      return res.status(400).json({
        status: 'Bad Request',
        message: 'All city fields are required.',
        response: null
      });
    }

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



router.get('/cities/population/:population', async (req, res) => {
  try {
    const minPopulation = parseInt(req.params.population);

    if (isNaN(minPopulation) || minPopulation < 0) {
      return res.status(400).json({
        status: 'Bad Request',
        message: 'Population must be a valid positive number.',
        response: null
      });
    }

    const filtered_cities = await Cities.find({
      Broj_stanovnika_grada: { $gt: minPopulation }
    });

    if (filtered_cities.length === 0) {
      return res.status(404).json({
        status: 'Not Found',
        message: `No cities found with population greater than or equal to ${minPopulation}.`,
        response: null
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: `Cities with population greater than or equal to ${minPopulation} fetched successfully.`,
      response: {
        data: filtered_cities
      }
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Internal Server Error',
      message: 'An error occurred while fetching cities.',
      response: null
    });
  }
});



router.get('/cities/min_safety/:index', async (req, res) => {
  try {
    const minSafetyIndex = parseInt(req.params.index);

    if (isNaN(minSafetyIndex) || minSafetyIndex < 0 || minSafetyIndex > 100) {
      return res.status(400).json({
        status: 'Bad Request',
        message: 'Safety index must be a valid positive number between (and including) 0 and 100.',
        response: null
      });
    }

    const fetched_cities = await Cities.find({
      Indeks_sigurnosti: { $gt: minSafetyIndex } 
    });

    if (fetched_cities.length === 0) {
      return res.status(404).json({
        status: 'Not Found',
        message: `No cities found with a safety index greater than ${minSafetyIndex}.`,
        response: null
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: `Cities with a safety index greater than ${minSafetyIndex} fetched successfully.`,
      response: {
        data: fetched_cities
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Internal Server Error',
      message: 'An error occurred while fetching cities.',
      response: null
    });
  }
});



router.get('/cities/:name/attractions', async (req, res) => {
  try {
    const cityName = req.params.name; 
    const city = await Cities.findOne({ Naziv: cityName });
    const city_id = city._id

    if (!city) {
      return res.status(404).json({
        status: 'Not Found',
        message: `City with name "${cityName}" does not exist.`,
        response: null
      });
    }

    const attractions = await Attractions.find({ Grad_id: city_id });

    if (attractions.length === 0) {
      return res.status(404).json({
        status: 'Not Found',
        message: `No attractions found for city "${cityName}".`,
        response: null
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: `Fetched attractions for city "${cityName}" successfully.`,
      response: {
        city: cityName,
        attractions: attractions
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Internal Server Error',
      message: 'An error occurred while fetching the attractions.',
      response: null
    });
  }
});



router.all('/cities/:id', (req, res) => {
  res.status(501).json({
    status: 'Not Implemented',
    message: `The ${req.method} method is not implemented for the /cities/${req.params.id} resource.`,
    response: null
})
}
);

router.all('*', (req, res) => {
  res.status(404).json({
    status: 'Not Found',
    message: `The requested endpoint ${req.originalUrl} does not exist.`,
    response: null
  });
});



module.exports = router