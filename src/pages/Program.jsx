import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../templates/Navbar.jsx";

const Program = () => {
  const [student, setStudent] = useState({});
  const [program, setProgram] = useState("");
  const [programs, setPrograms] = useState([]);
  const [programSecond, setProgramSecond] = useState("");

  const [errors, setErrors] = useState({
    program: [],
    programSecond: [],
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
        setProgram(response.data.applicant.program);
        setProgramSecond(response.data.applicant.program_second);
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

  const getPrograms = async () => {
    await axios
      .get(`https://dashboard.politekniklp3i-tasikmalaya.ac.id/api/programs`)
      .then((res) => {
        let programsData = res.data;
        let results = programsData.filter((program) => program.regular == "1");
        setPrograms(results);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios
      .patch(
        `https://database.politekniklp3i-tasikmalaya.ac.id/api/user/updateprogram/${student.identity}`,
        {
          program: program == 0 ? "" : program,
          program_second: programSecond == 0 ? "" : programSecond,
        }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      )
      .then((res) => {
        alert("Data program studi sudah diperbarui!");
        getUser();
      })
      .catch((error) => {
        if (error.code !== 'ERR_NETWORK') {
          const programError = error.response.data.message.program || [];
          const programSecondError = error.response.data.message.program_second || [];
          const newAllErrors = {
            program: programError,
            programSecond: programSecondError,
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
    getPrograms();
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
                <h5 className="text-sm text-gray-900 font-bold">Program Studi</h5>
                <ul className="space-y-2 text-sm list-disc ml-5">
                  <li className="space-x-2">
                    <span className="text-gray-900">Program 1</span>
                    {student.program ? (
                      <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                    )}
                  </li>
                  <li className="space-x-2">
                    <span className="text-gray-900">Program 2</span>
                    {student.program_second ? (
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
                  Program Studi Pilihan 1:{" "}
                  <span className="underline text-md font-bold">{program}</span>
                </label>
                <select
                  value={program || 0}
                  onChange={(e) => setProgram(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  {program ? (
                    <option value={program}>{program}</option>
                  ) : (
                    <option value={0}>Pilih Program Studi</option>
                  )}

                  {programs.length > 0 &&
                    programs.map((program) => (
                      <optgroup
                        style={{ background: "red" }}
                        label={`${program.level} ${program.title}`}
                        key={program.uuid}
                      >
                        {program.interest.length > 0 &&
                          program.interest.map((inter, index) => (
                            <option
                              value={`${program.level} ${program.title}`}
                              key={index}
                            >
                              {inter.name}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                </select>
                {
                  errors.program.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.program.map((error, index) => (
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
                  Program Studi Pilihan 2:{" "}
                  <span className="underline text-md font-bold">
                    {programSecond}
                  </span>
                </label>
                <select
                  value={programSecond || 0}
                  onChange={(e) => setProgramSecond(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  {programSecond ? (
                    <option value={programSecond}>{programSecond}</option>
                  ) : (
                    <option value={0}>Pilih Program Studi</option>
                  )}

                  {programs.length > 0 &&
                    programs.map((program) => (
                      <optgroup
                        label={`${program.level} ${program.title} - ${program.campus}`}
                        key={program.uuid}
                      >
                        {program.interest.length > 0 &&
                          program.interest.map((inter, index) => (
                            <option
                              value={`${program.level} ${program.title}`}
                              key={index}
                            >
                              {inter.name}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                </select>
                {
                  errors.programSecond.length > 0 ? (
                    <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                      {errors.programSecond.map((error, index) => (
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
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Perbarui Data
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Program;
