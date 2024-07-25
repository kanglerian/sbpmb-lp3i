import { useEffect } from 'react';
import Lottie from 'lottie-react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import LP3IPutih from '../assets/logo/logo-lp3i-putih.svg';
import KampusMandiriPutih from '../assets/logo/kampusmandiri-putih.png';
import animation from "../assets/animations/server.json";
import { faFileLines } from '@fortawesome/free-regular-svg-icons';

const Home = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 md:h-screen">
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 items-center mx-auto gap-5">
        <div className="text-white space-y-6 p-5">
          <header className="flex items-center gap-5 py-5">
            <img src={LP3IPutih} alt="" width={170} />
            <img src={KampusMandiriPutih} alt="" width={130} />
          </header>
          <div className='space-y-6'>
            <h3 className='inline-block py-2.5 px-4 text-xs md:text-sm rounded-xl font-medium border border-gray-300'>SBPMB LP3I - Global Mandiri Utama Foundation</h3>
            <div className='space-y-2'>
              <h2 className='font-bold text-3xl md:text-4xl'>Gebyar Beasiswa Politeknik LP3I Se-Indonesia</h2>
              <p className='text-sm md:text-base'>Temukan langkah terbaik untuk meraih impianmu! Bergabunglah dengan
                Politeknik LP3I Kampus Tasikmalaya dan jadilah bagian dari perubahan
                yang lebih baik.</p>
            </div>
            <div className='flex items-center gap-3'>
              <Link to={`/register`}>
                <button
                  type="button"
                  className="text-white bg-lp3i-600 hover:bg-lp3i-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-1"
                >
                  <span>Daftar Sekarang</span>
                  <FontAwesomeIcon icon={faFileLines} />
                </button>
              </Link>
              <Link to={`/login`}>
                <button
                  type="button"
                  className="py-2.5 px-5 space-x-1 text-sm font-medium text-lp3i-700 focus:outline-none bg-white rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-lp3i-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                >
                  <span>Masuk</span>
                  <FontAwesomeIcon icon={faRightToBracket} />
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full'>
            <Lottie animationData={animation} loop={true} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
