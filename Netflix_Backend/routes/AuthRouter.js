import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

// Routes d'authentification
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

export default router;
