import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import logoLP3I from "../../assets/logo/lp3i.svg";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [icon, setIcon] = useState(false);

  const [name, setName] = useState("");
  const [nisn, setNisn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  const [selectedSchool, setSelectedSchool] = useState(null);

  const [schoolsAPI, setSchoolsAPI] = useState([]);

  const [errors, setErrors] = useState({
    name: [],
    nisn: [],
    school: [],
    email: [],
    phone: [],
    year: [],
    password: [],
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password != passwordConf) {
      return alert("Kata sandi tidak sama!");
    }

    await axios
      .post(`https://database.politekniklp3i-tasikmalaya.ac.id/api/register`, {
        name: name,
        nisn: nisn,
        email: email,
        phone: phone,
        school: school,
        year: year,
        password: password,
        password_confirmation: passwordConf,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        alert('Berhasil mendaftar!');
        navigate('/dashboard');
      })
      .catch((error) => {
        if (error.code !== 'ERR_NETWORK') {
          const nameError = error.response.data.message.name || [];
          const nisnError = error.response.data.message.nisn || [];
          const schoolError = error.response.data.message.school || [];
          const emailError = error.response.data.message.email || [];
          const phoneError = error.response.data.message.phone || [];
          const passwordError = error.response.data.message.password || [];
          const yearError = error.response.data.message.year || [];
          const newAllErrors = {
            name: nameError,
            nisn: nisnError,
            school: schoolError,
            email: emailError,
            phone: phoneError,
            password: passwordError,
            year: yearError,
          };
          setErrors(newAllErrors);
          alert(error.response.data.message);
        } else {
          alert('Server sedang bermasalah.')
        }
      });
  };

  const getSchools = async () => {
    await axios
      .get(
        `https://database.politekniklp3i-tasikmalaya.ac.id/api/school/getall`
      )
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

  const handlePhoneChange = (e) => {
    let input = e.target.value;

    if (input.startsWith("62")) {
      setPhone(input);
    } else if (input.startsWith("0")) {
      setPhone("62" + input.substring(1));
    } else {
      setPhone("62");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
    getSchools();
  }, []);

  return (
    <div className="bg-gray-50">
      <section className="flex flex-col container justify-center items-center mx-auto md:h-screen gap-5 p-5">
        <Link to={`/`}>
          <img src={logoLP3I} className="w-52" />
        </Link>
        <form
          onSubmit={handleRegister}
          className="w-full md:w-1/2 bg-white p-5 rounded-xl border border-gray-200 mx-auto"
        >
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Nama lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Isi dengan nama lengkap anda..."
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
            <label
              htmlFor="nisn"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              NISN
            </label>
            <input
              type="number"
              id="nisn"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Isi dengan NISN anda..."
              required
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

          <div className="flex flex-col md:flex-row md:gap-5">
            <div className="w-full md:w-1/2 mb-5">
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
            <div className="w-full md:w-1/2 mb-5">
              <label
                htmlFor="year"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Tahun Lulus
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Isi dengan tahun lulus anda..."
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

          <div className="flex flex-col md:flex-row md:gap-5">
            <div className="w-full mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Isi dengan Email anda..."
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
            <div className="w-full mb-5">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                No. Whatsapp
              </label>
              <input
                type="number"
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Isi dengan No. Whatsapp anda..."
                required
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

          <div className="flex flex-col md:flex-row md:gap-5">

            <div className="w-full mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Kata sandi
              </label>
              <div className="flex">
                <span
                  onClick={() => setIcon(!icon)}
                  className="inline-flex items-center px-3 text-sm text-gray-700 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md"
                >
                  {icon ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </span>
                <input
                  type={icon ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="Kata Kunci"
                  required
                />
              </div>
              {
                errors.password.length > 0 ? (
                  <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                    {errors.password.map((error, index) => (
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

            <div className="w-full">
              <label
                htmlFor="password_confirmation"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="flex">
                <span
                  onClick={() => setIcon(!icon)}
                  className="inline-flex items-center px-3 text-sm text-gray-700 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md"
                >
                  {icon ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </span>
                <input
                  type={icon ? "text" : "password"}
                  id="password_confirmation"
                  value={passwordConf}
                  onChange={(e) => setPasswordConf(e.target.value)}
                  className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="Konfirmasi kata sandi"
                  required
                />
              </div>
              {
                errors.password.length > 0 ? (
                  <ul className="ml-5 mt-2 text-xs text-red-600 list-disc">
                    {errors.password.map((error, index) => (
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
          <hr className="my-5" />
          <div className="flex flex-col md:flex-row items-center gap-5">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Daftar
            </button>
            <Link to={`/login`}>
              <button className="text-sm text-gray-600 underline">
                Sudah memiliki akun? Daftar disini.
              </button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;
