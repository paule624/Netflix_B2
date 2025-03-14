import express from "express";
import MovieGenres from "../controllers/MovieGenresController.js";

const router = express.Router();

// Route pour obtenir la liste des genres de films
router.get("/", MovieGenres.getMovieGenres);

export default router;
