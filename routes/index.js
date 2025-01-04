import express from "express";

const router = express.Router();

/**
 * @api {get} / API Home
 * @apiName GetIndex
 * @apiGroup Index
 * @apiVersion 1.0.0
 * @apiDescription This route returns a welcome message.
 *
 * @apiSuccess {String} message Welcome message.
 *
 * @apiSuccessExample {json} Success:
 *     HTTP/1.1 200 OK
 *     "Bienvenue dans ParkMeFree!!"
 *
 * @apiError (500) InternalServerError An internal server error occurred.
 */

router.get("/", function (req, res, next) {
  res.send("Bienvenue dans ParkMeFree!");
});

export default router;
