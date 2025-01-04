import express from "express";
import { ParkingSession } from "../model/ParkingSession.js";
import authenticate from "../utils/auth.js";
const router = express.Router();

/**
 * @api {get} /parkingSessions Get all parking sessions
 * @apiName GetParkingSessions
 * @apiGroup ParkingSession
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a list of all parking sessions.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the parking session.
 * @apiSuccess {Date} start_time Start time of the parking session.
 * @apiSuccess {Date} end_time End time of the parking session.
 * @apiSuccess {ObjectId} park_id ID of the park.
 * @apiSuccess {ObjectId} user_id ID of the user.
 * @apiSuccess {ObjectId} car_id ID of the car.
 * @apiSuccess {Array} geolocation Geolocation of the parking session.
 * @apiSuccess {Date} creationDate Date when the parking session was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": "60c72b2f9af1b8b9b0f9a1b5",
 *         "start_time": "2024-01-02T10:00:00.000Z",
 *         "end_time": "2024-01-02T12:00:00.000Z",
 *         "park_id": "60c72b2f9af1b8b9b0f9a1b6",
 *         "user_id": "60c72b2f9af1b8b9b0f9a1b7",
 *         "car_id": "60c72b2f9af1b8b9b0f9a1b8",
 *         "geolocation": [40.785091, -73.968285],
 *         "creationDate": "2024-01-02T10:00:00.000Z"
 *       }
 *     ]
 *
 * @apiError (500) InternalServerError An error occurred while fetching parking sessions.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "An error occurred while fetching parking sessions."
 *     }
 */

// Get all parking sessions - ok
router.get("/", async (req, res, next) => {
  try {
    const sessions = await ParkingSession.find();
    res.status(200).send(sessions);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {get} /parkingSessions/:id Get parking session by ID
 * @apiName GetParkingSessionById
 * @apiGroup ParkingSession
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a specific parking session by its ID.
 *
 * @apiParam {String} id Parking session's unique ID.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the parking session.
 * @apiSuccess {Date} start_time Start time of the parking session.
 * @apiSuccess {Date} end_time End time of the parking session.
 * @apiSuccess {ObjectId} park_id ID of the park.
 * @apiSuccess {ObjectId} user_id ID of the user.
 * @apiSuccess {ObjectId} car_id ID of the car.
 * @apiSuccess {Array} geolocation Geolocation of the parking session.
 * @apiSuccess {Date} creationDate Date when the parking session was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "start_time": "2024-01-02T10:00:00.000Z",
 *       "end_time": "2024-01-02T12:00:00.000Z",
 *       "park_id": "60c72b2f9af1b8b9b0f9a1b6",
 *       "user_id": "60c72b2f9af1b8b9b0f9a1b7",
 *       "car_id": "60c72b2f9af1b8b9b0f9a1b8",
 *       "geolocation": [40.785091, -73.968285],
 *       "creationDate": "2024-01-02T10:00:00.000Z"
 *     }
 *
 * @apiError (404) NotFound Parking session not found.
 * @apiError (500) InternalServerError An error occurred while fetching the parking session.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Parking session not found"
 *     }
 */

// Get parking session by ID - ok
router.get("/:id", async (req, res, next) => {
  try {
    const session = await ParkingSession.findOne({ _id: req.params.id });
    res.status(200).send(session);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /parkingSessions Create a new parking session
 * @apiName CreateParkingSession
 * @apiGroup ParkingSession
 * @apiVersion 1.0.0
 * @apiDescription Create a new parking session and save it to the database.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiBody {Date} start_time Start time of the parking session (required).
 * @apiBody {Date} end_time End time of the parking session (required).
 * @apiBody {ObjectId} park_id ID of the park (required).
 * @apiBody {ObjectId} user_id ID of the user (required).
 * @apiBody {ObjectId} car_id ID of the car (required).
 * @apiBody {Array} geolocation Geolocation of the parking session (required).
 *
 * @apiSuccess {ObjectId} id Unique identifier for the parking session.
 * @apiSuccess {Date} start_time Start time of the parking session.
 * @apiSuccess {Date} end_time End time of the parking session.
 * @apiSuccess {ObjectId} park_id ID of the park.
 * @apiSuccess {ObjectId} user_id ID of the user.
 * @apiSuccess {ObjectId} car_id ID of the car.
 * @apiSuccess {Array} geolocation Geolocation of the parking session.
 * @apiSuccess {Date} creationDate Date when the parking session was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "start_time": "2024-01-02T10:00:00.000Z",
 *       "end_time": "2024-01-02T12:00:00.000Z",
 *       "park_id": "60c72b2f9af1b8b9b0f9a1b6",
 *       "user_id": "60c72b2f9af1b8b9b0f9a1b7",
 *       "car_id": "60c72b2f9af1b8b9b0f9a1b8",
 *       "geolocation": [40.785091, -73.968285],
 *       "creationDate": "2024-01-02T10:00:00.000Z"
 *     }
 *
 * @apiError (401) Unauthorized User not authorized to create a parking session.
 * @apiError (500) InternalServerError An error occurred while creating the parking session.
 *
 * @apiErrorExample {json} Error-Response (401):
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "User not authorized to create a parking session"
 *     }
 */

// Create a new parking session - ok
router.post("/", authenticate, async (req, res, next) => {
  try {
    const newSession = new ParkingSession(req.body);
    const savedSession = await newSession.save();
    res.status(201).send(savedSession);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {put} /parkingSessions/:id Update parking session by ID
 * @apiName UpdateParkingSession
 * @apiGroup ParkingSession
 * @apiVersion 1.0.0
 * @apiDescription Update an existing parking session by its ID.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiParam {String} id Parking session's unique ID.
 *
 * @apiBody {Date} [start_time] Updated start time of the parking session.
 * @apiBody {Date} [end_time] Updated end time of the parking session.
 * @apiBody {ObjectId} [park_id] Updated ID of the park.
 * @apiBody {ObjectId} [user_id] Updated ID of the user.
 * @apiBody {ObjectId} [car_id] Updated ID of the car.
 * @apiBody {Array} [geolocation] Updated geolocation of the parking session.
 *
 * @apiSuccess {ObjectId} id Unique identifier for the parking session.
 * @apiSuccess {Date} start_time Updated start time of the parking session.
 * @apiSuccess {Date} end_time Updated end time of the parking session.
 * @apiSuccess {ObjectId} park_id Updated ID of the park.
 * @apiSuccess {ObjectId} user_id Updated ID of the user.
 * @apiSuccess {ObjectId} car_id Updated ID of the car.
 * @apiSuccess {Array} geolocation Updated geolocation of the parking session.
 * @apiSuccess {Date} creationDate Date when the parking session was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "start_time": "2024-01-02T10:00:00.000Z",
 *       "end_time": "2024-01-02T12:00:00.000Z",
 *       "park_id": "60c72b2f9af1b8b9b0f9a1b6",
 *       "user_id": "60c72b2f9af1b8b9b0f9a1b7",
 *       "car_id": "60c72b2f9af1b8b9b0f9a1b8",
 *       "geolocation": [40.785091, -73.968285],
 *       "creationDate": "2024-01-02T10:00:00.000Z"
 *     }
 *
 * @apiError (404) NotFound Parking session not found.
 * @apiError (500) InternalServerError An error occurred while updating the parking session.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Parking session not found"
 *     }
 */

// Update parking session by ID - ok
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const updatedSession = await ParkingSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send(updatedSession);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {delete} /parkingSessions/:id Delete parking session by ID
 * @apiName DeleteParkingSession
 * @apiGroup ParkingSession
 * @apiVersion 1.0.0
 * @apiDescription Delete a specific parking session by its ID.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiParam {String} id Parking session's unique ID.
 *
 * @apiSuccess {ObjectId} id Unique identifier of the deleted parking session.
 * @apiSuccess {Date} start_time Start time of the deleted parking session.
 * @apiSuccess {Date} end_time End time of the deleted parking session.
 * @apiSuccess {ObjectId} park_id ID of the park.
 * @apiSuccess {ObjectId} user_id ID of the user.
 * @apiSuccess {ObjectId} car_id ID of the car.
 * @apiSuccess {Array} geolocation Geolocation of the deleted parking session.
 * @apiSuccess {Date} creationDate Date when the parking session was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "60c72b2f9af1b8b9b0f9a1b5",
 *       "start_time": "2024-01-02T10:00:00.000Z",
 *       "end_time": "2024-01-02T12:00:00.000Z",
 *       "park_id": "60c72b2f9af1b8b9b0f9a1b6",
 *       "user_id": "60c72b2f9af1b8b9b0f9a1b7",
 *       "car_id": "60c72b2f9af1b8b9b0f9a1b8",
 *       "geolocation": [40.785091, -73.968285],
 *       "creationDate": "2024-01-02T10:00:00.000Z"
 *     }
 *
 * @apiError (404) NotFound Parking session not found.
 * @apiError (500) InternalServerError An error occurred while deleting the parking session.
 *
 * @apiErrorExample {json} Error-Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Parking session not found"
 *     }
 */

// Delete parking session by ID - ok
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const removedSession = await ParkingSession.findByIdAndDelete(
      req.params.id
    );
    res.status(200).send(removedSession);
  } catch (err) {
    next(err);
  }
});

export default router;
