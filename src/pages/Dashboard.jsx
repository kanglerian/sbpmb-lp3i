import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import checkExpiry from '../config/checkExpiry.js';
import Navbar from "../templates/Navbar.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState([]);

  const token = localStorage.getItem("token");
  const identity = localStorage.getItem("identity");
  const getUser = async () => {
    await axios
      .get("https://pmb.politekniklp3i-tasikmalaya.ac.id/api/user/get", {
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

  const logoutHandler = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post("https://pmb.politekniklp3i-tasikmalaya.ac.id/api/logout")
      .then(() => {
        localStorage.removeItem("identity");
        localStorage.removeItem("token");
        localStorage.removeItem("expiry");
        navigate("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
    checkExpiry();
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
