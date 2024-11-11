// const router = express.Router();

// router.get("/", function (req, res, next) {
//     res.send("Bienvenue sur la route de cars!");
// });

// export default router;

import express from 'express';
import { Car } from '../model/Car.js';
import authenticate from '../utils/auth.js';
const router = express.Router();

// Get all cars
router.get('/', function (req, res, next) {
    Car.find().exec(function (err, cars) {
        if (err) {
            return next(err);
        }
        res.status(200).send(cars);
    });
});

// Get car by ID
router.get('/:id', function (req, res, next) {
    Car.findOne({ _id: req.params.id }).exec(function (err, car) {
        if (err) {
            return next(err);
        }
        res.status(200).send(car);
    });
});

// Create a new car
router.post('/', authenticate, function (req, res, next) {
    const newCar = new Car(req.body);
    newCar.save(function (err, savedCar) {
        if (err) {
            return next(err);
        }
        res.status(201).send(savedCar);
    });
});

// Update a car by ID
router.put('/:id', authenticate, function (req, res, next) {
    Car.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function (err, updatedCar) {
        if (err) {
            return next(err);
        }
        res.status(200).send(updatedCar);
    });
});

// Delete a car by ID
router.delete('/:id', authenticate, function (req, res, next) {
    Car.findByIdAndRemove(req.params.id).exec(function (err, removedCar) {
        if (err) {
            return next(err);
        }
        res.status(200).send(removedCar);
    });
});

export default router;