import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/User.js";
import config from "../config/config.js";

const router = express.Router();
// stocker les valeurs sensibles dans des variables d'environnement
const secretKey = config.jwtSecret;

/**
 * @api {post} /login User login
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription Authenticate a user and return a JWT token.
 *
 * @apiBody {String} email User's email (required).
 * @apiBody {String} password User's password (required).
 *
 * @apiSuccess {String} token JWT token for the authenticated user.
 * @apiSuccess {String} id User's unique ID.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *       "id": "60c72b2f9af1b8b9b0f9a1b5"
 *     }
 *
 * @apiError (401) Unauthorized Invalid email or password.
 * @apiError (500) InternalServerError An error occurred while logging in.
 *
 * @apiErrorExample {json} Error-Response (401):
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "User not found"
 *     }
 */

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    bcrypt.compare(req.body.password, user.password, function (err, valid) {
      if (err) {
        return res.status(500).send({ message: "Error comparing passwords" });
      } else if (!valid) {
        return res.status(401).send({ message: "Invalid password" });
      }

      // Generate a JWT token
      const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600; // Expires in 7 days
      const payload = { sub: user._id.toString(), exp: exp };
      jwt.sign(payload, secretKey, function (err, token) {
        if (err) {
          return res
            .status(500)
            .send({ message: "Error generating the token" });
        }
        res.status(200).send({ token: token, id: user._id });
      });
    });
  } catch (error) {
    res.status(500).send({ message: "Error logging in the user" });
  }
});

export default router;
