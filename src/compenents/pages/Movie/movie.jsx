import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import { toast } from "react-toastify";
import PlayerOverlay from "../PlayerOverlay/PlayerOverlay";
import { fetchMovieGenres } from "../../../services/movieService";

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showGenres, setShowGenres] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMoviesAndGenres = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch trending movies
        const trendingResponse = await fetch(
          `${API_URL}/api/trending?langue=fr-FR`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!trendingResponse.ok) {
          throw new Error(
            `Erreur lors de la récupération des films: ${trendingResponse.status}`
          );
        }

        const trendingData = await trendingResponse.json();
        console.log("Données films tendances reçues:", trendingData);

        // Fetch genres
        const genresData = await fetchMovieGenres("fr-FR");
        console.log("Données genres reçues:", genresData);

        // Set state with fetched data
        if (trendingData.results) {
          setMovies(trendingData.results);
          setFilteredMovies(trendingData.results);
        } else {
          setMovies([]);
          setFilteredMovies([]);
        }

        if (genresData.genres) {
          setGenres(genresData.genres);
        } else {
          setGenres([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError(error.message);
        toast.error("Erreur lors du chargement des films");
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesAndGenres();
  }, [API_URL]);

  // Applique un filtre en fonction du genre sélectionné
  const applyGenreFilter = (genreId) => {
    if (genreId === "all") {
      setFilteredMovies(movies); // Réaffiche tous les films
    } else {
      const filtered = movies.filter(
        (movie) =>
          movie.genre_ids && movie.genre_ids.includes(parseInt(genreId))
      );
      setFilteredMovies(filtered);
    }
    setShowGenres(false); // Cache le menu après sélection
  };

  // Fonction pour ouvrir l'overlay avec le film sélectionné
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  // Fonction pour fermer l'overlay
  const handleCloseOverlay = () => {
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <div className="movie-page pl-[6%]">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-white text-xl">Chargement des films...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-page pl-[6%]">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-xl">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-page pl-[6%]">
      <Navbar />
      <div className="block pt-20">
        {/* Menu des catégories */}
        <div className="relative inline-block group">
          <button
            className="bg-black text-white px-4 py-2 rounded-md border border-white/90 hover:underline"
            onMouseEnter={() => setShowGenres(true)}
            onMouseLeave={() => setShowGenres(false)}
          >
            Catégories
            <span className="ml-1 text-xs">▼</span>
          </button>

          {/* Liste des catégories */}
          {showGenres && (
            <div
              className="absolute left-0 w-100 bg-black/90 text-white rounded-md shadow-lg z-50 p-3"
              onMouseEnter={() => setShowGenres(true)}
              onMouseLeave={() => setShowGenres(false)}
            >
              <button
                onClick={() => applyGenreFilter("all")}
                className="block w-full px-4 py-2 text-left hover:underline font-bold"
              >
                Tous
              </button>

              <div className="grid grid-cols-3 gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => applyGenreFilter(genre.id)}
                    className="px-4 py-2 text-left hover:underline rounded-md"
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Affichage des films */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-5 gap-4 mt-5 place-items-center">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="card relative cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => handleMovieClick(movie)}
              >
                {movie.backdrop_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title || movie.name}
                    className="w-60 h-32 object-cover rounded-sm"
                  />
                ) : (
                  <div className="w-60 h-32 bg-gray-800 flex items-center justify-center rounded-sm">
                    <span className="text-white">Image non disponible</span>
                  </div>
                )}
                <p className="absolute bottom-2.5 right-2.5 text-white text-sm">
                  {movie.title || movie.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center text-white">
            <p>Aucun film ne correspond à ces critères</p>
          </div>
        )}
      </div>

      {selectedMovie && (
        <PlayerOverlay movie={selectedMovie} onClose={handleCloseOverlay} />
      )}
    </div>
  );
};

export default Movie;
