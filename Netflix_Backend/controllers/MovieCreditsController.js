import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Récupérer les crédits d'un film
class MovieCredits {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseUrl = "https://api.themoviedb.org/3";
    this.headers = {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    };

    this.getMovieCredits = this.getMovieCredits.bind(this);
  }

  async getMovieCredits(req, res) {
    try {
      const { id } = req.params;
      const { langue = "fr-FR" } = req.query;

      // Construire l'URL complète
      const url = `${this.baseUrl}/movie/${id}/credits?language=${langue}`;

      const reponse = await axios.get(url, { headers: this.headers });

      res.json(reponse.data);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des crédits du film ${req.params.id}:`,
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
        message: "Erreur lors de la récupération des crédits du film",
        error: error.message,
      });
    }
  }
}

export default new MovieCredits();
