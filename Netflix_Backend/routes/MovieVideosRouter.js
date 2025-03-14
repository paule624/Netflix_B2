import express from "express";
import MovieVideos from "../controllers/MovieVideosController.js";

const router = express.Router();

// Route pour obtenir les vidéos d'un film
router.get("/:id/videos", MovieVideos.getMovieVideos);

export default router;
