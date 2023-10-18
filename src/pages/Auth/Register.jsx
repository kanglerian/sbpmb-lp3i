import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoLP3I from "../../assets/logo/lp3i.svg";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nisn, setNisn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name: name,
        nisn: nisn,
        email: email,
        phone: phone,
        school: school,
        password: password,
        password_confirmation: passwordConf,
      });
      console.log("Registration successful", response.data);
      return navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="bg-gray-50">
      <section className="flex flex-col container justify-center items-center mx-auto h-screen gap-5 p-5">
        <Link to={`/`}>
          <img src={logoLP3I} className="w-52" />
        </Link>
        <form
          onSubmit={handleRegister}
          className="w-full md:w-1/2 bg-white p-5 rounded-xl border border-gray-200 mx-auto"
        >
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Nama lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Isi dengan nama lengkap anda..."
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="nisn"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              NISN
            </label>
            <input
              type="number"
              id="nisn"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Isi dengan NISN anda..."
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="school"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Asal Sekolah
            </label>
            <input
              type="text"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Isi dengan nama sekolah anda..."
              required
            />
          </div>

          <div className="flex gap-5">
            <div className="w-full mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Isi dengan Email anda..."
                required
              />
            </div>
            <div className="w-full mb-5">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                No. Whatsapp
              </label>
              <input
                type="number"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Isi dengan No. Whatsapp anda..."
                required
              />
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-full mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Kata Sandi
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Kata sandi"
                required
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="password_confirmation"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                id="password_confirmation"
                value={passwordConf}
                onChange={(e) => setPasswordConf(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Konfirmasi kata sandi"
                required
              />
            </div>
          </div>
          <hr className="my-5" />
          <div className="flex flex-col md:flex-row items-center gap-5">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Daftar
            </button>
            <Link to={`/login`}>
              <button className="text-sm text-gray-600 underline">
                Sudah memiliki akun? Daftar disini.
              </button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;
