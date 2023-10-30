import React, { useEffect, useState } from "react";
import axios from "axios";
import checkExpiry from "../config/checkExpiry.js";
import Navbar from "../templates/Navbar.jsx";

const Keluarga = () => {
  const [student, setStudent] = useState([]);

  const [fatherName, setfatherName] = useState("");
  const [fatherPhone, setfatherPhone] = useState("");
  const [fatherPlaceOfBirth, setfatherPlaceOfBirth] = useState("");
  const [fatherDateOfBirth, setfatherDateOfBirth] = useState("");
  const [fatherEducation, setfatherEducation] = useState("");
  const [fatherJob, setfatherJob] = useState("");
  const [fatherAddress, setfatherAddress] = useState("");

  const [motherName, setmotherName] = useState("");
  const [motherPhone, setmotherPhone] = useState("");
  const [motherPlaceOfBirth, setmotherPlaceOfBirth] = useState("");
  const [motherDateOfBirth, setmotherDateOfBirth] = useState("");
  const [motherEducation, setmotherEducation] = useState("");
  const [motherJob, setmotherJob] = useState("");
  const [motherAddress, setmotherAddress] = useState("");

  const [incomeParent, setIncomeParent] = useState("");

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
        setStudent(applicant);

        setfatherName(applicant.father.name);
        setfatherPhone(applicant.father.phone);
        setfatherPlaceOfBirth(applicant.father.place_of_birth);
        setfatherDateOfBirth(applicant.father.date_of_birth);
        setfatherEducation(applicant.father.education);
        setfatherJob(applicant.father.job);
        setfatherAddress(applicant.father.address);

        setmotherName(applicant.mother.name);
        setmotherPhone(applicant.mother.phone);
        setmotherPlaceOfBirth(applicant.mother.place_of_birth);
        setmotherDateOfBirth(applicant.mother.date_of_birth);
        setmotherEducation(applicant.mother.education);
        setmotherJob(applicant.mother.job);
        setmotherAddress(applicant.mother.address);

        setIncomeParent(applicant.income_parent);
      })
      .catch((err) => {
        if (err.message == "Request failed with status code 404") {
          localStorage.removeItem("identity");
          localStorage.removeItem("token");
          localStorage.removeItem("expiry");
          navigate("/");
        }
        let networkError = err.message == "Network Error";
        if (networkError) {
          alert("Mohon maaf, ada kesalahan di sisi Server.");
          navigate("/");
        } else {
          console.log(err.message);
        }
      });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios
      .patch(
        `http://127.0.0.1:8000/api/user/updatefamily/${student.identity}`,
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
          incomeParent: incomeParent == 0 ? '' : incomeParent,
        }
      )
      .then((res) => {
        alert(res.data.message);
        getUser();
      })
      .catch((err) => {
        let networkError = err.message == "Network Error";
        alert(networkError ? "Mohon maaf, ada kesalahan di sisi Server." : err.message);
      });
  };

  const handleMotherPhoneChange = (e) => {
    let input = e.target.value;

    if (input.startsWith("62")) {
      setmotherPhone(input);
    } else if (input.startsWith("0")) {
      setmotherPhone("62" + input.substring(1));
    } else {
      setmotherPhone("62");
    }
  };

  const handleFatherPhoneChange = (e) => {
    let input = e.target.value;

    if (input.startsWith("62")) {
      setfatherPhone(input);
    } else if (input.startsWith("0")) {
      setfatherPhone("62" + input.substring(1));
    } else {
      setfatherPhone("62");
    }
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
    checkExpiry();
  }, []);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-5">
        <Navbar />
        <form onSubmit={handleUpdate} className="w-full p-5">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/2 p-5">
              <h2 className="mb-5 font-bold text-2xl">Biodata Ayah</h2>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setfatherName(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Nama Lengkap Ayah"
                  required
                />
                <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
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
              <div className="flex gap-5">
                <div className="w-full mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={fatherPlaceOfBirth}
                    onChange={(e) => setfatherPlaceOfBirth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tempat Lahir Ayah"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
                </div>
                <div className="w-full mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={fatherDateOfBirth}
                    onChange={(e) => setfatherDateOfBirth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tanggal Lahir Ayah"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-full mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={fatherEducation}
                    onChange={(e) => setfatherEducation(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Pendidikan Terakhir"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
                </div>
                <div className="w-full mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={fatherJob}
                    onChange={(e) => setfatherJob(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Pekerjaan"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
                </div>
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Alamat
                </label>
                <textarea
                  type="text"
                  value={fatherAddress}
                  onChange={(e) => setfatherAddress(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Alamat"
                >
                  {fatherAddress}
                </textarea>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-5">
              <h2 className="mb-5 font-bold text-2xl">Biodata Ibu</h2>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setmotherName(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Nama Lengkap Ibu"
                  required
                />
                <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
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
              <div className="flex gap-5">
                <div className="w-full mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={motherPlaceOfBirth}
                    onChange={(e) => setmotherPlaceOfBirth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tempat Lahir Ibu"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
                </div>
                <div className="w-full mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={motherDateOfBirth}
                    onChange={(e) => setmotherDateOfBirth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tanggal Lahir Ibu"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-full mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={motherEducation}
                    onChange={(e) => setmotherEducation(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Pendidikan Terakhir"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
                </div>
                <div className="w-full mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={motherJob}
                    onChange={(e) => setmotherJob(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Pekerjaan"
                    required
                  />
                  <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
                </div>
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Alamat
                </label>
                <textarea
                  type="text"
                  value={motherAddress}
                  onChange={(e) => setmotherAddress(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Alamat"
                >
                  {motherAddress}
                </textarea>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-5">
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
                  <option value={incomeParent} selected>{incomeParent}</option>
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
              <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
            </div>
          </div>
          <div className="px-5">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Perbarui Data
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Keluarga;
