const router = express.Router();

router.get("/", function (req, res, next) {
    res.send("Bienvenue sur la route de cars!");
});

export default router;

