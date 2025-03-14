import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import { fetchWithAuth } from "../../../services/auth";
import PlayerOverlay from "../PlayerOverlay/PlayerOverlay";

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showGenres, setShowGenres] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    // Récupération des films tendances depuis votre backend
    fetchWithAuth("http://localhost:5001/api/trending?langue=fr-FR")
      .then((res) => res.json())
      .then((data) => {
        console.log("Données films tendances reçues:", data);
        if (data.results) {
          setMovies(data.results);
          setFilteredMovies(data.results);
        } else {
          setMovies(data);
          setFilteredMovies(data);
        }
      })
      .catch((err) => console.error("Erreur récupération films:", err));

    // Récupération des genres depuis votre backend
    fetchWithAuth("http://localhost:5001/api/genres?langue=fr-FR")
      .then((res) => res.json())
      .then((data) => {
        console.log("Données genres reçues:", data);
        if (data.genres) {
          setGenres(data.genres);
        } else {
          setGenres(data);
        }
      })
      .catch((err) => console.error("Erreur récupération genres:", err));
  }, []);

  // Applique un filtre en fonction du genre sélectionné
  const applyGenreFilter = (genreId) => {
    if (genreId === "all") {
      setFilteredMovies(movies); // Réaffiche tous les films
    } else {
      setFilteredMovies(
        movies.filter((movie) => movie.genre_ids?.includes(genreId))
      );
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
              className="absolute left-0  w-100 bg-black/90 text-white rounded-md shadow-lg z-50 p-3"
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
        <div className="grid grid-cols-5 gap-4 mt-5 place-items-center">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="card relative cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                alt={movie.title || movie.name}
                className="w-60 h-32 object-cover rounded-sm"
              />
              <p className="absolute bottom-2.5 right-2.5 text-white">
                {movie.title || movie.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedMovie && (
        <PlayerOverlay movie={selectedMovie} onClose={handleCloseOverlay} />
      )}
    </div>
  );
};

export default Movie;
