import React from "react";
import logoLP3I from "../assets/logo/lp3i.svg";
import logoGlobal from "../assets/logo/kampusglobalmandiri.png";
import tagline from "../assets/logo/tagline-warna.svg";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="container mx-auto py-5 px-5">
      <div className="flex flex-row items-center">
        <div className="flex flex-wrap items-center gap-5">
          <Link to={`/`}>
            <img src={logoLP3I} className="w-48" />
          </Link>
          <img src={logoGlobal} className="w-36" />
          <img src={tagline} className="w-36" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
