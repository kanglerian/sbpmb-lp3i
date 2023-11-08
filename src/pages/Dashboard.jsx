import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../templates/Navbar.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
  }, []);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-5">
        <Navbar />
        <section>
          <p className="text-sm text-center text-gray-700">
            <span>Harap untuk lengkapi data diri anda dan upload berkas.</span>
            {" "}
            <Link to={`/biodata`} className="underline">
              Klik disini <i className="fa-solid fa-arrow-right-long ml-1"></i>
            </Link>
          </p>
          <p className="text-sm text-center text-gray-700">
            <span>Tes Seleksi Beasiswa</span>
            {" "}
            <Link to={`/seleksi-beasiswa`} className="underline">
              Klik disini <i className="fa-solid fa-arrow-right-long ml-1"></i>
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
