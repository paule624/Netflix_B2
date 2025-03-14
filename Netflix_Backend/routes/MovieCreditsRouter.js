import express from "express";
import MovieCredits from "../controllers/MovieCreditsController.js";

const router = express.Router();

// Route pour obtenir les crédits d'un film
router.get("/:id/credits", MovieCredits.getMovieCredits);

export default router;
