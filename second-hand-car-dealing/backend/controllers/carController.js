const { Car, User } = require('../models');

const createCar = async (req, res) => {
  const { brand, model, year, imageURLs } = req.body;
  const userID = req.userID; // 从中间件中提取的userID

  try {
    const newCar = await Car.create({
      userID,
      brand,
      model,
      year,
      imageURLs
    });

    return res.status(201).json({ message: 'Car listed successfully', carID: newCar.carID });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getMyCars = async (req, res) => {
  const userID = req.userID;

  try {
    const cars = await Car.findAll({
      where: { userID },
      attributes: ['carID', 'brand', 'model', 'year', 'imageURLs']
    });

    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateCar = async (req, res) => {
  const { carID } = req.params;
  const { brand, model, year, imageURLs } = req.body;
  const userID = req.userID;

  try {
    const car = await Car.findOne({ where: { carID, userID } });

    if (!car) {
      return res.status(404).json({ message: 'Car not found or you do not have permission to edit this car' });
    }

    car.brand = brand;
    car.model = model;
    car.year = year;
    car.imageURLs = imageURLs;
    await car.save();

    return res.status(200).json({ message: 'Car updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deleteCar = async (req, res) => {
  const { carID } = req.params;
  const userID = req.userID;

  try {
    const car = await Car.findOne({ where: { carID, userID } });

    if (!car) {
      return res.status(404).json({ message: 'Car not found or you do not have permission to delete this car' });
    }

    await car.destroy();
    return res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getAllCars = async (req, res) => {
  try {
    // try to search all vehicle information, including poster info
    const cars = await Car.findAll({
      attributes: ['carID', 'brand', 'model', 'year', 'imageURLs', 'userID'],
      include: [{
        model: User,
        attributes: ['avatarURL'] // only include user avatar URL
      }]
    });

    const carsWithUserAvatar = cars.map(car => ({
      carID: car.carID,
      brand: car.brand,
      model: car.model,
      year: car.year,
      imageURLs: car.imageURLs,
      userID: car.userID,
      avatar: car.User ? car.User.avatarURL : null
    }));

    return res.status(200).json(carsWithUserAvatar);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createCar, getMyCars, updateCar, deleteCar, getAllCars };
