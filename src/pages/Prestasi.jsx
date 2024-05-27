import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import moment from "moment-timezone";

import "../assets/css/datatables-custom.css";
import Navbar from "../templates/Navbar.jsx";
import Loading from "../components/Loading.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";

const Prestasi = () => {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [modal, setModal] = useState(false);
  const tableRef = useRef(null);
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState("");

  const [errors, setErrors] = useState({
    name: [],
    level: [],
    year: [],
    result: [],
  });

  const getUser = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStudent(response.data.applicant);
        setAchievements(response.data.achievements);
        setLoadingScreen(false);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.log(error);
        }
        setLoadingScreen(false);
      });
  };

  const addAchievement = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (name && level != 0 && year && result) {
      await axios
        .post(
          `http://127.0.0.1:8000/api/achievement`,
          {
            name: name,
            level: level,
            year: year,
            result: result,
            identity_user: student.identity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          alert(res.data.message);
          getUser();
          setName("");
          setLevel("");
          setYear("");
          setResult("");
          setModal(false);
          setLoading(false);
        })
        .catch((error) => {
          if (error.code !== 'ERR_NETWORK') {
            const nameError = error.response.data.message.name || [];
            const levelError = error.response.data.message.level || [];
            const yearError = error.response.data.message.year || [];
            const resultError = error.response.data.message.result || [];
            const newAllErrors = {
              name: nameError,
              level: levelError,
              year: yearError,
              result: resultError,
            };
            setErrors(newAllErrors);
            alert("Data gagal diperbarui!");
            setLoading(false);
          } else {
            alert('Server sedang bermasalah.')
            setLoading(false);
          }
        });
    }
  };

  const deleteAchievement = async (id) => {
    setLoading(true);
    let confirmDelete = confirm("Apakah anda yakin ingin menghapus prestasi?");
    if (confirmDelete) {
      await axios
        .delete(`http://127.0.0.1:8000/api/achievement/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          alert(res.data.message);
          setLoading(false);
          getUser();
        })
        .catch((err) => {
          let networkError = err.message == "Network Error";
          alert(
            networkError
              ? "Mohon maaf, ada kesalahan di sisi Server."
              : err.message
          );
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
  }, []);

  useEffect(() => {
    if (achievements.length > 0 && tableRef.current) {
      $(tableRef.current).DataTable();
    }
  }, [achievements]);

  return (
    <section className="bg-white">
    { loadingScreen && <LoadingScreen/> }
      <div className="container mx-auto px-5">
        <Navbar />

        <div className="block max-w-7xl px-6 py-4 bg-white border border-gray-200 rounded-2xl mx-auto mt-5">
          <button
            type="button"
            onClick={() => setModal(!modal)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5"
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
                          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-5 py-2.5"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 whitespace-nowrap text-center"
                    >
                      Data prestasi belum ada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Add */}
      <div
        id="staticModal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className={`${
          modal ? "" : "hidden"
        } flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
        <div className="relative w-full max-w-2xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-xl shadow">
            {/* Modal header */}
            <div className="flex items-start justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                Tambah Prestasi
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                onClick={() => setModal(!modal)}
              >
                <i className="fa-solid fa-xmark"></i>
                <span className="sr-only">Tutup modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form method="POST" onSubmit={addAchievement}>
              <div className="p-6 space-y-6">
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tulis nama kegiatan disini.."
                    required
                  />
                  {
                    errors.name.length > 0 ? (
                      <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                        {errors.name.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    )
                  }
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="level"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Tingkat
                  </label>
                  <select
                    onChange={(e) => setLevel(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  >
                    <option value={0}>Pilih Tingkat</option>
                    <option value="Internasional">Internasional</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Kota / Kabupaten">Kota / Kabupaten</option>
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Desa / Kelurahan">Desa / Kelurahan</option>
                    <option value="Sekolah">Sekolah</option>
                    <option value="Jurusan">Jurusan</option>
                  </select>
                  {
                    errors.level.length > 0 ? (
                      <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                        {errors.level.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    )
                  }
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="year"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Tahun
                  </label>
                  <input
                    type="date"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tulis tahun disini.."
                    required
                  />
                  {
                    errors.year.length > 0 ? (
                      <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                        {errors.year.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    )
                  }
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="result"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Pencapaian
                  </label>
                  <input
                    type="text"
                    id="result"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tulis pencapaian disini.."
                    required
                  />
                  {
                    errors.result.length > 0 ? (
                      <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                        {errors.result.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    )
                  }
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button
                  type="submit"
                  className="flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center"
                >
                  {loading && <Loading width={5} height={5} fill="fill-sky-500" color="text-gray-200" />}
                  Tambahkan
                </button>
                <button
                  onClick={() => setModal(!modal)}
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-xl border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                >
                  Batalkan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prestasi;
