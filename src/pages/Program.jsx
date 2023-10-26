import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import checkExpiry from "../config/checkExpiry.js";
import Navbar from "../templates/Navbar.jsx";

const Program = () => {
  const [student, setStudent] = useState([]);

  const [program, setProgram] = useState("");
  const [programSecond, setProgramSecond] = useState("");

  const [programs, setPrograms] = useState([]);

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
        setProgram(applicant.program);
        setProgramSecond(applicant.program_second);
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

  const getPrograms = async () => {
    await axios
      .get(`https://dashboard.politekniklp3i-tasikmalaya.ac.id/api/programs`)
      .then((res) => {
        let programsData = res.data;
        setPrograms(programsData);
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
        }
      )
      .then((res) => {
        alert("Data program studi sudah diperbarui!");
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

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
    getPrograms();
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
                Program Studi Pilihan 1:{" "}
                <span className="underline">{program}</span>
              </label>
              <select
                value={program || 0}
                onChange={(e) => setProgram(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                {program ? (
                  <option value={program}>
                    {program}
                  </option>
                ) : (
                  <option value={0}>
                    Pilih Program Studi
                  </option>
                )}

                {programs.length > 0 &&
                  programs
                    .map((program) => (
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
                  <option value={programSecond}>
                    {programSecond}
                  </option>
                ) : (
                  <option value={0}>
                    Pilih Program Studi
                  </option>
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
