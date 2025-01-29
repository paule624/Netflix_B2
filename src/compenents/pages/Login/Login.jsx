/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import "./Login.css";
import { login, signup } from "../../../firebase";
import netflix_spinner from "../../../assets/netflix_spinner.gif";

const Login = () => {
  const [signState, setSignState] = useState("Se connecter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (signState === "Se connecter") {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
    setLoading(false);
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
            />
          ) : (
            <></>
          )}
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Email"
            className="w-full"
          />
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Mot de passe"
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-[#e50914] mt-2.5 outline-0 p-4 text-white rounded-sm border-0 text-xl font-medium cursor-pointer"
          >
            {signState}
          </button>
          <div
            className="form_help flex items-center
 justify-between text-[#b3b3b3] text-sm"
          >
            <div className="remember flex items-center gap-1">
              <input type="checkbox" className="w-4 h-4" />
              <p className="">Se souvenir de moi</p>
            </div>
            <p>Besoin d&#39;aide ?</p>
          </div>
        </form>
        <div className="form_switch mt-10 text-[#737373]">
          {signState === "Se connecter" ? (
            <p>
              Nouveau sur Netflix ?
              <span
                onClick={() => setSignState("S'inscrire")}
                className="ml-1.5 text-white font-medium cursor-pointer"
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
                className="ml-1.5 text-white font-medium cursor-pointer"
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
