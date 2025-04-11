/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Home from "./compenents/pages/Home/Home";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./compenents/pages/Login/Login.jsx";
import Player from "./compenents/pages/Player/Player";
import { auth } from "./services/auth";
import { ToastContainer, toast } from "react-toastify";
import Movie from "./compenents/pages/Movie/Movie";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const isAuth = await auth.isAuthenticated();
        console.log("État d'authentification:", isAuth);
        setIsAuthenticated(isAuth);

        // Only redirect if we're not already on the correct page
        if (isAuth && window.location.pathname === "/login") {
          navigate("/");
        } else if (!isAuth && window.location.pathname !== "/login") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Erreur de vérification auth:", error);
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/player/:id"
          element={isAuthenticated ? <Player /> : <Navigate to="/login" />}
        />
        <Route
          path="/movie"
          element={isAuthenticated ? <Movie /> : <Navigate to="/login" />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
