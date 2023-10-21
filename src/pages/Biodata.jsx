import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import checkExpiry from "../config/checkExpiry.js";
import Navigation from "../components/Navigation.jsx";

const Biodata = () => {
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
      .get("https://pmb.politekniklp3i-tasikmalaya.ac.id/api/user/get", {
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
      });
  };

  const getSchools = async () => {
    await axios
      .get(`https://pmb.politekniklp3i-tasikmalaya.ac.id/api/school/getall`)
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
        console.log(err.message);
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
      .patch(`https://pmb.politekniklp3i-tasikmalaya.ac.id/api/user/update/${student.identity}`, {
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
        alert('Data sudah diperbarui!');
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
    getSchools();
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
                Nomor Induk Siswa Nasional (NISN)
              </label>
              <input
                type="number"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="NISN"
                required
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
            </div>

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
            </div>

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
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Tempat Lahir {placeOfBirth}
              </label>
              <input
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Tempat Lahir"
                required
              />
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
                    value={gender}
                    onClick={() => setGender(1)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    checked={gender == 1 ? true : false}
                  />
                  <label
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Laki-laki
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    value={gender}
                    onClick={() => setGender(0)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    checked={gender == 0 ? true : false}
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
                placeholder="No. Telpon (Whatsapp}"
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
