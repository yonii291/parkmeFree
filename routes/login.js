// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { User } from '../model/User.js';

// const router = express.Router();
// // stocker les valeurs sensibles dans des variables d'environnement
// const secretKey = process.env.SECRET_KEY

// router.post("/", function (req, res, next) {
//     User.findOne({ userName: req.body.userName }).exec(function (err, user) {
//         if (err) {
//             return next(err);
//         } else if (!user) {
//             return res.sendStatus(401);
//         }
//         //Validate the password with bcrypt
//         bcrypt.compare(req.body.password, user.password, function (err, valid) {
//             if (err) {
//                 return next(err);
//             } else if (!valid) {
//                 return res.sendStatus(401);
//             }
//             //Generate a valid JWT that expires in 7 days
//             const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600
//             const payload = { sub: user._id.toString(), exp: exp }
//             jwt.sign(payload, secretKey, function (err, token) {
//                 if (err) {
//                     return next(err)
//                 }
//                 res.status(200).send({ token: token, user: user })
//             })
//         });
//     })
// });

// export default router

import express from 'express';
import { User } from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Login a user
router.post('/', async function (req, res, next) {
    const { username, password } = req.body;
    try {
        // Trouver l'utilisateur par son nom d'utilisateur
        const user = await User.findOne({ username: username });

        // Si l'utilisateur n'existe pas
        if (!user) {
            return res.status(401).send("Invalid credentials");
        }

        // Vérifier le mot de passe avec bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        // Si les mots de passe ne correspondent pas
        if (!isMatch) {
            return res.status(401).send("Invalid credentials");
        }

        // Créer un token JWT
        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });

        // Répondre avec le token
        res.status(200).send({ token: token });

    } catch (err) {
        next(err);
    }
});

export default router;