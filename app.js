import express from "express";
import createError from "http-errors";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import carsRouter from "./routes/cars.js";
import usersRouter from "./routes/users.js";
import loginRouter from "./routes/login.js";
import parksRouter from "./routes/parks.js";
import parkingSessionsRouter from "./routes/parkingSessions.js";
import notificationsRouter from "./routes/notifications.js";
import mongoose from "mongoose";
import cors from "cors";

///DATABASE CONNECTION
mongoose
  .connect(process.env.DATABASE_URL || "mongodb://localhost/monApp", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

const app = express();

// Allow requests from frontend's Render URL
const allowedOrigins = ['https://parkmefree-4y8d.onrender.com', 'http://localhost:5173'];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    credentials: true, // If using cookies or authorization headers
  })
);

app.use("/documentation", express.static("documentation"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", indexRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/parkingSessions", parkingSessionsRouter);
app.use("/api/cars", carsRouter);
app.use("/api/parks", parksRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);

// mettre tous les routes objets

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;
