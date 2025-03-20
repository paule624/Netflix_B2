/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import "./Login.css";
import netflix_spinner from "../../../assets/netflix_spinner.gif";
import { toast } from "react-toastify";
import { login, signup } from "../../../services/auth";

const Login = () => {
  const [signState, setSignState] = useState("Se connecter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (signState === "Se connecter") {
        console.log("Tentative de connexion avec email:", email);
        await login(email, password);
      } else {
        console.log("Tentative d'inscription avec email:", email);
        await signup(name, email, password);
      }
      // Rediriger vers la page d'accueil après connexion réussie
      window.location.href = "/";
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      // L'erreur est déjà affichée par toast dans les fonctions login/signup
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="login_spinner w-full h-screen flex items-center justify-center">
      <img src={netflix_spinner} alt="" className="w-14" />
    </div>
  ) : (
    <div className="login ">
      <img src={logo} className="login_logo w-36" alt="" />
      <div className="login_form max-w-md bg-black/75 rounded-sm p-16 m-auto">
        <h1 className="text-3xl font-medium mb-7 ">{signState}</h1>
        <form onSubmit={user_auth}>
          {signState === "S'inscrire" ? (
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              placeholder="Votre nom"
              className="w-full"
              autoComplete="name"
            />
          ) : null}
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Email"
            className="w-full"
            autoComplete="email"
          />
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Mot de passe"
            className="w-full"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="w-full bg-[#e50914] mt-2.5 outline-0 p-4 text-white rounded-sm border-0 text-xl font-medium cursor-pointer"
          >
            {signState}
          </button>
          <div className="form_help flex items-center justify-between text-[#b3b3b3] text-sm">
            <div className="remember flex items-center gap-1">
              <input type="checkbox" className="w-4 h-4" />
              <p className="">Se souvenir de moi</p>
            </div>
            <p className="cursor-pointer">Besoin d&#39;aide ?</p>
          </div>
        </form>
        <div className="form_switch mt-10 text-[#737373]">
          {signState === "Se connecter" ? (
            <p>
              Nouveau sur Netflix ?
              <span
                onClick={() => setSignState("S'inscrire")}
                className="ml-1.5 text-white font-medium cursor-pointer hover:underline"
              >
                {" "}
                S&#39;inscrire maintenant
              </span>
            </p>
          ) : (
            <p>
              Vous avez déjà un compte ?
              <span
                onClick={() => setSignState("Se connecter")}
                className="ml-1.5 text-white font-medium cursor-pointer hover:underline"
              >
                {" "}
                Connexion
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
