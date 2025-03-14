import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import moviesByCategorieRoutes from "./routes/MoviesByCategorieRoutes.js";
import movieVideosRoutes from "./routes/MovieVideosRouter.js";
import trendingMoviesRoutes from "./routes/TrendingMoviesRouter.js";
import movieGenresRoutes from "./routes/MovieGenresRouter.js";
import movieCreditsRoutes from "./routes/moviecreditsrouter.js";
import authRoutes from "./routes/AuthRouter.js";
import cookieParser from "cookie-parser";

// Middleware d'authentification
import { verifyToken } from "./middleware/auth.js";

// Update allowed origins to match your frontend exactly
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

// Update CORS options for better cookie handling
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-User-ID"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
};

// Charger les variables d'environnement
dotenv.config();

// Initialize Express app first
const app = express();
const PORT = process?.env?.PORT || 5000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Now you can define routes
app.get("/api/auth/check", verifyToken, (req, res) => {
  res.status(200).json({
    authenticated: true,
    user: req.user,
    message: "Authentication successful",
  });
});

// Routes
app.use("/api/auth", authRoutes); // Routes d'authentification (non protégées)

// Routes protégées par authentification
app.use("/api/movies/category", verifyToken, moviesByCategorieRoutes);
app.use("/api/movies", verifyToken, movieVideosRoutes);
app.use("/api/trending", verifyToken, trendingMoviesRoutes);
app.use("/api/genres", verifyToken, movieGenresRoutes);
app.use("/api/movies", verifyToken, movieCreditsRoutes);

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
