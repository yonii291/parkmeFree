// routes/notifications.js
import express from "express";
import sendNotification from "../utils/sendNotification.js";

const router = express.Router();

/**
 * @api {post} /notifications/send Send a notification
 * @apiName SendNotification
 * @apiGroup Notification
 * @apiVersion 1.0.0
 * @apiDescription Send a notification to a user.
 *
 * @apiBody {String} token User's notification token (required).
 * @apiBody {String} message Notification message (required).
 *
 * @apiSuccess {String} success Success message.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Notification sent successfully"
 *     }
 *
 * @apiError (400) BadRequest Token and message are required.
 * @apiError (500) InternalServerError An error occurred while sending the notification.
 *
 * @apiErrorExample {json} Error-Response (400):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Token and message are required"
 *     }
 */

router.post("/send", async (req, res) => {
  const { token, message } = req.body;

  if (!token || !message) {
    return res.status(400).json({ error: "Token and message are required" });
  }

  try {
    await sendNotification(token, message);
    res.status(200).json({ success: "Notification sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
