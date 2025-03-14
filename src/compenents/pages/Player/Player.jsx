/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import back_arrow_icon from "../../../assets/back_arrow_icon.png";
import { useParams, useNavigate } from "react-router-dom";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    typeof: "",
  });

  useEffect(() => {
    // Utiliser l'endpoint local au lieu de l'API TMDB directement
    fetch(`http://localhost:5001/api/movies/${id}/videos?langue=fr-FR`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Données vidéo reçues:", data);
        if (data.results?.length > 0) {
          setApiData(data.results[0]);
        } else if (data.key) {
          // Si l'API renvoie directement la clé
          setApiData(data);
        }
      })
      .catch((err) => console.error("Erreur récupération vidéo:", err));
  }, [id]);

  return (
    <div className="player h-[100vh] flex flex-col justify-center items-center ">
      <img
        src={back_arrow_icon}
        alt=""
        className="absolute top-5 left-5 w-12 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <iframe
        width="90%"
        height="90%"
        src={`https://www.youtube.com/embed/${apiData.key}`}
        title="trailer frameBorder='0' allowFullscreen"
        className="rounded-xl"
      ></iframe>
      <div className="player_info flex items-center justify-between w-[90%]">
        <p>
          {apiData.published_at &&
            !isNaN(new Date(apiData.published_at)) &&
            new Intl.DateTimeFormat("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(apiData.published_at))}
        </p>

        <p>{apiData.name}</p>
        <p>{apiData.typeof}</p>
      </div>
    </div>
  );
};

export default Player;
