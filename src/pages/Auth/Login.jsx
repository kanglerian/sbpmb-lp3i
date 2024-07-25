import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LP3IPutih from '../../assets/logo/logo-lp3i-putih.svg';
import KampusMandiriPutih from '../../assets/logo/kampusmandiri-putih.png';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();

    await axios
      .post(`https://database.politekniklp3i-tasikmalaya.ac.id/api/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.response.status == 401) {
          alert(error.response.data.message);
        } else {
          console.log(error);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 h-screen p-5 space-y-4">
      <Link to={`/`} className='flex items-center gap-3 py-3'>
        <img src={LP3IPutih} alt="" width={180} />
        <img src={KampusMandiriPutih} alt="" width={110} />
      </Link>
      <h3 className='inline-block py-2.5 px-4 text-sm text-white rounded-xl font-medium border border-gray-300'>SBPMB LP3I - Global Mandiri Utama Foundation</h3>
      <section className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-xl space-y-6">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Kata Sandi
            </label>
            <div className='flex relative gap-2'>
              <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="Password" required />
              <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute text-gray-400 hover:text-gray-500 right-4 top-1/2 transform -translate-y-1/2'>
                <FontAwesomeIcon icon={faEye} />
              </button>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            {
              loading ? (
                <div role="status">
                  <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin fill-lp3i-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <button type="submit" className="text-white bg-lp3i-200 hover:bg-lp3i-300  font-medium rounded-xl text-sm px-5 py-2.5 text-center inline-flex items-center gap-2">
                  <span>Masuk</span>
                  <FontAwesomeIcon icon={faRightToBracket} />
                </button>
              )
            }
            <Link to={`/register`} className="text-gray-700 font-medium rounded-xl text-sm text-center">
              <span>Belum punya akun? </span>
              <span className='underline font-semibold'>Daftar disini</span>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
