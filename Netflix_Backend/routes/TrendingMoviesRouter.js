import express from "express";
import TrendingMovies from "../controllers/TrendingMoviesController.js";

const router = express.Router();

// Route pour obtenir les films tendances
router.get("/", TrendingMovies.getTrendingMovies);

export default router;
