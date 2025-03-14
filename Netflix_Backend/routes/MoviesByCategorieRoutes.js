import express from "express";
import MoviesByCategory from "../controllers/MoviesByCategoryController.js";

const router = express.Router();

// Route pour obtenir les films par catégories
router.get("/", MoviesByCategory.getMoviesByCategory);

export default router;
