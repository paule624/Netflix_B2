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
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDI3OWY4MmIyZmE1NDBlNWY3NTgwYmQyZmM5ZmNhNiIsIm5iZiI6MTczNjkyNzg5OS4wODA5OTk5LCJzdWIiOiI2Nzg3NmE5YmJkMzk1NWIyNDY3YjA4ODMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JiCq0k__RxTT2tDB_d-phOEbBn9ku0zpIxNJVAATVyA",
    },
  };
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=fr-FR`,
      options
    )
      .then((res) => res.json())
      .then((res) => setApiData(res.results[0]))
      .catch((err) => console.error(err));
  }, []);

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
