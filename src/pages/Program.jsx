import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../templates/Navbar.jsx";
import { Link } from "react-router-dom";
import Loading from "../components/Loading.jsx";

const Program = () => {
  const [student, setStudent] = useState({});
  const [program, setProgram] = useState("");
  const [programs, setPrograms] = useState([]);
  const [programSecond, setProgramSecond] = useState("");

  const [loading, setLoading] = useState(false);

  let start = true;
  const [scholarship, setScholarship] = useState(false);

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

  const getPrograms = async () => {
    await axios
      .get(`https://dashboard.politekniklp3i-tasikmalaya.ac.id/api/programs`)
      .then((res) => {
        let programsData = res.data;
        let results = programsData.filter((program) => program.regular == "1" && (program.campus == 'Kampus Tasikmalaya' || program.campus == 'LP3I Tasikmalaya'));
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
    setLoading(true);
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
        setLoading(false);
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
          setLoading(false);
        } else {
          alert('Server sedang bermasalah.')
          setLoading(false);
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
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <div className="mb-5">
                <label className="flex flex-col gap-1 block mb-3 text-sm font-medium text-gray-900">
                  <span>Program Studi Pilihan 2:</span>
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
                <label className="flex flex-col gap-1 block mb-3 text-sm font-medium text-gray-900">
                  <span>Program Studi Pilihan 2:</span>
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

export default Program;
