import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      <Navbar/>
      <section className="container mx-auto h-screen">
        <div>
          <h1>Dashboard</h1>
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
