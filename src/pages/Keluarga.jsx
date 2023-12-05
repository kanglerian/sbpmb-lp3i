import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../templates/Navbar.jsx";
import Loading from "../components/Loading.jsx";
import { Link } from "react-router-dom";

const Keluarga = () => {
  let start = true;
  const [loading, setLoading] = useState(false);
  const [scholarship, setScholarship] = useState(false);

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

  const [errors, setErrors] = useState({
    fatherName: [],
    fatherPhone: [],
    fatherPlaceOfBirth: [],
    fatherDateOfBirth: [],
    fatherEducation: [],
    fatherJob: [],
    fatherAddress: [],
    motherName: [],
    motherPhone: [],
    motherPlaceOfBirth: [],
    motherDateOfBirth: [],
    motherEducation: [],
    motherJob: [],
    motherAddress: [],
    incomeParent: [],
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

  const handleUpdate = async (e) => {
    setLoading(true);
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
        }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      )
      .then((res) => {
        alert(res.data.message);
        setLoading(false);
        getUser();
      })
      .catch((error) => {
        if (error.code !== 'ERR_NETWORK') {
          const fatherNameError = error.response.data.message.fatherName || [];
          const fatherPhoneError = error.response.data.message.fatherPhone || [];
          const fatherPlaceOfBirthError = error.response.data.message.fatherPlaceOfBirth || [];
          const fatherDateOfBirthError = error.response.data.message.fatherDateOfBirth || [];
          const fatherEducationError = error.response.data.message.fatherEducation || [];
          const fatherJobError = error.response.data.message.fatherJob || [];
          const fatherAddressError = error.response.data.message.fatherAddress || [];
          const motherNameError = error.response.data.message.motherName || [];
          const motherPhoneError = error.response.data.message.motherPhone || [];
          const motherPlaceOfBirthError = error.response.data.message.motherPlaceOfBirth || [];
          const motherDateOfBirthError = error.response.data.message.motherDateOfBirth || [];
          const motherEducationError = error.response.data.message.motherEducation || [];
          const motherJobError = error.response.data.message.motherJob || [];
          const motherAddressError = error.response.data.message.motherAddress || [];
          const incomeParentError = error.response.data.message.incomeParent || [];
          const newAllErrors = {
            fatherName: fatherNameError,
            fatherPhone: fatherPhoneError,
            fatherPlaceOfBirth: fatherPlaceOfBirthError,
            fatherDateOfBirth: fatherDateOfBirthError,
            fatherEducation: fatherEducationError,
            fatherJob: fatherJobError,
            fatherAddress: fatherAddressError,
            motherName: motherNameError,
            motherPhone: motherPhoneError,
            motherPlaceOfBirth: motherPlaceOfBirthError,
            motherDateOfBirth: motherDateOfBirthError,
            motherEducation: motherEducationError,
            motherJob: motherJobError,
            motherAddress: motherAddressError,
            incomeParent: incomeParentError,
          };
          setErrors(newAllErrors);
          alert("Data gagal diperbarui!");
          setLoading(false);
        } else {
          alert('Server sedang bermasalah.')
          setLoading(false);
        }
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

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-5">
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
                <h5 className="text-sm text-gray-900 font-bold">Biodata Ayah</h5>
                <ul className="space-y-2 text-sm list-disc ml-5">
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Nama Lengkap</span>
                      {student.father && student.father.name ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Tempat Lahir</span>
                      {student.father && student.father.place_of_birth ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Tanggal Lahir</span>
                      {student.father && student.father.date_of_birth ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Pendidikan Terakhir</span>
                      {student.father && student.father.education ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Pekerjaan</span>
                      {student.father && student.father.job ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Alamat</span>
                      {student.father && student.father.address ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                </ul>
              </div>

              <hr />
              <div className="space-y-2 py-2">
                <h5 className="text-sm text-gray-900 font-bold">Biodata Ibu</h5>
                <ul className="space-y-2 text-sm list-disc ml-5">
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Nama Lengkap</span>
                      {student.mother && student.mother.name ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Tempat Lahir</span>
                      {student.mother && student.mother.place_of_birth ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Tanggal Lahir</span>
                      {student.mother && student.mother.date_of_birth ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Pendidikan Terakhir</span>
                      {student.mother && student.mother.education ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Pekerjaan</span>
                      {student.mother && student.mother.job ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Alamat</span>
                      {student.mother && student.mother.address ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
                </ul>
              </div>

              <hr />
              <div className="space-y-2 py-2">
                <h5 className="text-sm text-gray-900 font-bold">Penghasilan</h5>
                <ul className="space-y-2 text-sm list-disc ml-5">
                  {student &&
                    <li className="space-x-2">
                      <span className="text-gray-900">Penghasilan Orang Tua</span>
                      {student.income_parent ? (
                        <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                      ) : (
                        <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                      )}
                    </li>
                  }
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
          <section>
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
                {
                  errors.fatherName.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.fatherName.map((error, index) => (
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
                {
                  errors.fatherPlaceOfBirth.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.fatherPlaceOfBirth.map((error, index) => (
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
                  value={fatherDateOfBirth}
                  onChange={(e) => setFatherDateOfBirth(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Tanggal Lahir Ayah"
                  required
                />
                {
                  errors.fatherDateOfBirth.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.fatherDateOfBirth.map((error, index) => (
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
                {
                  errors.fatherEducation.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.fatherEducation.map((error, index) => (
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
                {
                  errors.fatherJob.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.fatherJob.map((error, index) => (
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
                  required
                >
                  {fatherAddress}
                </textarea>
                {
                  errors.fatherAddress.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.fatherAddress.map((error, index) => (
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
                {
                  errors.incomeParent.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.incomeParent.map((error, index) => (
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
          </section>
          <section>
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
                {
                  errors.motherName.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.motherName.map((error, index) => (
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
                {
                  errors.motherPlaceOfBirth.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.motherPlaceOfBirth.map((error, index) => (
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
                  value={motherDateOfBirth}
                  onChange={(e) => setMotherDateOfBirth(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Tanggal Lahir Ibu"
                  required
                />
                {
                  errors.motherDateOfBirth.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.motherDateOfBirth.map((error, index) => (
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
                {
                  errors.motherEducation.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.motherEducation.map((error, index) => (
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
                {
                  errors.motherJob.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.motherJob.map((error, index) => (
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
                  required
                >
                  {motherAddress}
                </textarea>
                {
                  errors.motherAddress.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.motherAddress.map((error, index) => (
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
            <div className="grid grid-cols-1 md:gap-4">
              <button
                type="submit"
                className="flex justify-center items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {loading && <Loading width={5} height={5} fill="fill-sky-500" color="text-gray-200" />}
                Perbarui Data
              </button>
            </div>
          </section>
        </form>
      </div>
    </section>
  );
};

export default Keluarga;
