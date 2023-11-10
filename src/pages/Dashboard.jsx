import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../templates/Navbar.jsx";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [identity, setIdentity] = useState(null);
  const [categories, setCategories] = useState([]);
  const [histories, setHistories] = useState([]);

  const getUser = async () => {
    await axios
      .get("https://database.politekniklp3i-tasikmalaya.ac.id/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let identityVal = response.data.user.identity;
        setIdentity(identityVal);
        getHistories(identityVal);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.log(error);
        }
      });
  };

  const getHistories = async (identity) => {
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
    } else {
      console.log("tidak ada");
    }
  };

  const handleSelect = async (id) => {
    await axios
      .post(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/histories`, {
        identity_user: identity,
        category_id: id,
      })
      .then((response) => {
        navigate("/seleksi-beasiswa", { state: { id: id } });
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
      <div className="container mx-auto px-5">
        <Navbar />
        <section>
          <p className="text-sm text-center text-gray-700">
            <span>Harap untuk lengkapi data diri anda dan upload berkas.</span>{" "}
            <Link to={`/biodata`} className="underline">
              Klik disini <i className="fa-solid fa-arrow-right-long ml-1"></i>
            </Link>
          </p>
          <section className="max-w-7xl mx-auto mt-10">
            <header className="text-center mb-2 space-y-1">
              <h2 className="text-gray-900 text-xl font-bold">Tes Seleksi Beasiswa</h2>
              <p className="text-sm text-gray-600">Berikut ini adalah {histories.length + categories.length} kategori soal yang harus dikerjakan.</p>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-3">
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
                  >
                    <div className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg text-sm">
                      <span className="mr-2">{category.name}</span>
                      <i className="fa-solid fa-circle-xmark text-white"></i>
                    </div>
                  </button>
                ))}
            </div>
          </section>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
