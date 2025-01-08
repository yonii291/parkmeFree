import express from "express";
import Car from "../model/Car.js";
import authenticate from "../utils/auth.js";
const router = express.Router();

/**
 * @api {get} /cars Get all cars
 * @apiName GetCars
 * @apiGroup Car
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a list of all cars.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the car.
 * @apiSuccess {String} model Model name of the car.
 * @apiSuccess {Number} height Height of the car in cm.
 * @apiSuccess {String} license_plate License plate number of the car.
 * @apiSuccess {Date} creationDate Date when the car was added.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": "60c72b2f9af1b8b9b0f9a1b5",
 *         "model": "Tesla Model 3",
 *         "height": 144,
 *         "license_plate": "ABC1234",
 *         "creationDate": "2024-01-02T10:00:00.000Z"
 *       }
 *     ]
 *
 * @apiError (500) InternalServerError An error occurred while fetching cars.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "An error occurred while fetching cars."
 *     }
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
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a specific car by its ID.
 *
 * @apiParam {String} id Car's unique ID.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the car.
 * @apiSuccess {String} model Model name of the car.
 * @apiSuccess {Number} height Height of the car in cm.
 * @apiSuccess {String} license_plate License plate number of the car.
 * @apiSuccess {Date} creationDate Date when the car was added.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "model": "Tesla Model 3",
 *       "height": 144,
 *       "license_plate": "ABC1234",
 *       "creationDate": "2024-01-02T10:00:00.000Z"
 *     }
 *
 * @apiError (404) NotFound Car not found.
 * @apiError (500) InternalServerError An error occurred while fetching the car.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Car not found"
 *     }
 *
 * @apiErrorExample {json} Error-Response (500):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "An error occurred while fetching the car."
 *     }
 */

// Get car by ID - ok
router.get("/:id", async (req, res, next) => {
  try {
    const car = await Car.findOne({ _id: req.params.id });
    if (!car) {
      return res.status(404).send({ message: "Car not found" });
    }
    res.status(200).send(car);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /cars/create Create a new car
 * @apiName CreateCar
 * @apiGroup Car
 * @apiVersion 1.0.0
 * @apiDescription Create a new car and save it to the database.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiBody {String} model Model name of the car (required, min length 3, max length 30).
 * @apiBody {Number} height Height of the car in cm (required, min 0).
 * @apiBody {String} license_plate License plate number (required, unique, min length 1, max length 9).
 *
 * @apiSuccess {ObjectId} id Unique identifier for the car.
 * @apiSuccess {String} model Model name of the car.
 * @apiSuccess {Number} height Height of the car in cm.
 * @apiSuccess {String} license_plate License plate number of the car.
 * @apiSuccess {Date} creationDate Date when the car was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "model": "Tesla Model Y",
 *       "height": 165,
 *       "license_plate": "XYZ7890",
 *       "creationDate": "2024-01-02T11:00:00.000Z"
 *     }
 *
 * @apiError (400) BadRequest Validation error or missing fields.
 *
 * @apiErrorExample {json} Error-Response (400):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Validation failed: You must provide a license plate number!"
 *     }
 */

// Create a new car - ok
router.post("/create", authenticate, async (req, res, next) => {
  try {
    console.log("Données reçues pour la création de la voiture:", req.body);
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).send(savedCar);
  } catch (err) {
    console.error("Erreur lors de la création de la voiture:", err.message);
    res.status(400).send(err.message);
  }
});

/**
 * @api {put} /cars/:id Update car by ID
 * @apiName UpdateCar
 * @apiGroup Car
 * @apiVersion 1.0.0
 * @apiDescription Update an existing car by its ID.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiParam {String} id Car's unique ID.
 *
 * @apiBody {String} [model] Updated model name of the car (min length 3, max length 30).
 * @apiBody {Number} [height] Updated height of the car in cm (min 0).
 * @apiBody {String} [license_plate] Updated license plate number (unique, min length 1, max length 9).
 *
 * @apiSuccess {ObjectId} id Unique identifier for the car.
 * @apiSuccess {String} model Updated model name of the car.
 * @apiSuccess {Number} height Updated height of the car in cm.
 * @apiSuccess {String} license_plate Updated license plate number of the car.
 * @apiSuccess {Date} creationDate Date when the car was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "model": "Tesla Model S",
 *       "height": 145,
 *       "license_plate": "DEF4567",
 *       "creationDate": "2024-01-02T12:00:00.000Z"
 *     }
 *
 * @apiError (404) NotFound Car not found.
 */

// Update a car by ID - ok

router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCar) {
      return res.status(404).send({ message: "Car not found" });
    }
    res.status(200).send(updatedCar);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {delete} /cars/:id Delete car by ID
 * @apiName DeleteCar
 * @apiGroup Car
 * @apiVersion 1.0.0
 * @apiDescription Delete a specific car by its ID.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiParam {String} id Car's unique ID.
 *
 * @apiSuccess {ObjectId} id Unique identifier of the deleted car.
 * @apiSuccess {String} model Model name of the deleted car.
 * @apiSuccess {Number} height Height of the deleted car.
 * @apiSuccess {String} license_plate License plate of the deleted car.
 * @apiSuccess {Date} creationDate Date when the car was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "model": "Tesla Model 3",
 *       "height": 144,
 *       "license_plate": "ABC1234",
 *       "creationDate": "2024-01-02T10:00:00.000Z"
 *     }
 *
 * @apiError (404) NotFound Car not found.
 */

// Delete a car by ID - ok
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const removedCar = await Car.findByIdAndDelete(req.params.id);
    if (!removedCar) {
      return res.status(404).send({ message: "Car not found" });
    }
    res.status(200).send(removedCar);
  } catch (err) {
    next(err);
  }
});

export default router;
