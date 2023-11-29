import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../templates/Navbar.jsx";

const Biodata = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState({});
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

  const [errors, setErrors] = useState({
    phone: [],
    email: [],
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
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        alert("Data sudah diperbarui!");
        getUser();
      })
      .catch((error) => {
        if (error.code !== 'ERR_NETWORK') {
          const phoneError = error.response.data.message.phone || [];
          const emailError = error.response.data.message.email || [];
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
        } else {
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
  }, []);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-5">
        <Navbar />
        <div className="flex flex-col md:flex-row justify-between md:gap-10">
          <div className="w-full md:w-1/3 p-3">
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
            </div>
          </div>
          <form onSubmit={handleUpdate} className="w-full md:w-2/3 p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
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
                {
                  errors.nisn.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.nisn.map((error, index) => (
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
              {
                errors.address.length > 0 ? (
                  <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                    {errors.address.map((error, index) => (
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
