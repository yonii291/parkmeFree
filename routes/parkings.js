import express from "express";

const router = express.Router();

router.get("/", function (req, res, next) {
    res.send("Bienvenue sur la route de parkings!");
});

export default router;
