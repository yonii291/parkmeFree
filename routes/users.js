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
import User from '../model/User.js';
import authenticate from '../utils/auth.js';
import authorize from '../utils/authorize.js';

const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all users
router.get('/allUsers', async function (req, res, next) {
  try {
    const users = await User.find().exec(); // Utilisation de await sans callback
    res.status(200).send(users);
  } catch (err) {
    next(err); // Gestion de l'erreur avec try/catch
  }
});

// // Get all users
// router.get('/allUsers', authenticate, async function (req, res, next) {
//   try {
//     const users = await User.find().exec(); // Utilisation de await sans callback
//     res.status(200).send(users);
//   } catch (err) {
//     next(err); // Gestion de l'erreur avec try/catch
//   }
// });

// Get user by ID - ok
router.get('/:id', authenticate, authorize(['Admin', 'User']), function (req, res, next) {

  User.findById(req.params.id).exec(function (err, user) {

    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send(user);
  });
});


// Update user by ID - ok
router.put('/update/:id', authenticate, authorize(['Admin']), async function (req, res, next) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
    res.status(200).send(updatedUser);
  } catch (err) {
    next(err); // Gestion de l'erreur avec try/catch
  }
});


// // Update user by ID
// router.put('/update/:id', authenticate, function (req, res, next) {
//   User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function (err, updatedUser) {
//     if (err) {
//       return next(err);
//     }
//     res.status(200).send(updatedUser);
//   });
// });

router.delete('delete/:id', async function (req, res, next) {
  try {
    const removedUser = await User.findByIdAndRemove(req.params.id).exec();
    res.status(200).send(removedUser);
  } catch (err) {
    next(err);
  }
});


// // Delete user by ID
// router.delete('/:id', authenticate, function (req, res, next) {
//   User.findByIdAndRemove(req.params.id).exec(function (err, removedUser) {
//     if (err) {
//       return next(err);
//     }
//     res.status(200).send(removedUser);
//   });
// });

export default router;
