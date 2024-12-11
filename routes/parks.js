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

// Get all parks - ok
router.get('/', async function (req, res, next) {
  try {
    const parkings = await Park.find().exec(); // Utilisation de await sans callback
    res.status(200).send(parkings);
  } catch (err) {
    next(err); // Gestion de l'erreur avec try/catch
  }
});

// Get park by ID - ok
router.get('/:id', async (req, res, next) => {
  try {
    const park = await Park.findOne({ _id: req.params.id });
    if (!park) {
      return res.status(404).send({ message: 'Park not found' });
    }
    res.status(200).send(park);
  } catch (err) {
    next(err);
  }
});

// Create a new park - ok
router.post('/', authenticate, async (req, res) => {
  try {
    const newPark = new Park(req.body);
    await newPark.save()
    res.status(201).send({ newPark });
  } catch (error) {
    res.status(401).send(error.message)
  }
});

// Update a park by ID - ok
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const updatedPark = await Park.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPark) {
      return res.status(404).send({ message: 'Park not found' });
    }
    res.status(200).send(updatedPark);
  } catch (err) {
    next(err);
  }
});

// Delete a park by ID - ok
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const removedPark = await Park.findByIdAndDelete(req.params.id);
    if (!removedPark) {
      return res.status(404).send({ message: 'Park not found' });
    }
    res.status(200).send(removedPark);
  } catch (err) {
    next(err);
  }
});

export default router;
