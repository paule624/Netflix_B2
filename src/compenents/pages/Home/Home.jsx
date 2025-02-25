/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "../../Navbar/Navbar";
import hero_banner from "../../../assets/hero_banner.jpg";
import hero_title from "../../../assets/hero_title.png";
import TitleCards from "../../TitleCards/TitleCards";
import "./Home.css";
import Footer from "../../Footer/Footer";
import play_icon from "../../../assets/play_icon.png";
import info_icon from "../../../assets/info_icon.png";
import TitleCards_hero from "../../TitleCards_hero/TitleCards_hero";
import PlayerOverlay from "../../pages/PlayerOverlay/PlayerOverlay";

const Home = () => {
  // État pour stocker le film sélectionné (détails pour l'overlay)
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="home">
      <Navbar />
      <div className="Hero">
        <div className="hero_all">
          <img
            src={hero_banner}
            alt="Hero Banner"
            className="banner_img w-full -z-10"
          />
          <div className="hero_caption">
            <img
              src={hero_title}
              alt="Hero Title"
              className="hero_caption_img"
            />
            <p className="pt-2.5 pb-2.5">
              Découvrant ses liens avec un ordre ancien secret, un jeune homme
              vivant dans le Istanbul moderne se lance dans une quête pour
              sauver la ville d&#39;un ennemi immortel.
            </p>
            <div className="hero_btn flex gap-2.5">
              <button className="btn hero_buttons_light">
                <img src={play_icon} alt="" className="w-6" />
                Play
              </button>
              <button className="btn hero_buttons_dark">
                <img src={info_icon} alt="" className="w-6" />
                Plus d&#39;info
              </button>
            </div>
            <TitleCards_hero
              setSelectedMovie={setSelectedMovie}
              className="cards_popular"
            />
          </div>
        </div>
      </div>

      <div className="more_cards">
        <TitleCards
          title={"Film à succès"}
          category={"top_rated"}
          setSelectedMovie={setSelectedMovie}
        />
        <TitleCards
          title={"Uniquement sur Netflix"}
          category={"popular"}
          setSelectedMovie={setSelectedMovie}
        />
        <TitleCards
          title={"À venir"}
          category={"upcoming"}
          setSelectedMovie={setSelectedMovie}
        />
        <TitleCards
          title={"Sélections principales pour vous"}
          category={"now_playing"}
          setSelectedMovie={setSelectedMovie}
        />
      </div>

      <Footer />

      {/* Affichage de l'overlay avec les détails du film */}
      {selectedMovie && (
        <PlayerOverlay
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Home;
