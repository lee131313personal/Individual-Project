const express = require('express');
const { createCar, getMyCars, updateCar, deleteCar, getAllCars } = require('../controllers/carController');
const router = express.Router();

router.post('/', createCar);

router.get('/me', getMyCars);

router.put('/:carID', updateCar);

router.delete('/:carID', deleteCar);

router.get('/', getAllCars);



module.exports = router;
