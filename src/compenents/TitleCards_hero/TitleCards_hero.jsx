/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import PlayerOverlay from "../pages/PlayerOverlay/PlayerOverlay";
import cards_data from "../../assets/cards/Cards_data";
import "./TitleCards_hero.css";
import { Link } from "react-router-dom";
// eslint-disable-next-line react/prop-types
const TitleCards_hero = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const cardsRef = useRef();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDI3OWY4MmIyZmE1NDBlNWY3NTgwYmQyZmM5ZmNhNiIsIm5iZiI6MTczNjkyNzg5OS4wODA5OTk5LCJzdWIiOiI2Nzg3NmE5YmJkMzk1NWIyNDY3YjA4ODMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JiCq0k__RxTT2tDB_d-phOEbBn9ku0zpIxNJVAATVyA",
    },
  };
  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${
        category ? category : "now_playing"
      }?language=fr-FR&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setApiData(res.results))
      .catch((err) => console.error(err));
    cardsRef.current.addEventListener("wheel", handleWheel);
  }, []);

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
