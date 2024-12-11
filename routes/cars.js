import express from "express";
import Car from "../model/Car.js";
import authenticate from "../utils/auth.js";
const router = express.Router();



/**
 * @api {get} /cars Get all cars
 * @apiName GetAllCars
 * @apiGroup Car
 *
 * @apiSuccess {Object[]} cars List of cars
 * @apiSuccess {String} cars.id Unique identifier of the car
 * @apiSuccess {String} cars.model Model of the car
 * @apiSuccess {Number} cars.height Height of the car in cm
 * @apiSuccess {String} cars.license_plate License plate number of the car
 * @apiSuccess {Date} cars.creationDate Date when the car was created
 *
 * @apiError {String} message Error message
 */

// Get all cars - ok
router.get("/", async (req, res, next) => {
  try {
    const cars = await Car.find();
    res.status(200).send(cars);
  } catch (err) {
    next(err);
  }
});



/**
 * @api {get} /cars/:id Get car by ID
 * @apiName GetCarById
 * @apiGroup Car
 *
 * @apiParam {String} id Unique identifier of the car
 *
 * @apiSuccess {String} id Unique identifier of the car
 * @apiSuccess {String} model Model of the car
 * @apiSuccess {Number} height Height of the car in cm
 * @apiSuccess {String} license_plate License plate number of the car
 * @apiSuccess {Date} creationDate Date when the car was created
 *
 * @apiError {String} message Error message
 */

// Get car by ID - ok
router.get("/:id", async (req, res, next) => {
  try {
    const car = await Car.findOne({ _id: req.params.id });
    if (!car) {
      return res.status(404).send({ message: 'Car not found' });
    }
    res.status(200).send(car);
  } catch (err) {
    next(err);
  }
});


// Create a new car - ok
router.post('/create', authenticate, async (req, res, next) => {
  try {
    console.log('Données reçues pour la création de la voiture:', req.body);
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).send(savedCar);
  } catch (err) {
    console.error('Erreur lors de la création de la voiture:', err.message);
    res.status(400).send(err.message);
  }
});


/**
 * @api {put} /cars/:id Update a car by ID
 * @apiName UpdateCar
 * @apiGroup Car
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {String} id Unique identifier of the car
 *
 * @apiBody {String} [model] Model of the car (3-30 characters)
 * @apiBody {Number} [height] Height of the car in cm (2-3 digits)
 * @apiBody {String} [license_plate] License plate number of the car (1-9 characters)
 *
 * @apiSuccess {String} id Unique identifier of the car
 * @apiSuccess {String} model Updated model of the car
 * @apiSuccess {Number} height Updated height of the car
 * @apiSuccess {String} license_plate Updated license plate number of the car
 * @apiSuccess {Date} creationDate Date when the car was created
 *
 * @apiError {String} message Error message
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "message": "Car not found"
 *   }
 */

// Update a car by ID - ok

router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) {
      return res.status(404).send({ message: 'Car not found' });
    }
    res.status(200).send(updatedCar);
  } catch (err) {
    next(err);
  }
});

// Delete a car by ID - ok
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const removedCar = await Car.findByIdAndDelete(req.params.id);
    if (!removedCar) {
      return res.status(404).send({ message: 'Car not found' });
    }
    res.status(200).send(removedCar);
  } catch (err) {
    next(err);
  }
});

export default router;
