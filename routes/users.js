import express from "express";
import { User } from "../model/User.js";
import jwt from "jsonwebtoken";
import authenticate from "../utils/auth.js";
import bcrypt from "bcryptjs";
import config from "../config/config.js";

const router = express.Router();
const secretKey = config.jwtSecret;

/**
 * @api {post} /users/register Register a new user
 * @apiName RegisterUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Register a new user and save it to the database.
 *
 * @apiBody {String} firstName User's first name (required, min length 3, max length 20).
 * @apiBody {String} lastName User's last name (required, min length 3, max length 20).
 * @apiBody {String} userName User's username (required, unique, min length 3, max length 20).
 * @apiBody {String} password User's password (required, min length 3).
 * @apiBody {String} email User's email (required, unique).
 * @apiBody {String} [notificationToken] User's notification token (optional).
 *
 * @apiSuccess {ObjectId} id Unique identifier for the user.
 * @apiSuccess {String} firstName User's first name.
 * @apiSuccess {String} lastName User's last name.
 * @apiSuccess {String} userName User's username.
 * @apiSuccess {String} email User's email.
 * @apiSuccess {String} notificationToken User's notification token.
 * @apiSuccess {Date} creationDate Date when the user was created.
 * @apiSuccess {Boolean} admin Whether the user is an admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "userName": "johndoe",
 *       "email": "john.doe@example.com",
 *       "notificationToken": "token123",
 *       "creationDate": "2024-01-02T10:00:00.000Z",
 *       "admin": false
 *     }
 *
 * @apiError (400) BadRequest Validation error or missing fields.
 * @apiError (409) Conflict User already exists.
 * @apiError (500) InternalServerError An error occurred while registering the user.
 *
 * @apiErrorExample {json} Error-Response (400):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Validation failed: You must provide a valid email!"
 *     }
 * @apiErrorExample {json} Error-Response (409):
 *     HTTP/1.1 409 Conflict
 *     {
 *       "message": "User already exists"
 *     }
 */
router.post("/register", async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    // Hash the password
    const costFactor = 10;
    bcrypt.hash(password, costFactor, async function (err, hashedPassword) {
      if (err) {
        return res.status(500).send({ message: "Error hashing the password" });
      }

      // Create a new user
      const user = new User({
        ...req.body,
        password: hashedPassword,
      });

      try {
        await user.save();

        // Generate a JWT token
        const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600; // Expires in 7 days
        const payload = { sub: user._id.toString(), exp: exp };
        jwt.sign(payload, secretKey, function (err, token) {
          if (err) {
            return res.status(500).send({ message: "Error generating the token" });
          }
          res.status(201).send({ ...user._doc, token: token });
        });
      } catch (saveError) {
        res.status(500).send({ message: "Error saving the user" });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Error registering the user" });
  }
});

/**
 * @api {get} /users Get all users
 * @apiName GetUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a list of all users.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the user.
 * @apiSuccess {String} firstName User's first name.
 * @apiSuccess {String} lastName User's last name.
 * @apiSuccess {String} userName User's username.
 * @apiSuccess {String} email User's email.
 * @apiSuccess {String} notificationToken User's notification token.
 * @apiSuccess {Date} creationDate Date when the user was created.
 * @apiSuccess {Boolean} admin Whether the user is an admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": "60c72b2f9af1b8b9b0f9a1b5",
 *         "firstName": "John",
 *         "lastName": "Doe",
 *         "userName": "johndoe",
 *         "email": "john.doe@example.com",
 *         "notificationToken": "token123",
 *         "creationDate": "2024-01-02T10:00:00.000Z",
 *         "admin": false
 *       }
 *     ]
 *
 * @apiError (500) InternalServerError An error occurred while fetching users.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "An error occurred while fetching users."
 *     }
 */

// Get all users - ok
router.get("/", async function (req, res, next) {
  try {
    const users = await User.find(); // Utilisation de await sans callback
    res.status(200).send(users);
  } catch (err) {
    next(err); // Gestion de l'erreur avec try/catch
  }
});

/**
 * @api {get} /users/:id Get user by ID
 * @apiName GetUserById
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a specific user by its ID.
 *
 * @apiParam {String} id User's unique ID.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the user.
 * @apiSuccess {String} firstName User's first name.
 * @apiSuccess {String} lastName User's last name.
 * @apiSuccess {String} userName User's username.
 * @apiSuccess {String} email User's email.
 * @apiSuccess {String} notificationToken User's notification token.
 * @apiSuccess {Date} creationDate Date when the user was created.
 * @apiSuccess {Boolean} admin Whether the user is an admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "userName": "johndoe",
 *       "email": "john.doe@example.com",
 *       "notificationToken": "token123",
 *       "creationDate": "2024-01-02T10:00:00.000Z",
 *       "admin": false
 *     }
 *
 * @apiError (404) NotFound User not found.
 * @apiError (500) InternalServerError An error occurred while fetching the user.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 */

// Get user by ID - ok
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {put} /users/update/:id Update user by ID
 * @apiName UpdateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Update an existing user by its ID.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiParam {String} id User's unique ID.
 *
 * @apiBody {String} [firstName] Updated first name of the user (min length 3, max length 20).
 * @apiBody {String} [lastName] Updated last name of the user (min length 3, max length 20).
 * @apiBody {String} [userName] Updated username of the user (unique, min length 3, max length 20).
 * @apiBody {String} [password] Updated password of the user (min length 3).
 * @apiBody {String} [email] Updated email of the user (unique).
 * @apiBody {String} [notificationToken] Updated notification token of the user.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the user.
 * @apiSuccess {String} firstName Updated first name of the user.
 * @apiSuccess {String} lastName Updated last name of the user.
 * @apiSuccess {String} userName Updated username of the user.
 * @apiSuccess {String} email Updated email of the user.
 * @apiSuccess {String} notificationToken Updated notification token of the user.
 * @apiSuccess {Date} creationDate Date when the user was created.
 * @apiSuccess {Boolean} admin Whether the user is an admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "userName": "johndoe",
 *       "email": "john.doe@example.com",
 *       "notificationToken": "token123",
 *       "creationDate": "2024-01-02T10:00:00.000Z",
 *       "admin": false
 *     }
 *
 * @apiError (404) NotFound User not found.
 * @apiError (500) InternalServerError An error occurred while updating the user.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 */

// Update user by ID - ok
router.put("/update/:id", authenticate, async function (req, res, next) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(updatedUser);
  } catch (err) {
    next(err); // Gestion de l'erreur avec try/catch
  }
});

/**
 * @api {delete} /users/delete/:id Delete user by ID
 * @apiName DeleteUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Delete a specific user by its ID.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiParam {String} id User's unique ID.
 *
 * @apiSuccess {ObjectId} id Unique identifier of the deleted user.
 * @apiSuccess {String} firstName First name of the deleted user.
 * @apiSuccess {String} lastName Last name of the deleted user.
 * @apiSuccess {String} userName Username of the deleted user.
 * @apiSuccess {String} email Email of the deleted user.
 * @apiSuccess {String} notificationToken Notification token of the deleted user.
 * @apiSuccess {Date} creationDate Date when the user was created.
 * @apiSuccess {Boolean} admin Whether the user was an admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "userName": "johndoe",
 *       "email": "john.doe@example.com",
 *       "notificationToken": "token123",
 *       "creationDate": "2024-01-02T10:00:00.000Z",
 *       "admin": false
 *     }
 *
 * @apiError (404) NotFound User not found.
 * @apiError (500) InternalServerError An error occurred while deleting the user.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 */

//supprime un user - ok
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const removedUser = await User.findByIdAndDelete(req.params.id).exec();

    res.status(200).send(removedUser);
  } catch (err) {
    next(err);
  }
});

export default router;
