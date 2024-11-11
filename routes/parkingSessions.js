

// const router = express.Router();

// router.get("/", function (req, res, next) {
//     res.send("Bienvenue sur la route de parkings!");
// });

// export default router;
import express from 'express';
import { ParkingSession } from '../model/ParkingSession.js';
import authenticate from '../utils/auth.js';
const router = express.Router();

// Get all parking sessions
router.get('/', function (req, res, next) {
  ParkingSession.find().exec(function (err, sessions) {
    if (err) {
      return next(err);
    }
    res.status(200).send(sessions);
  });
});

// Get parking session by ID
router.get('/:id', function (req, res, next) {
  ParkingSession.findOne({ _id: req.params.id }).exec(function (err, session) {
    if (err) {
      return next(err);
    }
    res.status(200).send(session);
  });
});

// Create a new parking session
router.post('/', authenticate, function (req, res, next) {
  const newSession = new ParkingSession(req.body);
  newSession.save(function (err, savedSession) {
    if (err) {
      return next(err);
    }
    res.status(201).send(savedSession);
  });
});

// Update parking session by ID
router.put('/:id', authenticate, function (req, res, next) {
  ParkingSession.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function (err, updatedSession) {
    if (err) {
      return next(err);
    }
    res.status(200).send(updatedSession);
  });
});

// Delete parking session by ID
router.delete('/:id', authenticate, function (req, res, next) {
  ParkingSession.findByIdAndRemove(req.params.id).exec(function (err, removedSession) {
    if (err) {
      return next(err);
    }
    res.status(200).send(removedSession);
  });
});

export default router;
