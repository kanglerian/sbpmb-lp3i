import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../templates/Navbar.jsx";
import Loading from "../components/Loading.jsx";

import { getProvinces, getRegencies, getDistricts, getVillages } from '../utilities/StudentAddress.js'
import { capitalizeText, numberAddress } from '../config/Capital.js'

const Biodata = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [popoverNik, setPopoverNik] = useState(false);
  const [popoverNisn, setPopoverNisn] = useState(false);

  let start = true;
  const [scholarship, setScholarship] = useState(false);

  const [student, setStudent] = useState({});
  const [nik, setNik] = useState("");
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

  const [studentPlace, setStudentPlace] = useState("");
  const [studentRt, setStudentRt] = useState("");
  const [studentRw, setStudentRw] = useState("");
  const [studentPostalCode, setStudentPostalCode] = useState("");
  const [studentProvince, setStudentProvince] = useState("");
  const [studentRegencies, setStudentRegencies] = useState("");
  const [studentDistricts, setStudentDistricts] = useState("");
  const [studentVillages, setStudentVillages] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolsAPI, setSchoolsAPI] = useState([]);

  const [errors, setErrors] = useState({
    phone: [],
    email: [],
    nik: [],
    kip: [],
    nisn: [],
    name: [],
    religion: [],
    school: [],
    year: [],
    placeOfBirth: [],
    dateOfBirth: [],
    address: [],
  });

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
        setNik(response.data.applicant.nik);
        setNisn(response.data.applicant.nisn);
        setKip(response.data.applicant.kip);
        setName(response.data.applicant.name);
        setSchool(response.data.applicant.school);
        setYear(response.data.applicant.year);
        setPlaceOfBirth(response.data.applicant.place_of_birth);
        setDateOfBirth(response.data.applicant.date_of_birth);
        setGender(response.data.applicant.gender);
        setReligion(response.data.applicant.religion);
        setAddress(response.data.applicant.address);
        setEmail(response.data.applicant.email);
        setPhone(response.data.applicant.phone);
        if (response.data.applicant.school) {
          setSelectedSchool({
            value: response.data.applicant.school,
            label: response.data.applicant.school_applicant.name,
          });
        }

        let applicant = response.data.applicant;
        let fileuploaded = response.data.fileuploaded;
        let foto = fileuploaded.find((file) => { return file.namefile == "foto" });
        let akta = fileuploaded.find((file) => { return file.namefile == "akta-kelahiran" });
        let keluarga = fileuploaded.find((file) => { return file.namefile == "kartu-keluarga" });
        if (start && applicant.nisn && applicant.name && applicant.religion && applicant.school && applicant.year && applicant.place_of_birth && applicant.date_of_birth && applicant.gender && applicant.address && applicant.email && applicant.phone && applicant.program && applicant.income_parent && applicant.father.name && applicant.father.date_of_birth && applicant.father.education && applicant.father.address && applicant.father.job && applicant.mother.name && applicant.mother.date_of_birth && applicant.mother.education && applicant.mother.address && applicant.mother.job && foto && akta && keluarga) {
          setScholarship(true);
        }

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
    setLoading(true);
    e.preventDefault();
    let placeContent = capitalizeText(studentPlace);
    let rtContent = numberAddress(studentRt);
    let rwContent = numberAddress(studentRw);
    let villageContent = capitalizeText(studentVillages);
    let districtContent = capitalizeText(studentDistricts);
    let regenciesContent = capitalizeText(studentRegencies);
    let provinceContent = capitalizeText(studentProvince);
    let addressContent = `${placeContent}, RT. ${rtContent} RW. ${rwContent}, Desa/Kelurahan ${villageContent}, Kecamatan ${districtContent}, ${regenciesContent}, Provinsi ${provinceContent} ${studentPostalCode}`;
    await axios
      .patch(`https://database.politekniklp3i-tasikmalaya.ac.id/api/user/update/${student.identity}`, {
        nik: nik,
        nisn: nisn,
        kip: kip,
        name: name,
        school: school,
        year: year,
        placeOfBirth: placeOfBirth,
        dateOfBirth: dateOfBirth,
        gender: gender,
        religion: religion,
        address: address || addressContent,
        email: email,
        phone: phone,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        alert("Data sudah diperbarui!");
        setLoading(false);
        setErrors({
          phone: [],
          email: [],
          nik: [],
          kip: [],
          nisn: [],
          name: [],
          religion: [],
          school: [],
          year: [],
          placeOfBirth: [],
          dateOfBirth: [],
          address: [],
        });
        getUser();
      })
      .catch((error) => {
        if (error.code !== 'ERR_NETWORK') {
          const phoneError = error.response.data.message.phone || [];
          const emailError = error.response.data.message.email || [];
          const nikError = error.response.data.message.nik || [];
          const kipError = error.response.data.message.kip || [];
          const nisnError = error.response.data.message.nisn || [];
          const nameError = error.response.data.message.name || [];
          const religionError = error.response.data.message.religion || [];
          const schoolError = error.response.data.message.school || [];
          const yearError = error.response.data.message.year || [];
          const placeOfBirthError = error.response.data.message.placeOfBirth || [];
          const dateOfBirthError = error.response.data.message.dateOfBirth || [];
          const addressError = error.response.data.message.address || [];
          const newAllErrors = {
            phone: phoneError,
            email: emailError,
            nik: nikError,
            kip: kipError,
            nisn: nisnError,
            name: nameError,
            religion: religionError,
            school: schoolError,
            year: yearError,
            placeOfBirth: placeOfBirthError,
            dateOfBirth: dateOfBirthError,
            address: addressError,
          };
          setErrors(newAllErrors);
          alert("Data gagal diperbarui!");
          setLoading(false);
        } else {
          setLoading(false);
          alert('Server sedang bermasalah.')
        }
      });
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
    getSchools();
    getProvinces()
      .then((response) => {
        setProvinces(response);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-5">
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section>
            <header className="space-y-1 mb-5">
              <h2 className="font-bold text-gray-900">Selamat Datang Calon Mahasiswa Baru!</h2>
              <p className="text-sm text-gray-700">Berikut ini adalah halaman informasi biodata kamu. Silahkan untuk diisi selengkap mungkin untuk syarat mengikuti E-Assessment.</p>
            </header>
            <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-2">
              <header>
                <h2 className="font-bold text-gray-900">Informasi Persyaratan: </h2>
                <p className="text-sm text-gray-700">Silahkan lengkapi untuk persyaratan beasiswa.</p>
              </header>
              <hr />
              <div className="space-y-2 py-2">
                <h5 className="text-sm text-gray-900 font-bold">Data Diri</h5>
                <ul className="space-y-2 text-sm list-disc ml-5">
                  <li className="space-x-2">
                    <span className="text-gray-900">NIK</span>
                    {student.nik ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">NISN</span>
                    {student.nisn ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">Nama lengkap</span>
                    {student.name ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">Agama</span>
                    {student.religion ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">Sekolah</span>
                    {student.school ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">Tahun Lulus</span>
                    {student.year ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">Tempat Lahir</span>
                    {student.place_of_birth ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">Tanggal Lahir</span>
                    {student.date_of_birth ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">Alamat</span>
                    {student.address ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">Email</span>
                    {student.email ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">No. Whatsapp</span>
                    {student.phone ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                </ul>
              </div>
              {
                scholarship ? (
                  <Link to={`/scholarship`} className="space-x-2 bg-sky-500 hover:bg-sky-600 text-white block text-center w-full px-4 py-2 rounded-lg text-sm">
                    <i className="fa-solid fa-pen"></i>
                    <span>Kerjakan E-Assessment</span>
                  </Link>
                ) : (
                  <button className="space-x-2 bg-red-500 hover:bg-red-600 text-white block w-full px-4 py-2 rounded-lg text-sm">
                    <i className="fa-solid fa-circle-xmark"></i>
                    <span>Persyaratan Belum Lengkap</span>
                  </button>
                )
              }
            </div>
          </section>
          <form onSubmit={handleUpdate} className="pb-5">
            <div className="grid grid-cols-1 md:gap-4">
              <div className="relative mb-5">
                {
                  popoverNik &&
                  <div role="tooltip"
                    className="absolute top-[-23px] right-[200px] z-10 visible inline-block w-72 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div
                      className="flex justify-between items-center px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                      <h3 className="font-semibold text-gray-900">Bagaimana Cek NIK?</h3>
                      <span className="cursor-pointer" onClick={() => setPopoverNik(!popoverNik)}><i
                        className="fa-solid fa-xmark"></i></span>
                    </div>
                    <div className="px-3 py-2">
                      <p>Kalo belum punya KTP, bisa cek di <span className="font-medium">Kartu Keluarga</span> sih.</p>
                    </div>
                  </div>
                }
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Nomor Induk Kependudukan (NIK)
                </label>
                <input
                  type="number"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Nomor Induk Kependudukan"
                />
                {
                  errors.nik.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.nik.map((error, index) => (
                        <li className="font-regular" key={index}>{error}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 flex items-center gap-2 text-xs text-red-600">
                      <span className="font-medium">Keterangan:</span> Wajib diisi.
                      <div onClick={() => setPopoverNik(!popoverNik)} className="space-x-1 cursor-pointer text-sm text-yellow-500">
                        <i className="fa-solid fa-circle-info" />
                        <span className="text-xs">Gatau? Cek disini!</span>
                      </div>
                    </p>
                  )
                }
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <div className="relative mb-5">
                {
                  popoverNisn &&
                  <div role="tooltip"
                    className="absolute top-[-23px] right-[-60px] z-10 visible inline-block w-72 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div
                      className="flex justify-between items-center px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                      <h3 className="font-semibold text-gray-900">Bagaimana Cek NISN?</h3>
                      <span className="cursor-pointer" onClick={() => setPopoverNisn(!popoverNisn)}>
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    </div>
                    <div className="px-3 py-2">
                      <p>Bro, mampir ke web <a className="underline font-medium" href="https://nisn.data.kemdikbud.go.id/index.php/Cindex/formcaribynama">NISN Kemendikbud</a> ya, terus isi data dirimu.</p>
                    </div>
                  </div>
                }
                <label NameName="block mb-2 text-sm font-medium text-gray-900">
                  Nomor Induk Siswa Nasional (NISN)
                </label>
                <input
                  type="number"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="NISN"
                />
                {
                  errors.nisn.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.nisn.map((error, index) => (
                        <li className="font-regular" key={index}>{error}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 flex items-center gap-2 text-xs text-red-600">
                      <span className="font-medium">Keterangan:</span> Wajib diisi.
                      <div onClick={() => setPopoverNisn(!popoverNisn)} className="space-x-1 cursor-pointer text-sm text-yellow-500">
                        <i className="fa-solid fa-circle-info" />
                        <span className="text-xs">Gatau? Cek disini!</span>
                      </div>
                    </p>
                  )
                }
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  No. Kartu Indonesia Pintar
                </label>
                <input
                  type="text"
                  value={kip}
                  onChange={(e) => setKip(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="KIP"
                />
                {
                  errors.kip.length > 0 &&
                  <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                    {errors.kip.map((error, index) => (
                      <li className="font-regular" key={index}>{error}</li>
                    ))}
                  </ul>
                }
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
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
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Agama
                </label>

                <select
                  onChange={(e) => setReligion(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  {religion ? (
                    <option value={religion} selected>
                      {religion}
                    </option>
                  ) : (
                    <option value={0}>Pilih</option>
                  )}
                  <option value="Islam">Islam</option>
                  <option value="Kristen Katholik">Kristen Katholik</option>
                  <option value="Kristen Protestan">Kristen Protestan</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                </select>
                {
                  errors.religion.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.religion.map((error, index) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
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
                  {
                    errors.school.length > 0 ? (
                      <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                        {errors.school.map((error, index) => (
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
              )}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Tahun Lulus
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-2"
                  placeholder="Tahun Lulus"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
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
                {
                  errors.placeOfBirth.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.placeOfBirth.map((error, index) => (
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
                {
                  errors.dateOfBirth.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.dateOfBirth.map((error, index) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
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
                {
                  errors.email.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.email.map((error, index) => (
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
                {
                  errors.phone.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.phone.map((error, index) => (
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

            {
              address ? (
                <div className="grid grid-cols-1 gap-3 mb-5">
                  <div className="relative group space-y-2">
                    <h2 className="block mb-1 text-sm font-medium text-gray-900">Alamat</h2>
                    <p className="text-sm text-gray-700">{address}</p>
                    <button onClick={() => setAddress("")} className="text-xs text-white bg-yellow-400 hover:bg-yellow-500 rounded-lg px-5 py-2"><i className="fa-solid fa-pen-to-square"></i> Ubah alamat</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative group">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Jl / Kp / Perum
                      </label>
                      <input
                        type="text"
                        value={studentPlace}
                        onChange={(e) => setStudentPlace(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Jl"
                        required
                      />
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    </div>
                    <div className="relative group">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        RT.
                      </label>
                      <input
                        type="number"
                        value={studentRt}
                        onChange={(e) => setStudentRt(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="RT."
                        required
                      />
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    </div>
                    <div className="relative group">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        RW.
                      </label>
                      <input
                        type="number"
                        value={studentRw}
                        onChange={(e) => setStudentRw(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="RW."
                        required
                      />
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    </div>
                    <div className="relative group">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Kode Pos
                      </label>
                      <input
                        type="number"
                        value={studentPostalCode}
                        onChange={(e) => setStudentPostalCode(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Kode Pos"
                        required
                      />
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="relative group">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Provinsi
                      </label>
                      <select
                        onChange={(e) => {
                          setStudentProvince(e.target.value);
                          getRegencies(e.target.options[e.target.selectedIndex].dataset.id)
                            .then((response) => {
                              setRegencies(response)
                            })
                            .catch((error) => {
                              console.log(error);
                            })
                        }}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                      >
                        <option>Pilih Provinsi</option>
                        {
                          provinces.length > 0 ? (
                            provinces.map((province) =>
                              <option key={province.id} data-id={province.id} value={province.name}>{province.name}</option>
                            )
                          ) : (
                            <option>Pilih Provinsi</option>
                          )
                        }
                      </select>
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    </div>
                    <div className="relative group">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Kota / Kabupaten
                      </label>
                      <select
                        onChange={(e) => {
                          setStudentRegencies(e.target.value);
                          getDistricts(e.target.options[e.target.selectedIndex].dataset.id)
                            .then((response) => {
                              setDistricts(response)
                            })
                            .catch((error) => {
                              console.log(error);
                            })
                        }}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required disabled={regencies.length > 0 ? false : true}
                      >
                        {
                          regencies.length > 0 ? (
                            regencies.map((regency) =>
                              <option key={regency.id} data-id={regency.id} value={regency.name}>{regency.name}</option>
                            )
                          ) : (
                            <option>Pilih Kota / Kabupaten</option>
                          )
                        }
                      </select>
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="relative group">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Kecamatan
                      </label>
                      <select
                        onChange={(e) => {
                          setStudentDistricts(e.target.value);
                          getVillages(e.target.options[e.target.selectedIndex].dataset.id)
                            .then((response) => {
                              setVillages(response)
                            })
                            .catch((error) => {
                              console.log(error);
                            })
                        }}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={districts.length > 0 ? false : true}
                        required
                      >
                        {
                          districts.length > 0 ? (
                            districts.map((district) =>
                              <option key={district.id} data-id={district.id} value={district.name}>{district.name}</option>
                            )
                          ) : (
                            <option>Pilih Kecamatan</option>
                          )
                        }
                      </select>
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    </div>
                    <div className="relative group">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Desa / Kelurahan
                      </label>
                      <select
                        onChange={(e) => {
                          setStudentVillages(e.target.value);
                        }}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={villages.length > 0 ? false : true}
                        required
                      >
                        {
                          villages.length > 0 ? (
                            villages.map((village) =>
                              <option key={village.id} data-id={village.id} value={village.name}>{village.name}</option>
                            )
                          ) : (
                            <option>Pilih Desa / Kelurahan</option>
                          )
                        }
                      </select>
                      <p className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Keterangan:</span> Wajib diisi.
                      </p>
                    </div>
                  </div>
                </>
              )
            }

            <button
              type="submit"
              className="flex justify-center items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading && <Loading width={5} height={5} fill="fill-sky-500" color="text-gray-200" />}
              Perbarui Data
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Biodata;
