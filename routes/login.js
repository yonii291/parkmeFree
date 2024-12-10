import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../model/User.js';
import config from "../config/config.js"

const router = express.Router();
// stocker les valeurs sensibles dans des variables d'environnement
const secretKey = config.jwtSecret

router.post("/", async (req, res) => {
    try {
        await User.findOne({ email: req.body.email }).then((user) => {
            //Si pas d'utilisateur
            if (!user) {
                return res.sendStatus(401);
            }
            //Validate the password with bcrypt
            bcrypt.compare(req.body.password, user.password, function (err, valid) {
                if (err) {
                    return next(err);
                } else if (!valid) {
                    return res.sendStatus(401);
                }
                //Generate a valid JWT that expires in 7 days
                const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600
                const payload = { sub: user._id.toString(), exp: exp }
                jwt.sign(payload, secretKey, function (err, token) {
                    if (err) {
                        return next(err)
                    }
                    res.status(200).send({ token: token, user: user })
                })
            });
        }).catch((err) => {
            return next(err);
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router