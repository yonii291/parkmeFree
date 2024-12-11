import express from 'express';
import { User } from '../model/User.js';
import authenticate from '../utils/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();


// Create a new user - ok
router.post('/register', async (req, res) => {
  try {
    const plainPassword = req.body.password;
    const costFactor = 10;
    bcrypt.hash(plainPassword, costFactor, async function (err, hashedPassword) {
      if (err) {
        return res.status(500).send(err.message);
      }
      const user = new User({
        ...req.body,
        password: hashedPassword
      });
      await user.save();
      res.status(201).send({ user });
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all users - ok
router.get('/', async function (req, res, next) {
  try {
    const users = await User.find().exec(); // Utilisation de await sans callback
    res.status(200).send(users);
  } catch (err) {
    next(err); // Gestion de l'erreur avec try/catch
  }
});



// Get user by ID - ok
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});


// Update user by ID - ok
router.put('/update/:id', authenticate, async function (req, res, next) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
    res.status(200).send(updatedUser);
  } catch (err) {
    next(err); // Gestion de l'erreur avec try/catch
  }
});

//supprime un user - ok
router.delete('/delete/:id', async function (req, res, next) {
  try {
    const removedUser = await User.findByIdAndDelete(req.params.id).exec();

    res.status(200).send(removedUser);
  } catch (err) {
    next(err);
  }
});

export default router;
