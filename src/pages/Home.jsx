import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import DroneBackground from "../assets/image/drone-background.jpeg";
import Tagline from "../assets/logo/tagline-putih.svg";
import LP3IPutih from "../assets/logo/logo-lp3i-putih.svg";
import KampusMandiriPutih from "../assets/logo/kampusmandiri-putih.png";

const Home = () => {
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  return (
    <section
      className="bg-center bg-no-repeat h-screen bg-cover bg-gray-700 bg-blend-multiply"
      style={{ backgroundImage: `url(${DroneBackground})` }}
    >
      <div className="flex flex-col items-center justify-between h-screen py-5">
        <header className="flex flex-wrap justify-center items-center gap-5">
          <img src={LP3IPutih} alt="" width={150} />
          <img src={Tagline} alt="" width={150} />
          <img src={KampusMandiriPutih} alt="" width={150} />
        </header>
        <div className="px-4 mx-auto max-w-screen-xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            Program Beasiswa
            <br />
            Yayasan Global Mandiri Utama
          </h1>
          <p className="mb-8 text-base font-normal text-gray-300 md:text-lg sm:px-16 lg:px-48">
            Temukan langkah terbaik untuk meraih impianmu! Bergabunglah dengan
            Politeknik LP3I Kampus Tasikmalaya dan jadilah bagian dari perubahan
            yang lebih baik.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link to={`/register`}>
              <button
                type="button"
                className="w-1/2 md:w-full md:inline-flex justify-center items-center py-3 px-5 text-sm md:text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
              >
                Daftar Sekarang
                <i className="fa-solid fa-arrow-right-long ml-2"></i>
              </button>
            </Link>
            <Link to={`/login`}>
              <button
                type="button"
                className="w-1/2 md:w-full md:inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 text-sm md:text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
              >
                Masuk
              </button>
            </Link>
          </div>
        </div>
        <footer>
          <p className="text-white text-xs">
            Copyright © 2023 Politeknik LP3I Kampus Tasikmalaya
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Home;
