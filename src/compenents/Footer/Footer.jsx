/* eslint-disable no-unused-vars */
import React from "react";
import youtube_icon from "../../assets/youtube_icon.png";
import twitter_icon from "../../assets/twitter_icon.png";
import instagram_icon from "../../assets/instagram_icon.png";
import facebook_icon from "../../assets/facebook_icon.png";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer py-[30px] px-[4%] max-w-5xl mx-auto my-0">
      <div className="footer_icons flex gap-5 mt-10 mb-10">
        <img src={facebook_icon} alt="" className="cursor-pointer w-7.5" />
        <img src={instagram_icon} alt="" className="cursor-pointer w-7.5" />
        <img src={twitter_icon} alt="" className="cursor-pointer w-7.5" />
        <img src={youtube_icon} alt="" className="cursor-pointer w-7.5" />
      </div>
      <ul className="grid grid-cols-4 auto-cols-auto gap-4 mb-8 list-none">
        <li>Audio Description</li>
        <li>Centre aide</li>
        <li>Cartes cadeaux</li>
        <li>Centre Media</li>
        <li>Relations investisseurs</li>
        <li>Job</li>
        <li>Conditions d&#39;utilisation</li>
        <li>Information legales</li>
        <li>Préférence cookies</li>
        <li>informations personelles</li>
        <li>Nous contacter</li>
      </ul>
      <p className="text-gray-500 text-sm">© 1997-2025 Netflix, Inc</p>
    </div>
  );
};

export default Footer;
