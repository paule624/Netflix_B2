import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./TitleCards_hero.css";
import { fetchMoviesByCategory } from "../../services/movieService";

const TitleCardsHero = ({ setSelectedMovie }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fetchMoviesByCategory("popular", 1, "fr-FR");
        console.log("Données reçues:", data);

        if (data.results) {
          setApiData(data.results);
        } else {
          setApiData(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
      }
    };

    fetchMovies();

    const currentRef = cardsRef.current;
    currentRef.addEventListener("wheel", handleWheel);

    return () => {
      currentRef.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="titleCardsHero">
      <h2 className="mb-2">Populaire sur Netflix</h2>
      <div className="card_list flex gap-2.5 overflow-x-scroll" ref={cardsRef}>
        {apiData.map((card, index) => {
          if (!card.backdrop_path) return null;

          return (
            <div
              key={index}
              className="card relative cursor-pointer"
              onClick={() => setSelectedMovie(card)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                alt={card.original_title}
                className="max-w-60 rounded-sm"
              />
              <p className="absolute bottom-2.5 right-2.5 text-white">
                {card.original_title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

TitleCardsHero.propTypes = {
  setSelectedMovie: PropTypes.func.isRequired,
};

export default TitleCardsHero;
