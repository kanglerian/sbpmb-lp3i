import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faCircleDot,
  faPlus,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import LogoLP3IPutih from "../assets/logo-lp3i-putih.svg";
import ServerError from "./errors/ServerError";
import LoadingScreen from "./LoadingScreen";

import DattebayoSound from '../assets/sounds/dattebayo.mp3'

const Scholarship = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Loading...",
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const [errorPage, setErrorPage] = useState(false);

  const [categories, setCategories] = useState([]);
  const [histories, setHistories] = useState([]);

  const getInfo = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("LP3ISBPMB:token");
      if (!token) {
        return navigate("/");
      }
      const decoded = jwtDecode(token);
      setUser(decoded.data);
      getHistories(decoded.data.identity);
      const fetchProfile = async (token) => {
        const response = await axios.get(
          "https://api.politekniklp3i-tasikmalaya.ac.id/pmb/profiles/v1",
          {
            headers: { Authorization: token },
            withCredentials: true,
          }
        );
        return response.data;
      };
      try {
        const profileData = await fetchProfile(token);
        if(!profileData.validate.validate_files){
          navigate('/dashboard');
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (profileError) {
        if (profileError.response && profileError.response.status === 403) {
          try {
            const response = await axios.get(
              "https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/token/v3",
              {
                withCredentials: true,
              }
            );
            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem("LP3ISBPMB:token", newToken);
            setUser(decodedNewToken.data);
            const newProfileData = await fetchProfile(newToken);
            if(!newProfileData.validate.validate_files){
              navigate('/dashboard');
            }
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          } catch (error) {
            console.error("Error refreshing token or fetching profile:", error);
            if (error.response && error.response.status === 400) {
              localStorage.removeItem("LP3ISBPMB:token");
            } else {
              setErrorPage(true);
            }
          }
        } else {
          console.error("Error fetching profile:", profileError);
          setErrorPage(true);
        }
      }
    } catch (error) {
      if (error.response) {
        if ([400, 403].includes(error.response.status)) {
          localStorage.removeItem("LP3ISBPMB:token");
          navigate("/login");
        } else {
          console.error("Unexpected HTTP error:", error);
        }
      } else if (error.request) {
        console.error("Network error:", error);
      } else {
        console.error("Error:", error);
        setErrorPage(true);
      }
      navigate("/login");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      identity_user: user.identity,
      name: e.target.elements.name.value,
      level: e.target.elements.level.value,
      year: e.target.elements.year.value,
      result: e.target.elements.result.value
    }
    await axios
      .post(`https://api.politekniklp3i-tasikmalaya.ac.id/pmb/achievements`, data)
      .then((response) => {
        alert(response.data.message);
        setModal(false);
        getInfo();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getHistories = async (identity) => {
    try {
      const categoriesResponse = await axios.get(
        `https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/categories`
      );
      const historiesResponse = await axios.get(
        `https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/histories?identity_user=${identity}`
      );
      const filterResponse = categoriesResponse.data.filter(
        (question) =>
          !historiesResponse.data.some(
            (record) => record.category_id === question.id
          )
      );
      if (filterResponse.length > 0) {
        setCategories(filterResponse);
      } else {
        setCategories([]);
      }
      setHistories(historiesResponse.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const dattebayoPlay = () => {
    let audio = new Audio(DattebayoSound);
    audio.play();
  }

  const handleSelect = async (id) => {
    await axios
      .post(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/histories`, {
        identity_user: user.identity,
        category_id: id,
      })
      .then(() => {
        navigate("/seleksi-beasiswa", { state: { id: id } });
        dattebayoPlay();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getInfo();
  }, []);

  return errorPage ? (
    <ServerError />
  ) : loading ? (
    <LoadingScreen />
  ) : (
    <main className="flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 py-10 px-5 h-screen">
      <div className="max-w-5xl w-full mx-auto shadow-xl">
        <header className="grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl">
          <Link
            to={"/dashboard"}
            className="text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Kembali</span>
          </Link>
          <h2 className="text-white text-center font-bold space-x-2">
            <FontAwesomeIcon icon={faCircleDot} />
            <span>Soal Ujian - CAT</span>
          </h2>
          <div className="flex justify-center md:justify-end">
            <img src={LogoLP3IPutih} alt="" width={150} />
          </div>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white px-8 py-10 rounded-b-2xl">
          {histories.length > 0 &&
            histories.map((history) => (
              <button type="button" key={history.id} className="bg-emerald-500 hover:bg-emerald-600 transition-all ease-in-out py-8 px-4 rounded-2xl space-x-2">
                <span className="text-white text-sm">Kemampuan Analisa</span>
                <FontAwesomeIcon icon={faCheckCircle} className="text-white" />
              </button>
            ))}
          {categories.length > 0 &&
            categories.map((category) => (
              <button onClick={() => handleSelect(category.id)} type="button" key={category.id} className="bg-red-500 hover:bg-red-600 transition-all ease-in-out py-8 px-4 rounded-2xl space-x-2">
                <span className="text-white text-sm">{category.name}</span>
                <FontAwesomeIcon icon={faXmarkCircle} className="text-white" />
              </button>
            ))}
        </section>
      </div>

      {
        modal &&
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md bg-white rounded-3xl">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Tambah Prestasi
              </h3>
              <button
                onClick={() => setModal(false)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            {/* Modal body */}
            <form onSubmit={handleSubmit} className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Nama kegiatan
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full px-3.5 py-2.5"
                    placeholder="Nama kegiatan"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="year"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Tahun
                  </label>
                  <input
                    type="date"
                    name="year"
                    id="year"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full px-3.5 py-2.5"
                    placeholder="Tahun"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="level"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Tingkat
                  </label>
                  <select id="level" name="level" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-lp3i-100 focus:border-lp3i-200 block w-full px-3 py-2.5">
                    <option selected>Pilih tingkat</option>
                    <option value="International">International</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Kota / Kabupaten">Kota / Kabupaten</option>
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Desa / Kelurahan">Desa / Kelurahan</option>
                    <option value="Sekolah">Sekolah</option>
                    <option value="Jurusan">Jurusan</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="result"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Hasil
                  </label>
                  <input
                    type="text"
                    name="result"
                    id="result"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full px-3.5 py-2.5"
                    placeholder="Hasil"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-lp3i-100 hover:bg-lp3i-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-sm px-3.5 py-2.5 space-x-2 text-center"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Tambahkan</span>
              </button>
            </form>
          </div>
        </div>
      }
    </main>
  );
};

export default Scholarship;
