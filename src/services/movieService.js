import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchMoviesByCategory = async (
  category,
  page = 1,
  langue = "fr-FR"
) => {
  try {
    console.log("Fetching movies with:", {
      API_URL,
      category,
      page,
      langue,
    });

    const response = await fetch(
      `${API_URL}/api/movies/category?category=${category}&page=${page}&langue=${langue}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Log the response status and headers for debugging
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message;
      } catch {
        errorMessage = errorText;
      }
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    toast.error("Erreur lors du chargement des films");
    throw error;
  }
};

export const fetchMovieVideos = async (movieId, langue = "fr-FR") => {
  try {
    console.log(`Fetching videos for movie ID: ${movieId}`);

    const response = await fetch(
      `${API_URL}/api/movies/${movieId}/videos?langue=${langue}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Videos response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    throw error;
  }
};

export const fetchMovieCredits = async (movieId, langue = "fr-FR") => {
  try {
    console.log(`Fetching credits for movie ID: ${movieId}`);

    const response = await fetch(
      `${API_URL}/api/movies/${movieId}/credits?langue=${langue}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Credits response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw error;
  }
};

export const fetchMovieGenres = async (langue = "fr-FR") => {
  try {
    console.log("Fetching movie genres");

    const response = await fetch(`${API_URL}/api/genres?langue=${langue}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("Genres response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    throw error;
  }
};
