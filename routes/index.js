import express from "express";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Bienvenue dans ParkMeFree!");
});

export default router;

