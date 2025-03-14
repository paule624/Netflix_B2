import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Récupérer les films tendances
class TrendingMovies {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseUrl = process.env.BASE_URL;
    this.headers = {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    };

    this.getTrendingMovies = this.getTrendingMovies.bind(this);
  }

  async getTrendingMovies(req, res) {
    try {
      const { timeWindow = "day", langue = "fr-FR" } = req.query;

      // Construire l'URL complète
      const url = `${this.baseUrl}/trending/all/${timeWindow}?language=${langue}`;

      const reponse = await axios.get(url, { headers: this.headers });

      res.json(reponse.data);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des films tendances:`,
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
        message: "Erreur lors de la récupération des films tendances",
        error: error.message,
      });
    }
  }
}

export default new TrendingMovies();
