// import express from "express";
// import bcrypt from "bcryptjs";
// import { User } from "../model/User.js";
// import { Park } from "../model/Park.js";


// const router = express.Router();

// router.get("/", function (req, res, next) {
//   res.send("Got a response from the users route");
// });

// export default router;

import express from 'express';
import { User } from '../model/User.js';
import authenticate from '../utils/auth.js';
const router = express.Router();

// Get all users
router.get('/', authenticate, function (req, res, next) {
  User.find().exec(function (err, users) {
    if (err) {
      return next(err);
    }
    res.status(200).send(users);
  });
});

// Get user by ID
router.get('/:id', authenticate, function (req, res, next) {
  User.findById(req.params.id).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    res.status(200).send(user);
  });
});

// Update user by ID
router.put('/:id', authenticate, function (req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function (err, updatedUser) {
    if (err) {
      return next(err);
    }
    res.status(200).send(updatedUser);
  });
});

// Delete user by ID
router.delete('/:id', authenticate, function (req, res, next) {
  User.findByIdAndRemove(req.params.id).exec(function (err, removedUser) {
    if (err) {
      return next(err);
    }
    res.status(200).send(removedUser);
  });
});

export default router;
