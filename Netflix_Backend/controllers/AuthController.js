import admin from "firebase-admin";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser Firebase Admin SDK
try {
  const serviceAccount = {
    type: "service_account",
    project_id: "netflix-69151",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialisé avec succès");
} catch (error) {
  console.error("Erreur d'initialisation de Firebase Admin:", error);
}

class AuthController {
  constructor() {
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
  }

  // Suppression des console.log dans les méthodes signup, login, logout et verifyToken
  
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }
  
      // Utiliser l'API REST de Firebase pour l'inscription
      const apiKey = process.env.FIREBASE_API_KEY;
  
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        if (data.error && data.error.message === "EMAIL_EXISTS") {
          return res
            .status(400)
            .json({ message: "Cet email est déjà utilisé" });
        }
        return res.status(400).json({
          message: "Erreur lors de l'inscription",
          details: data.error ? data.error.message : "Erreur d'inscription",
        });
      }
  
      // Mettre à jour le profil pour ajouter le nom d'utilisateur
      const updateResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: data.idToken,
            displayName: name,
            returnSecureToken: true,
          }),
        }
      );
  
      const updateData = await updateResponse.json();
  
      // Stocker dans Firestore pour référence future
      try {
        await admin.firestore().collection("users").doc(data.localId).set({
          uid: data.localId,
          name,
          email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (firestoreError) {
        // Non-bloquant
      }
  
      // Generate JWT token for cookies
      const token = jwt.sign(
        {
          userId: data.localId,
          email: data.email,
          name: name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
  
      // Set token in cookie
      res
        .cookie("authToken", token, {
          httpOnly: true,
          secure: false, // Set to false for local development
          sameSite: "lax",
          path: "/",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          message: "Utilisateur créé avec succès",
          user: {
            uid: data.localId,
            email: data.email,
            displayName: name,
          },
        });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de l'inscription",
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email et mot de passe requis" });
      }

      // Utiliser l'API REST de Firebase pour la connexion
      const apiKey = process.env.FIREBASE_API_KEY;
      console.log("Tentative de connexion avec email:", email);

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(400).json({
          message: "Email ou mot de passe incorrect",
          details: data.error ? data.error.message : "Erreur de connexion",
        });
      }

      // Récupérer les informations utilisateur
      const userRecord = await admin.auth().getUser(data.localId);

      // Générer un JWT pour les cookies
      const token = jwt.sign(
        {
          userId: data.localId,
          email: data.email,
          name: userRecord.displayName || "",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      console.log(
        "Cookie being set with token:",
        token.substring(0, 20) + "..."
      );

      // Set token in cookie
      res
        .cookie("authToken", token, {
          httpOnly: true,
          secure: false, // Set to false for local development
          sameSite: "lax",
          path: "/",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json({
          success: true,
          message: "Connexion réussie",
          user: {
            uid: data.localId,
            email: data.email,
            displayName: userRecord.displayName || "",
          },
        });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la connexion", error: error.message });
    }
  }

  async logout(req, res) {
    try {
      const { uid } = req.body;

      if (uid) {
        await admin.auth().revokeRefreshTokens(uid);
      }

      // Clear the auth cookie
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      res.status(500).json({
        message: "Erreur lors de la déconnexion",
        error: error.message,
      });
    }
  }

  // Middleware pour vérifier le token Firebase
  async verifyToken(req, res, next) {
    console.log("Cookies received:", req.cookies);
    console.log("Auth header:", req.headers.authorization);

    // Vérifier d'abord dans les cookies
    const token = req.cookies.authToken;

    // Si pas de token dans les cookies, vérifier dans les headers (pour la compatibilité)
    const authHeader = req.headers.authorization;
    const headerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split("Bearer ")[1]
        : null;

    const finalToken = token || headerToken;

    if (!finalToken) {
      return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    try {
      // Si c'est un token JWT (cookie)
      if (token) {
        console.log("Verifying JWT token from cookie");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("JWT token verified successfully");
        return next();
      }

      // Si c'est un token Firebase (header)
      console.log("Verifying Firebase token from header");
      const decodedToken = await admin.auth().verifyIdToken(headerToken);
      req.user = decodedToken;
      console.log("Firebase token verified successfully");
      next();
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      res.status(401).json({
        message: "Non autorisé: token invalide",
        error: error.message,
      });
    }
  }
}

export default new AuthController();
