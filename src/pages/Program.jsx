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
      .get("https://pmb.politekniklp3i-tasikmalaya.ac.id/api/user/get", {
        params: {
          identity: identity,
          token: token,
        },
      })
      .then((res) => {
        console.log();
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
        console.log(err.message);
      });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios
      .patch(`https://pmb.politekniklp3i-tasikmalaya.ac.id/api/user/updateprogram/${student.identity}`, {
        program: program,
        program_second: programSecond,
      })
      .then((res) => {
        alert("Data program studi sudah diperbarui!");
        getUser();
      })
      .catch((err) => {
        console.log(err.message);
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
        <Navbar/>
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
                Program Studi Pilihan 1
              </label>
              
              <select
                onChange={(e) => setProgram(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                {
                  program && 
                  <option value={program} selected>{program}</option>
                }
                {programs.map((program) => (
                  <option value={program.title}>{program.title}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Program Studi Pilihan 2
              </label>
              <select
                onChange={(e) => setProgramSecond(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
              {
                programSecond && 
                <option value={programSecond} selected>{programSecond}</option>
              }
                {programs.map((program) => (
                  <option value={program.title}>{program.title}</option>
                ))}
              </select>
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

export default Program;
