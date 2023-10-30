import React, { useEffect, useState } from "react";
import logoLP3I from "../assets/logo/lp3i.svg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import checkExpiry from "../config/checkExpiry.js";

const Navigation = () => {
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
          localStorage.removeItem("expiry");
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
    <div className="container mx-auto">
      <nav className="flex flex-col md:flex-row items-center justify-between p-5">
        <div>
          <Link to={`/`}>
            <img src={logoLP3I} alt="" className="w-48" />
          </Link>
        </div>
        <ul className="flex overflow-x-auto items-center gap-5 text-sm">
          <li>
            <Link to={`/biodata`}>Biodata</Link>
          </li>
          <li>
            <Link to={`/programstudi`}>Program Studi</Link>
          </li>
          <li>
            <Link to={`/keluarga`}>Keluarga</Link>
          </li>
          <li>
          <Link to={`/prestasi`}>Prestasi</Link>
          </li>
          <li>
          <Link to={`/organisasi`}>Pengalaman Organisasi</Link>
          </li>
          <li>
          <Link to={`/berkas`}>Upload Berkas</Link>
          </li>
          <li className="border border-gray-300 px-4 py-1 rounded-lg">
            {student.name}
          </li>
          <li>
            <button onClick={logoutHandler}>Keluar</button>
          </li>
        </ul>
      </nav>
      <hr />
    </div>
  );
};

export default Navigation;
