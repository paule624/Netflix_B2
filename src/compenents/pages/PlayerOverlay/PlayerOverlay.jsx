import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  fetchMovieVideos,
  fetchMovieCredits,
} from "../../../services/movieService";

const PlayerOverlay = ({ movie, onClose }) => {
  const [videoKey, setVideoKey] = useState(movie.key || "");
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!movie.key && movie.id) {
          // Log movie data for debugging
          console.log("Loading data for movie:", {
            id: movie.id,
            title: movie.original_title,
          });

          // Fetch videos
          const videoData = await fetchMovieVideos(movie.id, "fr-FR");
          console.log("Données vidéo reçues:", videoData);

          if (isMounted) {
            if (videoData.results?.length > 0) {
              setVideoKey(videoData.results[0].key);
            } else if (videoData.key) {
              setVideoKey(videoData.key);
            }
          }

          // Fetch cast
          const creditsData = await fetchMovieCredits(movie.id, "fr-FR");
          console.log("Données casting reçues:", creditsData);

          if (isMounted && creditsData.cast?.length > 0) {
            setCast(creditsData.cast.slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données du film:", err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMovieData();

    return () => {
      isMounted = false;
    };
  }, [movie]);

  // Le reste du composant reste inchangé
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-1000 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-lg max-w-[100%] max-h-[90%] overflow-y-auto text-center fixed"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2.5 right-2.5 bg-black text-xl cursor-pointer text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800 z-50"
          onClick={onClose}
        >
          ×
        </button>

        {loading ? (
          <div className="text-white p-10">Chargement...</div>
        ) : error ? (
          <div className="text-red-500 p-10">Erreur: {error}</div>
        ) : videoKey ? (
          <div className="relative w-[850px] h-[480px]">
            <iframe
              width="850px"
              height="480px"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=0&modestbranding=1&rel=0&disablekb=1`}
              title={movie.original_title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-xl"
            ></iframe>
            <div className="absolute inset-0"></div>{" "}
            {/* Superposition invisible */}
          </div>
        ) : (
          <p className="text-white p-10">Aucune vidéo disponible.</p>
        )}

        <div className="details flex text-left pl-4 text-white justify-between pt-2 pb-10">
          <div className="player_info flex-col items-center w-[70%]">
            <h2 className="text-2xl pb-4">
              {movie.original_title} -{" "}
              {movie.release_date &&
                !isNaN(new Date(movie.release_date)) &&
                new Intl.DateTimeFormat("fr-FR", {
                  year: "numeric",
                }).format(new Date(movie.release_date))}
            </h2>
            {movie.overview && (
              <p className="w-[500px] break-words text-2xls">
                {movie.overview}
              </p>
            )}
          </div>
          <div className="ad_information flex flex-col ml-4">
            <h3 className="font-semibold text-s">Casting principal</h3>
            {cast.length > 0 ? (
              <ul>
                {cast.map((actor) => (
                  <li key={actor.id}>
                    {actor.name} → {actor.character}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune information sur les acteurs.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PlayerOverlay.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    original_title: PropTypes.string,
    key: PropTypes.string,
    release_date: PropTypes.string,
    overview: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PlayerOverlay;
