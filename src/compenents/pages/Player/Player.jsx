import { useEffect, useState } from "react";
import back_arrow_icon from "../../../assets/back_arrow_icon.png";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMovieVideos,
  fetchMovieCredits,
} from "../../../services/movieService";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoKey, setVideoKey] = useState("");
  const [movieData, setMovieData] = useState({});
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch videos
        const videoData = await fetchMovieVideos(id, "fr-FR");
        console.log("Données vidéo reçues:", videoData);

        if (isMounted) {
          if (videoData.results?.length > 0) {
            setVideoKey(videoData.results[0].key);
            setMovieData({
              name: videoData.results[0].name || "",
              published_at: videoData.results[0].published_at || "",
              type: videoData.results[0].type || "",
            });
          } else if (videoData.key) {
            setVideoKey(videoData.key);
            setMovieData({
              name: videoData.name || "",
              published_at: videoData.published_at || "",
              type: videoData.type || "",
            });
          }
        }

        // Fetch cast
        const creditsData = await fetchMovieCredits(id, "fr-FR");
        console.log("Données casting reçues:", creditsData);

        if (isMounted && creditsData.cast?.length > 0) {
          setCast(creditsData.cast.slice(0, 5));
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données du film:", err);
        if (isMounted) {
          setError(
            "Impossible de charger les données du film. Veuillez réessayer plus tard."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadMovieData();
    } else {
      setError("ID du film manquant");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="player h-[100vh] flex flex-col justify-center items-center bg-black">
      <img
        src={back_arrow_icon}
        alt="Retour"
        className="absolute top-5 left-5 w-12 cursor-pointer z-50"
        onClick={() => navigate(-1)}
      />

      {loading ? (
        <div className="text-white p-10 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Chargement de la vidéo...</p>
        </div>
      ) : error ? (
        <div className="text-white p-10 flex flex-col items-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            className="bg-white text-black px-4 py-2 rounded mt-4 hover:bg-gray-300"
            onClick={() => navigate(-1)}
          >
            Retourner à la page précédente
          </button>
        </div>
      ) : videoKey ? (
        <div className="relative w-[90%] h-[70%]">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
            title={movieData.name || movieData.title || "Vidéo"}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded-xl"
          ></iframe>
        </div>
      ) : (
        <div className="text-white p-10 flex flex-col items-center">
          <p className="text-xl mb-4">Aucune vidéo disponible pour ce film.</p>
          {movieData.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/w780${movieData.backdrop_path}`}
              alt={movieData.title || movieData.name}
              className="max-w-2xl rounded mb-4"
            />
          )}
          <button
            className="bg-white text-black px-4 py-2 rounded mt-4 hover:bg-gray-300"
            onClick={() => navigate(-1)}
          >
            Retourner à la page précédente
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="player_info flex flex-col w-[90%] text-white mt-6 px-4">
          <h2 className="text-2xl mb-2">
            {movieData.title || movieData.name || "Titre non disponible"}
          </h2>

          <div className="flex justify-between text-sm text-gray-400 mb-4">
            {movieData.published_at &&
              !isNaN(new Date(movieData.published_at)) && (
                <p>
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(movieData.published_at))}
                </p>
              )}

            {movieData.release_date &&
              !isNaN(new Date(movieData.release_date)) && (
                <p>
                  {new Intl.DateTimeFormat("fr-FR", {
                    year: "numeric",
                  }).format(new Date(movieData.release_date))}
                </p>
              )}

            {movieData.type && <p>Type: {movieData.type}</p>}
          </div>

          {movieData.overview && (
            <p className="text-gray-300 mb-4">{movieData.overview}</p>
          )}

          {cast.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Casting principal</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {cast.map((actor) => (
                  <li key={actor.id} className="flex">
                    <span className="font-medium">{actor.name}</span>
                    <span className="mx-2">→</span>
                    <span>{actor.character}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Player;
