import { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import hero_banner from "../../../assets/cards/Kunfu_panda_hero_img.jpg";
import hero_title from "../../../assets/cards/kunfu_panda_hero_title.png";
import TitleCards from "../../TitleCards/TitleCards";
import "./Home.css";
import Footer from "../../Footer/Footer";
import play_icon from "../../../assets/play_icon.png";
import info_icon from "../../../assets/info_icon.png";
import TitleCardsHero from "../../TitleCards_hero/TitleCards_hero";
import PlayerOverlay from "../../pages/PlayerOverlay/PlayerOverlay";
import { fetchWithAuth } from "../../../services/auth";

const Home = () => {
  // État pour stocker le film sélectionné (détails pour l'overlay)
  const [selectedMovie, setSelectedMovie] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    Promise.all([
      fetchWithAuth(
        `${API_URL}/movies/category?category=popular&page=1&langue=fr-FR`
      ),
      fetchWithAuth(
        `${API_URL}/movies/category?category=top_rated&page=1&langue=fr-FR`
      ),
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(([popularData, topRatedData]) => {
        // Handle both responses here
        console.log("Popular movies:", popularData);
        console.log("Top rated movies:", topRatedData);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [API_URL]);

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
              Po, un panda passionné d&apos;arts martiaux, découvre qu&apos;il
              est l&apos;élu d&apos;une ancienne prophétie. Malgré son manque
              d&apos;expérience, il doit s&apos;entraîner auprès des Cinq
              Cyclones et du maître Shifu pour affronter un redoutable ennemi
              qui menace la vallée de la Paix.
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
            <TitleCardsHero
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
          category={"now_playing"}
          setSelectedMovie={setSelectedMovie}
        />
        <TitleCards
          title={"À venir"}
          category={"upcoming"}
          setSelectedMovie={setSelectedMovie}
        />
        <TitleCards
          title={"Sélections principales pour vous"}
          category={"popular"}
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
