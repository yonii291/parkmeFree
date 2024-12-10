// import express from "express";

// const router = express.Router();

// router.get("/", function (req, res, next) {
//     res.send("Bienvenue sur la route de parkings!");
// });

// export default router;

import express from 'express';
import { Park } from '../model/Park.js';
import authenticate from '../utils/auth.js';
const router = express.Router();

// Get all parks
router.get('/', function (req, res, next) {
  Park.find().exec(function (err, parks) {
    if (err) {
      return next(err);
    }
    res.status(200).send(parks);
  });
});

// Get park by ID
router.get('/:id', function (req, res, next) {
  Park.findOne({ _id: req.params.id }).exec(function (err, park) {
    if (err) {
      return next(err);
    }
    res.status(200).send(park);
  });
});

// Create a new park
router.post('/', authenticate, async (req, res) => {
  try {
    const newPark = new Park(req.body);
    await newPark.save()
    res.status(201).send({ newPark });
  } catch (error) {
    res.status(401).send(error.message)
  }
});

// Update a park by ID
router.put('/:id', authenticate, function (req, res, next) {
  Park.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function (err, updatedPark) {
    if (err) {
      return next(err);
    }
    res.status(200).send(updatedPark);
  });
});

// Delete a park by ID
router.delete('/:id', authenticate, function (req, res, next) {
  Park.findByIdAndRemove(req.params.id).exec(function (err, removedPark) {
    if (err) {
      return next(err);
    }
    res.status(200).send(removedPark);
  });
});

export default router;
