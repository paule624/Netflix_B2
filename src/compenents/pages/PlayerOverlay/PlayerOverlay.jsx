import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const PlayerOverlay = ({ movie, onClose }) => {
  const [videoKey, setVideoKey] = useState(movie.key || "");
  const [cast, setCast] = useState([]); // ✅ Stocker les acteurs

  useEffect(() => {
    if (!movie.key && movie.id) {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDI3OWY4MmIyZmE1NDBlNWY3NTgwYmQyZmM5ZmNhNiIsIm5iZiI6MTczNjkyNzg5OS4wODA5OTk5LCJzdWIiOiI2Nzg3NmE5YmJkMzk1NWIyNDY3YjA4ODMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JiCq0k__RxTT2tDB_d-phOEbBn9ku0zpIxNJVAATVyA",
        },
      };

      // Fetch de la vidéo
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=fr-FR`,
        options
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.results?.length > 0) {
            setVideoKey(data.results[0].key);
          }
        })
        .catch((err) => console.error("Erreur récupération vidéo:", err));

      // Fetch casting
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?language=fr-FR`,
        options
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.cast?.length > 0) {
            setCast(data.cast.slice(0, 5));
          }
        })
        .catch((err) => console.error("Erreur récupération cast:", err));
    }
  }, [movie]);

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

        {videoKey ? (
          <div className="relative">
            <iframe
              width="850px"
              height="480px"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&fs=0&origin=${window.location.origin}&enablejsapi=1`}
              title={movie.original_title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              className="pointer-events-none select-none rounded-xl"
              style={{
                position: "relative",
                zIndex: 1,
              }}
            ></iframe>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "transparent",
                zIndex: 2,
              }}
            />
          </div>
        ) : (
          <p className="text-white">Aucune vidéo disponible.</p>
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
