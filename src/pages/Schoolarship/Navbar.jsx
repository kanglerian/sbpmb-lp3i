import React, { useState, useEffect } from "react";
import logoLP3I from "../../assets/logo/lp3i.svg";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  let location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logoutHandler = async () => {
    await axios
      .post("https://database.politekniklp3i-tasikmalaya.ac.id/api/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        localStorage.removeItem("id");
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
  }, []);

  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pt-4 pb-2 px-2">
        <Link to={`/dashboard`} className="flex gap-3 items-center">
          <h2 className="font-bold text-xl">Schoolarship CAT - Online Test </h2>
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
          <i className="fa-solid fa-bars"></i>
        </button>
        <div
          className={`${open ? "" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="text-sm font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-6 md:mt-0 md:border-0 md:bg-white">
            <li>
              <button
                onClick={logoutHandler}
                className="block py-2 pl-3 space-x-2 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Keluar</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <hr className="mt-2 mb-5" />
    </nav>
  );
};

export default Navbar;
