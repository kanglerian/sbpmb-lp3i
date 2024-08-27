import { useState, useEffect } from "react";
import logoLP3I from "../assets/logo/lp3i.svg";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  let location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("LP3ISBPMB:token");
  const id = localStorage.getItem("id");
  const timeLeft = localStorage.getItem("timeLeft");

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    if (id && timeLeft) {
      return navigate("/seleksi-beasiswa");
    }
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
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-xl md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div
          className={`${open ? "" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="text-sm font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-xl bg-gray-50 md:flex-row md:space-x-6 md:mt-0 md:border-0 md:bg-white">
            <li>
              <Link
                to={`/dashboard`}
                className={`${location.pathname == "/dashboard"
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
                className={`${location.pathname == "/biodata"
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
                className={`${location.pathname == "/programstudi"
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
                className={`${location.pathname == "/keluarga"
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
                className={`${location.pathname == "/prestasi"
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
                className={`${location.pathname == "/organisasi"
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
                className={`${location.pathname == "/berkas"
                  ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                  : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                  } block py-2 pl-3 pr-4 rounded md:p-0`}
              >
                Upload Berkas
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block py-2 pl-3 space-x-2 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
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
