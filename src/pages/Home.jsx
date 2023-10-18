import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import LearningIllustration from "../assets/illustration/learning.svg";

const Home = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const token = localStorage.getItem("token");
  const identity = localStorage.getItem("identity");
  const getUser = async () => {
    await axios
      .get("https://database.politekniklp3i-tasikmalaya.ac.id/api/user/get", {
        params: {
          identity: identity,
          token: token,
        },
      })
      .then((res) => {
        setStudent(res.data.applicant);
      })
      .catch((err) => {
        if (err.message == "Request failed with status code 404") {
          localStorage.removeItem("identity");
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
  }, []);

  return (
    <div className="bg-slate-100 md:h-screen">
      <Navbar />
      <section className="container mx-auto px-5 mt-10 md:mt-0">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2">
            {student.identity && <p className="mb-5">Selamat datang, {student.name}</p>}
            <div className="space-y-2">
              <h1 className="font-bold text-4xl">SBPMB - LP3I 2024</h1>
              <h2 className="font-bold text-2xl">
                Program Beasiswa Yayasan Global Mandiri Utama
              </h2>
              <p>
                Mari berkarir di usia mudia hanya di Politeknik LP3I Kampus
                Tasikmalaya.
              </p>
            </div>
            {student.identity ? (
              <div className="flex items-center gap-2 mt-5">
                <Link to={`/dashboard`}>
                  <button className="cursor-pointer text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
                    Dashboard
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-5">
                <Link to={`/register`}>
                  <button className="cursor-pointer text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
                    Daftar
                  </button>
                </Link>
                <Link to={`/login`}>
                  <button className="cursor-pointer py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-300 hover:border-gray-400 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
                    Masuk
                  </button>
                </Link>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <img src={LearningIllustration} alt="" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
