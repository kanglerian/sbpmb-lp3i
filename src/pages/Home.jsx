import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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
      className="bg-center bg-no-repeat md:h-screen bg-cover bg-gray-800 bg-blend-multiply"
      style={{ backgroundImage: `url(${DroneBackground})` }}
    >
      <div className="flex flex-col items-center justify-between gap-10 md:h-screen py-5">
        <header className="flex flex-wrap justify-center items-center gap-5">
          <img src={LP3IPutih} alt="" width={140} />
          <img src={Tagline} alt="" width={135} />
          <img src={KampusMandiriPutih} alt="" width={135} />
        </header>
        <div className="space-y-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl uppercase">
            Gebyar Beasiswa<br />Politeknik LP3I Se-Indonesia
          </h1>
          <div className="max-w-5xl mx-auto space-y-1">
            <h4 className="text-xl md:text-3xl text-white font-bold">Global Mandiri Utama Foundation</h4>
            <p className="text-sm md:text-base font-normal text-gray-300 md:text-lg">
              Temukan langkah terbaik untuk meraih impianmu! Bergabunglah dengan
              Politeknik LP3I Kampus Tasikmalaya dan jadilah bagian dari perubahan
              yang lebih baik.
            </p>
          </div>
          <ul className="flex flex-wrap justify-center items-center gap-5 text-sm md:text-base list-disc">
            <li className="text-amber-300">Prestasi Bidang Akademik</li>
            <li className="text-white">Prestasi Bidang Non Akademik</li>
            <li className="text-amber-300">Prestasi Ranking 1 - 5</li>
            <li className="text-white">Prestasi Hafidz Quran 5 - 30 Juz</li>
            <li className="text-amber-300">Prestasi Atlet</li>
            <li className="text-white">Putra/i TNI/POLRI/ASN/Guru</li>
          </ul>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-5 text-sm md:text-base text-white">
            <div className="flex flex-col items-center justify-center border border-gray-100 p-4 rounded-xl">
              <p className="flex flex-col items-center justify-center">
                <span>Dapatkan</span>
                <span>Beasiswa Pendidikan s.d 100%</span>
                <span className="font-italic text-xs">*Syarat dan ketentuan berlaku</span>
              </p>
            </div>
            <div className="flex flex-col items-center justify-center border border-gray-100 p-4 rounded-xl">
              <p className="flex flex-col items-center justify-center">
                <span>Periode Pendaftaran</span>
                <span>22 Mei - 2 Juni 2024</span>
              </p>
            </div>
          </section>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link to={`/register`}>
              <button
                type="button"
                className="w-1/2 md:w-full md:inline-flex justify-center items-center py-3 px-5 text-sm md:text-base font-medium text-center text-white rounded-xl bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
              >
                Daftar Sekarang
                <i className="fa-solid fa-arrow-right-long ml-2"></i>
              </button>
            </Link>
            <Link to={`/login`}>
              <button
                type="button"
                className="w-1/2 md:w-full md:inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 text-sm md:text-base font-medium text-center text-white rounded-xl border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
              >
                Masuk
              </button>
            </Link>
          </div>
        </div>
        <footer>
          <p className="text-white text-xs">
            Copyright © 2024 Politeknik LP3I Kampus Tasikmalaya
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Home;
