/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";

// eslint-disable-next-line react/prop-types
const TitleCards = ({ title, category, setSelectedMovie }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    // Utiliser l'endpoint local au lieu de l'API TMDB directement
    const categoryParam = category || "popular";

    fetch(
      `http://localhost:5001/api/movies/category?category=${categoryParam}&page=1&langue=fr-FR`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Données reçues du backend:", data);
        // Vérifier si les données sont dans le même format que l'API TMDB
        if (data.results) {
          setApiData(data.results);
        } else {
          // Si le format est différent, adapter selon la structure de votre API
          setApiData(data);
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des films:", err);
      });

    const currentRef = cardsRef.current;
    currentRef.addEventListener("wheel", handleWheel);

    return () => {
      currentRef.removeEventListener("wheel", handleWheel);
    };
  }, [category]);

  return (
    <div className="titleCards">
      <h2 className="mb-2">{title || "Populaire sur Netflix"}</h2>
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

export default TitleCards;
