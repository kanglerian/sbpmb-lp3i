import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../templates/Navbar.jsx";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getUser = async () => {
    await axios
      .get("https://database.politekniklp3i-tasikmalaya.ac.id/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.applicant);
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.log(error);
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
    <section className="bg-white">
      <div className="container mx-auto px-5">
        <Navbar />
        <section className="space-y-2">
          <p className="text-sm text-center text-gray-700">
            <span>Harap untuk <span className="underline">lengkapi data diri anda dan upload berkas</span> untuk mengikuti Seleksi Beasiswa.</span>{" "}
          </p>
          <p className="text-sm text-center text-gray-700">
            Setelah melengkapi data, akan ada menu <span className="font-bold">E-Assessment.</span>{" "}
          </p>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
