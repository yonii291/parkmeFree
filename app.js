import express from "express";
import createError from "http-errors";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import carsRouter from "./routes/cars.js";
import usersRouter from "./routes/users.js";
import parksRouter from "./routes/parks.js";
import parkingSessionsRouter from "./routes/parkingSessions.js";
import mongoose from 'mongoose';

///DATABASE CONNECTION
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost/monApp', {

})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB', err));

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/login", usersRouter);
app.use("/parks", parksRouter);
app.use("/cars", carsRouter);
app.use("/parkingSession", parkingSessionsRouter);
app.use("/", indexRouter);

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
