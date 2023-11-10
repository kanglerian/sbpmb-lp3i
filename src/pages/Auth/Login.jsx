import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoLP3I from "../../assets/logo/lp3i.svg";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [icon, setIcon] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    await axios
      .post(`https://database.politekniklp3i-tasikmalaya.ac.id/api/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      })
      .catch((error) => {
        if(error.response.status == 401){
          alert(error.response.data.message);
        } else {
          console.log(error);
        }
      });
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
          onSubmit={handleLogin}
          className="w-full md:w-1/3 bg-white p-5 rounded-xl border border-gray-200 mx-auto"
        >
          <div className="mb-5">
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
              placeholder="name@email.com"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Kata sandi
            </label>
            <div className="flex">
              <span
                onClick={() => setIcon(!icon)}
                className="inline-flex items-center px-3 text-sm text-gray-700 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md"
              >
                {icon ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </span>
              <input
                type={icon ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                placeholder="Kata Kunci"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Masuk
            </button>
            <Link to={`/register`}>
              <button className="text-sm text-gray-600 underline">
                Belum memiliki akun? Daftar disini.
              </button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;
