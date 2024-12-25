import express from 'express';
import { ParkingSession } from '../model/ParkingSession.js';
import authenticate from '../utils/auth.js';
const router = express.Router();

// Get all parking sessions - ok
router.get('/', async (req, res, next) => {
  try {
    const sessions = await ParkingSession.find();
    res.status(200).send(sessions);
  } catch (err) {
    next(err);
  }
});

// Get parking session by ID - ok
router.get('/:id', async (req, res, next) => {
  try {
    const session = await ParkingSession.findOne({ _id: req.params.id });
    res.status(200).send(session);
  } catch (err) {
    next(err);
  }
});


// Create a new parking session - ok 
router.post('/', authenticate, async (req, res, next) => {
  try {
    const newSession = new ParkingSession(req.body);
    const savedSession = await newSession.save();
    res.status(201).send(savedSession);
  } catch (err) {
    next(err);
  }
});


// Update parking session by ID - ok
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const updatedSession = await ParkingSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updatedSession);
  } catch (err) {
    next(err);
  }
});


// Delete parking session by ID - ok
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const removedSession = await ParkingSession.findByIdAndDelete(req.params.id);
    res.status(200).send(removedSession);
  } catch (err) {
    next(err);
  }
});

export default router;
