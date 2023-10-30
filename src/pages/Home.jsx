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
          localStorage.removeItem("expiry");
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

<section class="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
    <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
        <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">We invest in the world’s potential</h1>
        <p class="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p>
        <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <a href="#" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                Get started
                <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
            <a href="#" class="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400">
                Learn more
            </a>  
        </div>
    </div>
</section>

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
