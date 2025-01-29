/* eslint-disable no-unused-vars */
import React, { useRef, useEffect } from "react";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import "./Navbar.css";
import { use } from "react";
import { logout } from "../../firebase";

const Navbar = () => {
  const navRef = useRef();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add("nav_dark");
      } else {
        navRef.current.classList.remove("nav_dark");
      }
    });
  }, []);
  return (
    <div
      ref={navRef}
      className="navbar flex justify-around  text-sm color-e5e5e5 z-1 pt-5 custom-bg-navbar pb-4"
    >
      {/* Section gauche */}
      <div className="flex center gap-20">
        <img src={logo} alt="Netflix Logo" className="navbar-left-img" />
        <ul className="navbar-left-ul cursor-pointer items-center">
          <li>Home</li>
          <li>TV Shows</li>
          <li>Films</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Language</li>
        </ul>
      </div>

      {/* Section droite */}
      <div className="flex center gap-5 items-center">
        <img
          src={search_icon}
          alt="Search Icon"
          className="navbar-right-icons"
        />
        <p className="cursor-pointer">Enfant</p>
        <img src={bell_icon} alt="Bell Icon" className="navbar-right-icons" />
        <div className="navbar_profile relative">
          <img
            src={profile_img}
            alt="Profile"
            className="navbar-profile rounded-sm relative"
          />
          <img src={caret_icon} alt="Caret Icon" />
          <div className="dropdown">
            <p
              onClick={() => {
                logout();
              }}
              className="cursor-pointer hover:underline"
            >
              Déconnexion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
