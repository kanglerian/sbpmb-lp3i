import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import checkExpiry from "../config/checkExpiry.js";
import Navigation from "../components/Navigation.jsx";

const Program = () => {
  const [student, setStudent] = useState([]);

  const [program, setProgram] = useState("");
  const [programSecond, setProgramSecond] = useState("");

  const [programs, setPrograms] = useState([]);

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
      .patch(`http://127.0.0.1:8000/api/user/updateprogram/${student.identity}`, {
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
        <Navigation />
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="w-full md:w-1/2 p-5">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel
              quisquam id consequuntur mollitia, reprehenderit aut dolorem
              fugiat doloribus a amet nobis cum nemo veniam doloremque nihil!
              Maxime provident nam porro voluptate quam quo, neque illo dolores.
              Beatae asperiores, assumenda fugiat ab modi deleniti ratione
              numquam quisquam eos error quia quidem in iste quibusdam dolorum
              eligendi consequuntur fuga commodi odit deserunt mollitia esse
              magnam tenetur? Placeat, repellendus voluptatibus? Ullam tempora
              quae deleniti laborum, temporibus sapiente repudiandae blanditiis
              quidem eum mollitia deserunt aliquam est minus necessitatibus ut
              culpa totam. Laboriosam recusandae magnam id earum sed corrupti.
              Similique, est tempora! Harum, expedita et!
            </p>
          </div>
          <form onSubmit={handleUpdate} className="w-full md:w-1/2 p-5">
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Program Studi Pilihan 1 {program}
              </label>
              
              <select
                onChange={(e) => setProgram(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                {
                  program && 
                  <option value={program}>{program}</option>
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
                <option value={programSecond}>{programSecond}</option>
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
