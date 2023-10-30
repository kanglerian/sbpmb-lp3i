import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import checkExpiry from "../config/checkExpiry.js";
import Navbar from "../templates/Navbar.jsx";

const Biodata = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState([]);
  const [nisn, setNisn] = useState("");
  const [kip, setKip] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [year, setYear] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolsAPI, setSchoolsAPI] = useState([]);

  const token = localStorage.getItem("token");
  const identity = localStorage.getItem("identity");

  const getUser = async () => {
    await axios
      .get("https://database.politekniklp3i-tasikmalaya.ac.id/api/user/get", {
        params: {
          identity: identity,
          token: token,
        },
      })
      .then((res) => {
        let applicant = res.data.applicant;
        setStudent(applicant);
        setNisn(applicant.nisn);
        setKip(applicant.kip);
        setName(applicant.name);
        setSchool(applicant.school);
        setYear(applicant.year);
        setPlaceOfBirth(applicant.place_of_birth);
        setDateOfBirth(applicant.date_of_birth);
        setGender(applicant.gender);
        setReligion(applicant.religion);
        setAddress(applicant.address);
        setEmail(applicant.email);
        setPhone(applicant.phone);

        if (applicant.school) {
          setSelectedSchool({
            value: applicant.school,
            label: applicant.school_applicant.name,
          });
        }
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

  const getSchools = async () => {
    await axios
      .get(`https://database.politekniklp3i-tasikmalaya.ac.id/api/school/getall`)
      .then((res) => {
        let bucket = [];
        let dataSchools = res.data.schools;
        dataSchools.forEach((data) => {
          bucket.push({
            value: data.id,
            label: data.name,
          });
        });
        setSchoolsAPI(bucket);
      })
      .catch((err) => {
        let networkError = err.message == "Network Error";
        if (networkError) {
          alert("Mohon maaf, data sekolah tidak bisa muncul. Periksa server.");
        } else {
          console.log(err.message);
        }
      });
  };

  const schoolHandle = (selectedOption) => {
    if (selectedOption) {
      setSchool(selectedOption.value);
      setSelectedSchool(selectedOption);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios
      .patch(`https://database.politekniklp3i-tasikmalaya.ac.id/api/user/update/${student.identity}`, {
        nisn: nisn,
        kip: kip,
        name: name,
        school: school,
        year: year,
        placeOfBirth: placeOfBirth,
        dateOfBirth: dateOfBirth,
        gender: gender,
        religion: religion,
        address: address,
        email: email,
        phone: phone,
      })
      .then((res) => {
        alert("Data sudah diperbarui!");
        getUser();
      })
      .catch((err) => {
        let networkError = err.message == "Network Error";
        alert(networkError ? "Mohon maaf, ada kesalahan di sisi Server." : err.message);
      });
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
    getSchools();
    checkExpiry();
  }, []);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-5">
        <Navbar />
        <div className="flex flex-col md:flex-row justify-between md:gap-10">
          <div className="w-full md:w-1/2 p-5">
            <p>
              Selamat datang di situs resmi Seleksi Beasiswa Penerimaan
              Mahasiswa Baru (SBPMB) Politeknik LP3I Kampus Tasikmalaya, tempat
              di mana langkah pertama menuju perjalanan pendidikan yang gemilang
              dimulai. Kami dengan tulus menyambut Anda untuk bergabung dalam
              perjalanan pendidikan yang penuh inspirasi dan peluang tak
              terbatas.
            </p>
          </div>
          <form onSubmit={handleUpdate} className="w-full md:w-1/2 p-5">
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Nomor Induk Siswa Nasional (NISN)
              </label>
              <input
                type="number"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="NISN"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                No. Kartu Indonesia Pintar
              </label>
              <input
                type="number"
                value={kip}
                onChange={(e) => setKip(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="KIP"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Nama lengkap"
                required
              />
              <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
            </div>

            {schoolsAPI.length > 0 && (
              <div className="mb-5">
                <label
                  htmlFor="school"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Asal Sekolah
                </label>
                <CreatableSelect
                  options={schoolsAPI}
                  value={selectedSchool}
                  onChange={schoolHandle}
                  placeholder="Isi dengan nama sekolah anda..."
                  className="text-sm"
                  required
                />
                <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
              </div>
            )}

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Tahun Lulus
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Tahun Lulus"
                required
              />
              <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Tempat Lahir"
                required
              />
              <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Tanggal Lahir"
                required
              />
              <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Jenis Kelamin
              </label>

              <div className="flex gap-10 mt-5">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    defaultValue
                    value={1}
                    onClick={() => setGender(1)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    checked={gender == 1}
                  />
                  <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Laki-laki
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    value={0}
                    onClick={() => setGender(0)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    checked={gender == 0}
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Perempuan
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Agama
              </label>
              <input
                type="text"
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Agama"
                required
              />
              <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Alamat
              </label>
              <textarea
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Alamat"
                required
              >
                {address}
              </textarea>
              <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Email"
                required
              />
              <p className="mt-2 text-xs text-red-600"><span className="font-medium">Keterangan:</span> Wajib diisi.</p>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                No. Telpon (Whatsapp)
              </label>
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="No. Telpon (Whatsapp)"
                readOnly
              />
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Perbarui Data
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Biodata;
