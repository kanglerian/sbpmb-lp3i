import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import checkExpiry from '../config/checkExpiry.js';

import logoLP3I from "../assets/logo/lp3i.svg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState([]);

  const token = localStorage.getItem("token");
  const identity = localStorage.getItem("identity");
  const getUser = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/user/get", {
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

  const logoutHandler = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post("http://127.0.0.1:8000/api/logout")
      .then(() => {
        localStorage.removeItem("identity");
        localStorage.removeItem("token");
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
    <section className="bg-gray-100">
      <div className="container mx-auto ">
        <nav className="flex flex-col md:flex-row items-center justify-between p-5">
          <div>
            <Link to={`/`}><img src={logoLP3I} alt="" className="w-48" /></Link>
          </div>
          <ul className="flex items-center gap-5 text-sm">
            <li>Biodata</li>
            <li>Keluarga</li>
            <li>Prestasi</li>
            <li>Upload Berkas</li>
            <li className="border border-gray-300 px-4 py-1 rounded-lg">{student.name}</li>
            <li>
              <button onClick={logoutHandler}>Keluar</button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Dashboard;
