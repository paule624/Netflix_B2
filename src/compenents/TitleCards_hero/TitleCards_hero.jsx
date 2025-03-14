/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import PlayerOverlay from "../pages/PlayerOverlay/PlayerOverlay";
import "./TitleCards_hero.css";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const TitleCards_hero = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    const categoryParam = category || "popular";

    fetch(
      `http://localhost:5001/api/movies/category?category=${categoryParam}&page=1&langue=fr-FR`
    )
      .then((res) => res.json())
      .then((data) => {
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

    cardsRef.current.addEventListener("wheel", handleWheel);

    // Nettoyage de l'event listener
    return () => {
      if (cardsRef.current) {
        const currentRef = cardsRef.current;
        if (currentRef) {
          currentRef.removeEventListener("wheel", handleWheel);
        }
      }
    };
  }, [category]);

  return (
    <div className="titleCards_hero">
      <h2 className="mb-2">{title ? title : "Populaire sur Netflix"}</h2>
      <div className="card_list flex gap-2.5 overflow-x-scroll" ref={cardsRef}>
        {apiData.map((card, index) => {
          return (
            <div
              className="card relative"
              key={index}
              onClick={() => setSelectedMovie(card)}
            >
              <img
                src={"https://image.tmdb.org/t/p/w500" + card.backdrop_path}
                alt=""
                className="max-w-60 cursor-pointer rounded-b-sm"
              />
              <p className="absolute bottom-2.5 right-2.5 no-underline text-white ">
                {card.original_title}
              </p>
            </div>
          );
        })}
      </div>
      {selectedMovie && (
        <PlayerOverlay
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default TitleCards_hero;
