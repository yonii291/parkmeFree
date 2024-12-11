// const router = express.Router();

// router.get("/", function (req, res, next) {
//     res.send("Bienvenue sur la route de cars!");
// });

// export default router;

import express from "express";
import  Car  from "../model/Car.js";
import authenticate from "../utils/auth.js";
const router = express.Router();

// Get all cars

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
router.get("/", function (req, res, next) {
  Car.find().exec(function (err, cars) {
    if (err) {
      return next(err);
    }
    res.status(200).send(cars);
  });
});

// Get car by ID

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

router.get("/:id", function (req, res, next) {
  Car.findOne({ _id: req.params.id }).exec(function (err, car) {
    if (err) {
      return next(err);
    }
    res.status(200).send(car);
  });
});

// Create a new car
// router.post('/create', authenticate, function (req, res, next) {
//     const newCar = new Car(req.body);
//     newCar.save(function (err, savedCar) {
//         if (err) {
//             return next(err);
//         }
//         res.status(201).send(savedCar);
//     });
// });
// Route pour créer une nouvelle voiture
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

// Update a car by ID

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

router.put("/:id", authenticate, function (req, res, next) {
  Car.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function (
    err,
    updatedCar
  ) {
    if (err) {
      return next(err);
    }
    res.status(200).send(updatedCar);
  });
});

// Delete a car by ID
router.delete("/:id", authenticate, function (req, res, next) {
  Car.findByIdAndRemove(req.params.id).exec(function (err, removedCar) {
    if (err) {
      return next(err);
    }
    res.status(200).send(removedCar);
  });
});

export default router;
