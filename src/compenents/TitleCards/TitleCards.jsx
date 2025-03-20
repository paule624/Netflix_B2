/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./TitleCards.css";
import { fetchMoviesByCategory } from "../../services/movieService";

const TitleCards = ({ title, category, setSelectedMovie }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const categoryParam = category || "popular";
        const data = await fetchMoviesByCategory(categoryParam, 1, "fr-FR");
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
  }, [category]);

  return (
    <div className="titleCards">
      <h2 className="mb-2">{title}</h2>
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
                alt={card.original_title || card.title || card.name}
                className="max-w-60 rounded-sm"
              />
              <p className="absolute bottom-2.5 right-2.5 text-white">
                {card.original_title || card.title || card.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

TitleCards.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string,
  setSelectedMovie: PropTypes.func.isRequired,
};

export default TitleCards;
