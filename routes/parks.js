// import express from "express";

// const router = express.Router();

// router.get("/", function (req, res, next) {
//     res.send("Bienvenue sur la route de parkings!");
// });

// export default router;

import express from "express";
import { Park } from "../model/Park.js";
import authenticate from "../utils/auth.js";
import cloudinary from "../config/cloudinaryConfig.js";
import formidable from "formidable";

const router = express.Router();

/**
 * @api {get} /parks Get all parks
 * @apiName GetParks
 * @apiGroup Park
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a list of all parks.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the park.
 * @apiSuccess {String} name Name of the park.
 * @apiSuccess {Number} height Height of the park.
 * @apiSuccess {String} picture Picture of the park.
 * @apiSuccess {Number} capacity Capacity of the park.
 * @apiSuccess {Array} geolocation Geolocation of the park.
 * @apiSuccess {Date} creationDate Date when the park was created.
 * @apiSuccess {Number} freeTime Free time duration of the park.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": "60c72b2f9af1b8b9b0f9a1b5",
 *         "name": "Central Park",
 *         "height": 10,
 *         "picture": "central_park.jpg",
 *         "capacity": 100,
 *         "geolocation": [40.785091, -73.968285],
 *         "creationDate": "2024-01-02T10:00:00.000Z",
 *         "freeTime": 30
 *       }
 *     ]
 *
 * @apiError (500) InternalServerError An error occurred while fetching parks.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "An error occurred while fetching parks."
 *     }
 */

// Get all parks - ok
router.get("/", authenticate, async function (req, res, next) {
  try {
    const parkings = await Park.find().exec(); // Utilisation de await sans callback
    res.status(200).send(parkings);
  } catch (err) {
    next(err); // Gestion de l'erreur avec try/catch
  }
});

/**
 * @api {get} /parks/:id Get park by ID
 * @apiName GetParkById
 * @apiGroup Park
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a specific park by its ID.
 *
 * @apiParam {String} id Park's unique ID.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the park.
 * @apiSuccess {String} name Name of the park.
 * @apiSuccess {Number} height Height of the park.
 * @apiSuccess {String} picture Picture of the park.
 * @apiSuccess {Number} capacity Capacity of the park.
 * @apiSuccess {Array} geolocation Geolocation of the park.
 * @apiSuccess {Date} creationDate Date when the park was created.
 * @apiSuccess {Number} freeTime Free time duration of the park.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "name": "Central Park",
 *       "height": 10,
 *       "picture": "central_park.jpg",
 *       "capacity": 100,
 *       "geolocation": [40.785091, -73.968285],
 *       "creationDate": "2024-01-02T10:00:00.000Z",
 *       "freeTime": 30
 *     }
 *
 * @apiError (404) NotFound Park not found.
 * @apiError (500) InternalServerError An error occurred while fetching the park.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Park not found"
 *     }
 */

// Get park by ID - ok
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const park = await Park.findOne({ _id: req.params.id });
    if (!park) {
      return res.status(404).send({ message: "Park not found" });
    }
    res.status(200).send(park);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /parks/create Create a new park
 * @apiName CreatePark
 * @apiGroup Park
 * @apiVersion 1.0.0
 * @apiDescription Create a new park and save it to the database.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiBody {String} name Name of the park (required, min length 3, max length 50).
 * @apiBody {Number} height Height of the park.
 * @apiBody {String} picture Picture of the park (required).
 * @apiBody {Number} capacity Capacity of the park (required).
 * @apiBody {Array} geolocation Geolocation of the park (required).
 * @apiBody {Number} freeTime Free time duration of the park (required).
 *
 * @apiSuccess {ObjectId} id Unique identifier for the park.
 * @apiSuccess {String} name Name of the park.
 * @apiSuccess {Number} height Height of the park.
 * @apiSuccess {String} picture Picture of the park.
 * @apiSuccess {Number} capacity Capacity of the park.
 * @apiSuccess {Array} geolocation Geolocation of the park.
 * @apiSuccess {Date} creationDate Date when the park was created.
 * @apiSuccess {Number} freeTime Free time duration of the park.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "name": "Central Park",
 *       "height": 10,
 *       "picture": "central_park.jpg",
 *       "capacity": 100,
 *       "geolocation": [40.785091, -73.968285],
 *       "creationDate": "2024-01-02T10:00:00.000Z",
 *       "freeTime": 30
 *     }
 *
 * @apiError (401) Unauthorized User not authorized to create a park.
 * @apiError (500) InternalServerError An error occurred while creating the park.
 *
 * @apiErrorExample {json} Error-Response (401):
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "User not authorized to create a park"
 *     }
 */

// Create a new park - ok
router.post("/create", authenticate, async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).send({ message: "Error parsing form" });
    }
    try {
      const result = await cloudinary.uploader.upload(files.picture.path, {
        folder: 'parks'
      });
      const newPark = new Park({
        ...fields,
        picture: result.secure_url
      });
      await newPark.save();
      res.status(201).send({ newPark });
    } catch (error) {
      res.status(401).send(error.message);
    }
  });
});

/**
 * @api {put} /parks/:id Update park by ID
 * @apiName UpdatePark
 * @apiGroup Park
 * @apiVersion 1.0.0
 * @apiDescription Update an existing park by its ID.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiParam {String} id Park's unique ID.
 *
 * @apiBody {String} [name] Updated name of the park (min length 3, max length 50).
 * @apiBody {Number} [height] Updated height of the park.
 * @apiBody {String} [picture] Updated picture of the park.
 * @apiBody {Number} [capacity] Updated capacity of the park.
 * @apiBody {Array} [geolocation] Updated geolocation of the park.
 * @apiBody {Number} [freeTime] Updated free time duration of the park.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the park.
 * @apiSuccess {String} name Updated name of the park.
 * @apiSuccess {Number} height Updated height of the park.
 * @apiSuccess {String} picture Updated picture of the park.
 * @apiSuccess {Number} capacity Updated capacity of the park.
 * @apiSuccess {Array} geolocation Updated geolocation of the park.
 * @apiSuccess {Date} creationDate Date when the park was created.
 * @apiSuccess {Number} freeTime Updated free time duration of the park.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "name": "Central Park",
 *       "height": 10,
 *       "picture": "central_park.jpg",
 *       "capacity": 100,
 *       "geolocation": [40.785091, -73.968285],
 *       "creationDate": "2024-01-02T10:00:00.000Z",
 *       "freeTime": 30
 *     }
 *
 * @apiError (404) NotFound Park not found.
 * @apiError (500) InternalServerError An error occurred while updating the park.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Park not found"
 *     }
 */

// Update a park by ID - ok
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const updatedPark = await Park.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPark) {
      return res.status(404).send({ message: "Park not found" });
    }
    res.status(200).send(updatedPark);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {delete} /parks/:id Delete park by ID
 * @apiName DeletePark
 * @apiGroup Park
 * @apiVersion 1.0.0
 * @apiDescription Delete a specific park by its ID.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiParam {String} id Park's unique ID.
 *
 * @apiSuccess {ObjectId} id Unique identifier of the deleted park.
 * @apiSuccess {String} name Name of the deleted park.
 * @apiSuccess {Number} height Height of the deleted park.
 * @apiSuccess {String} picture Picture of the deleted park.
 * @apiSuccess {Number} capacity Capacity of the deleted park.
 * @apiSuccess {Array} geolocation Geolocation of the deleted park.
 * @apiSuccess {Date} creationDate Date when the park was created.
 * @apiSuccess {Number} freeTime Free time duration of the deleted park.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "name": "Central Park",
 *       "height": 10,
 *       "picture": "central_park.jpg",
 *       "capacity": 100,
 *       "geolocation": [40.785091, -73.968285],
 *       "creationDate": "2024-01-02T10:00:00.000Z",
 *       "freeTime": 30
 *     }
 *
 * @apiError (404) NotFound Park not found.
 * @apiError (500) InternalServerError An error occurred while deleting the park.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Park not found"
 *     }
 */

// Delete a park by ID - ok
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const removedPark = await Park.findByIdAndDelete(req.params.id);
    if (!removedPark) {
      return res.status(404).send({ message: "Park not found" });
    }
    res.status(200).send(removedPark);
  } catch (err) {
    next(err);
  }
});

export default router;
