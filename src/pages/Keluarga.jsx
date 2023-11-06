import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../templates/Navbar.jsx";

const Keluarga = () => {
  const [student, setStudent] = useState({});

  const [fatherName, setFatherName] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [fatherPlaceOfBirth, setFatherPlaceOfBirth] = useState("");
  const [fatherDateOfBirth, setFatherDateOfBirth] = useState("");
  const [fatherEducation, setFatherEducation] = useState("");
  const [fatherJob, setFatherJob] = useState("");
  const [fatherAddress, setFatherAddress] = useState("");

  const [motherName, setMotherName] = useState("");
  const [motherPhone, setMotherPhone] = useState("");
  const [motherPlaceOfBirth, setMotherPlaceOfBirth] = useState("");
  const [motherDateOfBirth, setMotherDateOfBirth] = useState("");
  const [motherEducation, setMotherEducation] = useState("");
  const [motherJob, setMotherJob] = useState("");
  const [motherAddress, setMotherAddress] = useState("");

  const [incomeParent, setIncomeParent] = useState("");

  const token = localStorage.getItem("token");

  const getUser = async () => {
    await axios
      .get("https://database.politekniklp3i-tasikmalaya.ac.id/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStudent(response.data.applicant);
        setFatherName(response.data.applicant.father.name);
        setFatherPhone(response.data.applicant.father.phone);
        setFatherPlaceOfBirth(response.data.applicant.father.place_of_birth);
        setFatherDateOfBirth(response.data.applicant.father.date_of_birth);
        setFatherEducation(response.data.applicant.father.education);
        setFatherJob(response.data.applicant.father.job);
        setFatherAddress(response.data.applicant.father.address);
        setMotherName(response.data.applicant.mother.name);
        setMotherPhone(response.data.applicant.mother.phone);
        setMotherPlaceOfBirth(response.data.applicant.mother.place_of_birth);
        setMotherDateOfBirth(response.data.applicant.mother.date_of_birth);
        setMotherEducation(response.data.applicant.mother.education);
        setMotherJob(response.data.applicant.mother.job);
        setMotherAddress(response.data.applicant.mother.address);
        setIncomeParent(response.data.applicant.income_parent);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.log(error);
        }
      });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios
      .patch(
        `https://database.politekniklp3i-tasikmalaya.ac.id/api/user/updatefamily/${student.identity}`,
        {
          fatherName: fatherName,
          fatherPhone: fatherPhone,
          fatherPlaceOfBirth: fatherPlaceOfBirth,
          fatherDateOfBirth: fatherDateOfBirth,
          fatherEducation: fatherEducation,
          fatherJob: fatherJob,
          fatherAddress: fatherAddress,
          motherName: motherName,
          motherPhone: motherPhone,
          motherPlaceOfBirth: motherPlaceOfBirth,
          motherDateOfBirth: motherDateOfBirth,
          motherEducation: motherEducation,
          motherJob: motherJob,
          motherAddress: motherAddress,
          incomeParent: incomeParent == 0 ? "" : incomeParent,
        },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        alert(res.data.message);
        getUser();
      })
      .catch((err) => {
        let networkError = err.message == "Network Error";
        alert(
          networkError
            ? "Mohon maaf, ada kesalahan di sisi Server."
            : err.message
        );
      });
  };

  const handleMotherPhoneChange = (e) => {
    let input = e.target.value;

    if (input.startsWith("62")) {
      setMotherPhone(input);
    } else if (input.startsWith("0")) {
      setMotherPhone("62" + input.substring(1));
    } else {
      setMotherPhone("62");
    }
  };

  const handleFatherPhoneChange = (e) => {
    let input = e.target.value;

    if (input.startsWith("62")) {
      setFatherPhone(input);
    } else if (input.startsWith("0")) {
      setFatherPhone("62" + input.substring(1));
    } else {
      setFatherPhone("62");
    }
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
        <form onSubmit={handleUpdate} className="w-full">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/2 p-3">
              <h2 className="mb-5 font-bold text-2xl">Biodata Ayah</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nama Lengkap Ayah"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    No. HP Ayah
                  </label>
                  <input
                    type="number"
                    value={fatherPhone}
                    onChange={handleFatherPhoneChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="No. HP Ayah"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={fatherPlaceOfBirth}
                    onChange={(e) => setFatherPlaceOfBirth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tempat Lahir Ayah"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={fatherDateOfBirth}
                    onChange={(e) => setFatherDateOfBirth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tanggal Lahir Ayah"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={fatherEducation}
                    onChange={(e) => setFatherEducation(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Pendidikan Terakhir"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={fatherJob}
                    onChange={(e) => setFatherJob(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Pekerjaan"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:gap-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Alamat
                  </label>
                  <textarea
                    type="text"
                    value={fatherAddress}
                    onChange={(e) => setFatherAddress(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Alamat"
                  >
                    {fatherAddress}
                  </textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:gap-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Penghasilan Orang Tua
                  </label>
                  <select
                    onChange={(e) => setIncomeParent(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  >
                    {incomeParent ? (
                      <option value={incomeParent} selected>
                        {incomeParent}
                      </option>
                    ) : (
                      <option value={0}>Pilih Penghasilan</option>
                    )}
                    <option value="< 1.000.000"> &lt; 1.000.000</option>
                    <option value="1.000.000 - 2.000.000">
                      1.000.000 - 2.000.000
                    </option>
                    <option value="2.000.000 - 4.000.000">
                      2.000.000 - 4.000.000
                    </option>
                    <option value="> 5.000.000">&gt; 5.000.000</option>
                  </select>
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-3">
              <h2 className="mb-5 font-bold text-2xl">Biodata Ibu</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nama Lengkap Ibu"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    No. HP Ibu
                  </label>
                  <input
                    type="number"
                    value={motherPhone}
                    onChange={handleMotherPhoneChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="No. HP Ibu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={motherPlaceOfBirth}
                    onChange={(e) => setMotherPlaceOfBirth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tempat Lahir Ibu"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={motherDateOfBirth}
                    onChange={(e) => setMotherDateOfBirth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tanggal Lahir Ibu"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={motherEducation}
                    onChange={(e) => setMotherEducation(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Pendidikan Terakhir"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={motherJob}
                    onChange={(e) => setMotherJob(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Pekerjaan"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600">
                    <span className="font-medium">Keterangan:</span> Wajib
                    diisi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:gap-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Alamat
                  </label>
                  <textarea
                    type="text"
                    value={motherAddress}
                    onChange={(e) => setMotherAddress(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Alamat"
                  >
                    {motherAddress}
                  </textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:gap-4">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Perbarui Data
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Keluarga;
