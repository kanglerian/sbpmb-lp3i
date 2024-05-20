import React, { useEffect } from "react";
import logoLP3I from "../../assets/logo/logo-child.svg";
import { Link, useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
  }, []);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pt-4 pb-2 px-2">
        <Link to={`/dashboard`} className="flex gap-5 items-center">
          <img src={logoLP3I} alt="" className="h-[55px]" />
          <div>
            <h2 className="font-bold text-xl text-[#00426D]">E-Assessment</h2>
            <p className="text-sm text-gray-800">Seleksi Beasiswa Penerimaan Mahasiswa Baru</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="bg-gray-100 px-4 py-2 rounded-xl">
            {props.timeleft}
          </span>
        </div>
      </div>
      <hr className="mt-2 mb-5" />
    </nav>
  );
};

export default Navbar;
