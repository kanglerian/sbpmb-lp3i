import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import moment from "moment-timezone";
import checkExpiry from "../config/checkExpiry.js";
import Navigation from "../components/Navigation.jsx";

import "../assets/css/datatables-custom.css";

const Prestasi = () => {
  const [achievements, setAchievements] = useState([]);
  const tableRef = useRef(null);
  const token = localStorage.getItem("token");
  const identity = localStorage.getItem("identity");

  const getUser = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/user/get", {
        params: {
          identity: identity,
          token: token,
        },
      })
      .then((res) => {
        let applicant = res.data.applicant;
        let achievements = res.data.achievements;
        setAchievements(achievements);
        setStudent(applicant);
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

  const addAchievement = async () => {
    let name = prompt("Nama kegiatan / perlombaan?");
    let level = prompt("Tingkat mana kegiatan ini?");
    let year = prompt("Tulis tanggalnya (YYYY-MM-DD):");
    let result = prompt("Anda juara ke berapa?");
    if (name && level && year && result) {
      await axios
        .post(`http://127.0.0.1:8000/api/achievement`, {
          name: name,
          level: level,
          year: year,
          result: result,
          identity_user: identity,
        })
        .then((res) => {
          console.log(res.data);
          getUser();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const deleteAchievement = async (id) => {
    let confirmDelete = confirm("Apakah anda yakin ingin menghapus prestasi?");
    if (confirmDelete) {
      await axios
        .delete(`http://127.0.0.1:8000/api/achievement/${id}`)
        .then((res) => {
          console.log(res.data);
          getUser();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
    checkExpiry();
  }, []);

  useEffect(() => {
    if (achievements.length > 0 && tableRef.current) {
      $(tableRef.current).DataTable();
    }
  }, [achievements]);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-5">
        <Navigation />

        <div className="block max-w-7xl px-6 py-4 bg-white border border-gray-200 rounded-2xl mx-auto mt-5">
          <button
            type="button"
            onClick={addAchievement}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Tambah Data
          </button>
          <div className="relative overflow-x-auto py-5">
            <table
              ref={tableRef}
              className="w-full text-sm text-left text-gray-500"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3 whitespace-nowrap rounded-tl-xl">
                    No.
                  </th>
                  <th className="px-6 py-3 whitespace-nowrap">Nama Kegiatan</th>
                  <th className="px-6 py-3 whitespace-nowrap">Tingkat</th>
                  <th className="px-6 py-3 whitespace-nowrap">Tahun</th>
                  <th className="px-6 py-3 whitespace-nowrap">Pencapaian</th>
                  <th className="px-6 py-3 whitespace-nowrap rounded-tr-xl">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {achievements.length > 0 ? (
                  achievements.map((achievement, i) => (
                    <tr className="bg-white border-b" key={achievement.id}>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {achievement.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {achievement.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment
                          .tz(achievement.year, "Asia/Jakarta")
                          .format("L")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {achievement.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => deleteAchievement(achievement.id)}
                          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <td
                    colSpan={6}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    Data prestasi belum ada.
                  </td>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prestasi;
