import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Récupérer les films par catégorie
class MoviesByCategory {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseUrl = process.env.BASE_URL;
    this.headers = {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    };

    this.getMoviesByCategory = this.getMoviesByCategory.bind(this);
  }

  async getMoviesByCategory(req, res) {
    try {
      const {
        category = "now_playing",
        page = 1,
        langue = "fr-FR",
      } = req.query;

      // Construire l'URL complète et la logger
      const url = `${this.baseUrl}/movie/${category}?language=${langue}&page=${page}`;

      const reponse = await axios.get(url, { headers: this.headers });

      res.json(reponse.data);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des films par catégorie ${
          req.query.category || "inconnue"
        }:`,
        error.message
      );

      // Afficher plus de détails sur l'erreur
      if (error.response) {
        console.error("Données d'erreur:", error.response.data);
        console.error("Statut d'erreur:", error.response.status);
      } else if (error.request) {
        console.error("Requête sans réponse:", error.request);
      }

      res.status(500).json({
        message: "Erreur lors de la récupération des films par catégorie",
        error: error.message,
      });
    }
  }
}

export default new MoviesByCategory();
