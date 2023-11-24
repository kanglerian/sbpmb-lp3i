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

  const dattebayoPlay = () => {
    let audio = new Audio(DattebayoSound);
    audio.play();
  }

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
      <div className="container mx-auto px-5">
        <Navbar />
        <section className="space-y-2">
          <p className="text-sm text-center text-gray-700">
            <span>Harap untuk <span className="underline">lengkapi data diri anda dan upload berkas</span> untuk mengikuti Seleksi Beasiswa.</span>{" "}
          </p>
          <p className="text-sm text-center text-gray-700">
            Setelah melengkapi data, akan ada menu <span className="font-bold">E-Assessment.</span>{" "}
          </p>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
