import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showGenres, setShowGenres] = useState(false);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDI3OWY4MmIyZmE1NDBlNWY3NTgwYmQyZmM5ZmNhNiIsIm5iZiI6MTczNjkyNzg5OS4wODA5OTk5LCJzdWIiOiI2Nzg3NmE5YmJkMzk1NWIyNDY3YjA4ODMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JiCq0k__RxTT2tDB_d-phOEbBn9ku0zpIxNJVAATVyA",
      },
    };

    // Récupération des films tendances
    fetch(
      "https://api.themoviedb.org/3/trending/all/day?language=fr-FR",
      options
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        setFilteredMovies(data.results);
      })
      .catch((err) => console.error("Erreur:", err));

    // Récupération des genres
    fetch(
      "https://api.themoviedb.org/3/genre/movie/list?language=fr-FR",
      options
    )
      .then((res) => res.json())
      .then((data) => setGenres(data.genres))
      .catch((err) => console.error("Erreur:", err));
  }, []);

  // Applique un filtre en fonction du genre sélectionné
  const applyGenreFilter = (genreId) => {
    if (genreId === "all") {
      setFilteredMovies(movies); // Réaffiche tous les films
    } else {
      setFilteredMovies(
        movies.filter((movie) => movie.genre_ids.includes(genreId))
      );
    }
    setShowGenres(false); // Cache le menu après sélection
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
            <div key={movie.id} className="card relative cursor-pointer">
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
    </div>
  );
};

export default Movie;
