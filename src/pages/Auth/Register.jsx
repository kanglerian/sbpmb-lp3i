import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import logoLP3I from "../../assets/logo/lp3i.svg";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nisn, setNisn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  const [selectedSchool, setSelectedSchool] = useState(null);

  const [schoolsAPI, setSchoolsAPI] = useState([]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if(password != passwordConf){
      return alert('Kata sandi tidak sama!');
    };

    try {
      const response = await axios.post("https://pmb.politekniklp3i-tasikmalaya.ac.id/api/register", {
        name: name,
        nisn: nisn,
        email: email,
        phone: phone,
        school: school,
        password: password,
        password_confirmation: passwordConf,
      });
      if (response.data.info) {
        if (response.data.login) {
          let confirmed = confirm(
            `${response.data.message}`
          );
          if (confirmed) {
            let message = `Hore! Anda telah berhasil terdaftar. Sekarang saatnya untuk memulai pengisian data Anda! Silakan masuk ke akun Anda menggunakan detail berikut:\n\nEmail: ${response.data.user.email}\nKata Sandi: ${response.data.user.phone}\n\nKunjungi situs web kami di https://sbpmb.politekniklp3i-tasikmalaya.ac.id dan jangan ragu untuk bertanya kepada admin jika belum mengerti!`;
            let target = `${response.data.user.phone}@c.us`;
            await axios
              .post(
                `https://api.politekniklp3i-tasikmalaya.ac.id/whatsappbot/send`,
                {
                  target: target,
                  message: message,
                }
              )
              .then((res) => {
                navigate('/login');
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          let confirmed = confirm(
            `${response.data.message}`
          );
          if (confirmed) {
            if (response.data.applicant.name) {
              setName(response.data.applicant.name);
            }

            if (response.data.applicant.nisn) {
              setNisn(response.data.applicant.nisn);
            }

            if (response.data.applicant.school) {
              setSelectedSchool({
                value: response.data.applicant.school_applicant.id,
                label: response.data.applicant.school_applicant.name,
              });
              setSchool(response.data.applicant.school);
            }

            if (response.data.applicant.email) {
              setEmail(response.data.applicant.email);
            }

            if (response.data.applicant.phone) {
              setPhone(response.data.applicant.phone);
            }
          }
        }
      } else {
        return navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
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
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
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

          <div className="flex gap-5">
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
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-full mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Kata Sandi
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Kata sandi"
                required
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="password_confirmation"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                id="password_confirmation"
                value={passwordConf}
                onChange={(e) => setPasswordConf(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Konfirmasi kata sandi"
                required
              />
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
