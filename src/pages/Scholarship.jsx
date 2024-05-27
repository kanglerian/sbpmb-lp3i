import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../templates/Navbar.jsx";
import Loading from "../components/Loading.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { useNavigate } from "react-router-dom";

import DattebayoSound from '../assets/sounds/dattebayo.mp3'
const Scholarship = () => {
  const navigate = useNavigate();

  let start = true;

  const [loadingScreen, setLoadingScreen] = useState(true);
  const [loading, setLoading] = useState(false);

  const [identity, setIdentity] = useState(null);
  const [categories, setCategories] = useState([]);
  const [histories, setHistories] = useState([]);

  const [message, setMessage] = useState('Memuat kategori soal...');

  const token = localStorage.getItem("token");

  const dattebayoPlay = () => {
    let audio = new Audio(DattebayoSound);
    audio.play();
  }

  const getUser = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let identityVal = response.data.user.identity;
        setIdentity(identityVal);
        getHistories(identityVal);
        let applicant = response.data.applicant;
        let fileuploaded = response.data.fileuploaded;
        let foto = fileuploaded.find((file) => { return file.namefile == "foto" });
        let akta = fileuploaded.find((file) => { return file.namefile == "akta-kelahiran" });
        let keluarga = fileuploaded.find((file) => { return file.namefile == "kartu-keluarga" });
        if (start && applicant.nisn && applicant.name && applicant.religion && applicant.school && applicant.year && applicant.place_of_birth && applicant.date_of_birth && applicant.gender && applicant.address && applicant.email && applicant.phone && applicant.program && applicant.income_parent && applicant.father.name && applicant.father.date_of_birth && applicant.father.education && applicant.father.address && applicant.father.job && applicant.mother.name && applicant.mother.date_of_birth && applicant.mother.education && applicant.mother.address && applicant.mother.job && foto && akta && keluarga) {
          console.log('lengkap');
        } else {
          navigate('/dashboard');
        }
        setLoadingScreen(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.log(error);
        }
        setLoadingScreen(false);
      });
  };

  const getHistories = async (identity) => {
    try {
      const categoriesResponse = await axios.get(
        `https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/categories`
      );
      const historiesResponse = await axios.get(
        `https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/histories?identity_user=${identity}`
      );
      if (categoriesResponse.data && historiesResponse.data) {
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
        setMessage('Berikut ini adalah kategori soal yang harus dikerjakan.')
      } else {
        setMessage('Tidak ada kategori soal yang harus dikerjakan.')
      }
    } catch (error) {
      setMessage('Server tes beasiswa sedang tidak tersedia. Silahkan periksa kembali secara berkala.')
      console.log(error.message);
    }
  };

  const handleSelect = async (id) => {
    setLoading(true);
    await axios
      .post(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/histories`, {
        identity_user: identity,
        category_id: id,
      })
      .then((response) => {
        navigate("/seleksi-beasiswa", { state: { id: id } });
        setLoading(false);
        dattebayoPlay();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
  }, []);

  return (
    <section className="bg-white">
    { loadingScreen && <LoadingScreen/> }
      <div className="container mx-auto px-5">
        <Navbar />
        <section className="max-w-7xl mx-auto mt-10">
          <header className="flex flex-col justify-center text-center mb-2 space-y-1">
            <h2 className="flex justify-center items-center gap-2 text-gray-900 text-xl font-bold">Tes Seleksi Beasiswa {loading && <Loading width={5} height={5} fill="fill-sky-500" color="text-gray-200" />}</h2>
            <p className="text-sm text-gray-600">{message}</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {histories.length > 0 &&
              histories.map((history) => (
                <button key={history.id} className="p-2">
                  <div className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-lg text-sm">
                    <span className="mr-2">{history.category.name}</span>
                    <i className="fa-solid fa-circle-check text-white"></i>
                  </div>
                </button>
              ))}
            {categories.length > 0 &&
              categories.map((category) => (
                <button
                  onClick={() => handleSelect(category.id)}
                  key={category.id}
                  className="p-2"
                  disabled={loading}
                >
                  <div className="cursor-pointer bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg text-sm">
                    <span className="mr-2">{category.name}</span>
                    <i className="fa-solid fa-circle-xmark text-white"></i>
                  </div>
                </button>
              ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Scholarship;
