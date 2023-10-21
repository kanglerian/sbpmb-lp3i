import React, { useState, useEffect } from "react";
import logoLP3I from "../assets/logo/lp3i.svg";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import checkExpiry from "../config/checkExpiry.js";

const Navbar = () => {
  let location = useLocation();
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

  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to={`/dashboard`} className="flex items-center">
          <img
            src={logoLP3I}
            alt="Politeknik LP3I Kampus Tasikmalaya"
            width={200}
          />
        </Link>
        <button
          onClick={() => setOpen(!open)}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${open ? "" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="text-sm font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-6 md:mt-0 md:border-0 md:bg-white">
            <li>
              <Link
                to={`/dashboard`}
                className={`${
                  location.pathname == "/dashboard"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                } block py-2 pl-3 pr-4 rounded md:p-0`}
                aria-current="page"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={`/biodata`}
                className={`${
                  location.pathname == "/biodata"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                } block py-2 pl-3 pr-4 rounded md:p-0`}
              >
                Biodata
              </Link>
            </li>
            <li>
              <Link
                to={`/programstudi`}
                className={`${
                  location.pathname == "/programstudi"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                } block py-2 pl-3 pr-4 rounded md:p-0`}
              >
                Program Studi
              </Link>
            </li>
            <li>
              <Link
                to={`/keluarga`}
                className={`${
                  location.pathname == "/keluarga"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                } block py-2 pl-3 pr-4 rounded md:p-0`}
              >
                Keluarga
              </Link>
            </li>
            <li>
              <Link
                to={`/prestasi`}
                className={`${
                  location.pathname == "/prestasi"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                } block py-2 pl-3 pr-4 rounded md:p-0`}
              >
                Prestasi
              </Link>
            </li>
            <li>
              <Link
                to={`/organisasi`}
                className={`${
                  location.pathname == "/organisasi"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                } block py-2 pl-3 pr-4 rounded md:p-0`}
              >
                Organisasi
              </Link>
            </li>
            <li>
              <Link
                to={`/berkas`}
                className={`${
                  location.pathname == "/berkas"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                } block py-2 pl-3 pr-4 rounded md:p-0`}
              >
                Upload Berkas
              </Link>
            </li>
            <li>
              <span className="flex items-center block py-2 pl-3 space-x-2 pr-4 cursor-pointer text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                <i className="fa-solid fa-user"></i>
                {student.name ? (
                  <span>{student.name}</span>
                ) : (
                  <div className="max-w-sm animate-pulse">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24" />
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </span>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block py-2 pl-3 space-x-2 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
              >
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Keluar</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
