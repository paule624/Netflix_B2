/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import Home from "./compenents/pages/Home/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./compenents/pages/Login/Login";
import Player from "./compenents/pages/Player/Player";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import Movie from "./compenents/pages/Movie/movie";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Connecté");
        navigate("/");
      } else {
        console.log("Deconnecté");
        navigate("login");
      }
    });
  }, []);

  return (
    <div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player />} />

        {/* Ajoute la route pour la page des films */}
        <Route path="/movie" element={<Movie />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
