import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleCheck, faCircleDot, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import DattebayoSound from '../assets/sounds/dattebayo.mp3';
import LogoLP3IPutih from '../assets/logo/logo-lp3i-putih.svg'

import ServerError from '../errors/ServerError'
import LoadingScreen from '../components/LoadingScreen'

const Scholarship = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [errorPage, setErrorPage] = useState(false);

  const [categories, setCategories] = useState([]);
  const [histories, setHistories] = useState([]);

  const dattebayoPlay = () => {
    let audio = new Audio(DattebayoSound);
    audio.play();
  }

  const getHistories = async (identity) => {
    try {
      const categoriesResponse = await axios.get(
        `https://sbpmb-backend.politekniklp3i-tasikmalaya.ac.id/categories`, {
        headers: {
          'lp3i-api-key': '5070de3b8c238dc6'
        }
      }
      );
      const historiesResponse = await axios.get(
        `https://sbpmb-backend.politekniklp3i-tasikmalaya.ac.id/histories?identity_user=${identity}`, {
        headers: {
          'lp3i-api-key': '5070de3b8c238dc6'
        }
      }
      );
      if (categoriesResponse.data && historiesResponse.data) {
        const filterResponse = categoriesResponse.data.filter(
          (question) =>
            !historiesResponse.data.some(
              (record) => record.category_id === question.id
            )
        );
        if (filterResponse.length > 0) {
          setCategories(filterResponse);
        } else {
          setCategories([]);
        }
        setHistories(historiesResponse.data);
        setMessage('Berikut ini adalah kategori soal yang harus dikerjakan.')
      } else {
        setMessage('Tidak ada kategori soal yang harus dikerjakan.')
      }
    } catch (error) {
      setMessage('Server tes beasiswa sedang tidak tersedia. Silahkan periksa kembali secara berkala.')
      console.log(error.message);
    }
  };

  const getInfo = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('LP3ISBPMB:token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const decoded = jwtDecode(token);
      const fetchProfile = async (token) => {
        const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/profiles/v1', {
          headers: { Authorization: token },
          withCredentials: true,
        });
        return response.data;
      };

      try {
        const profileData = await fetchProfile(token);
        getHistories(profileData.applicant.identity);
        if (!profileData.validate.validate) {
          return navigate('/dashboard');
        }
        const data = {
          id: decoded.data.id,
          identity: profileData.applicant.identity,
          name: profileData.applicant.name,
          email: profileData.applicant.email,
          phone: profileData.applicant.phone,
          school: profileData.applicant.school,
          classes: profileData.applicant.class,
          status: decoded.data.status,
        };
        setUser(data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (profileError) {
        if (profileError.response && profileError.response.status === 403) {
          try {
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v1', {
              withCredentials: true,
            });

            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem('LP3ISBPMB:token', newToken);
            const newProfileData = await fetchProfile(newToken);
            getHistories(newProfileData.applicant.identity);
            if (!newProfileData.validate.validate) {
              return navigate('/dashboard');
            }
            const data = {
              id: decodedNewToken.data.id,
              identity: newProfileData.applicant.identity,
              name: newProfileData.applicant.name,
              email: newProfileData.applicant.email,
              phone: newProfileData.applicant.phone,
              school: newProfileData.applicant.school,
              classes: newProfileData.applicant.class,
              status: decodedNewToken.data.status,
            };
            setUser(data);
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          } catch (error) {
            console.error('Error refreshing token or fetching profile:', error);
            if (error.response && error.response.status === 400) {
              localStorage.removeItem('LP3ISBPMB:token');
            } else {
              setErrorPage(true);
            }
          }
        } else {
          console.error('Error fetching profile:', profileError);
          setErrorPage(true);
        }
      }
    } catch (error) {
      if (error.response) {
        if ([400, 403].includes(error.response.status)) {
          localStorage.removeItem('LP3ISBPMB:token');
          navigate('/login');
        } else {
          console.error('Unexpected HTTP error:', error);
        }
      } else if (error.request) {
        console.error('Network error:', error);
      } else {
        console.error('Error:', error);
        setErrorPage(true);
      }
      navigate('/login');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleSelect = async (id) => {
    setLoading(true);
    await axios
      .post(`https://sbpmb-backend.politekniklp3i-tasikmalaya.ac.id/histories`, {
        identity_user: user.identity,
        category_id: id,
      }, {
        headers: {
          'lp3i-api-key': '5070de3b8c238dc6'
        }
      })
      .then(() => {
        navigate("/seleksi-beasiswa", { state: { id: id } });
        setLoading(false);
        dattebayoPlay();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getInfo();
  }, []);
  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 py-10 px-5 h-screen'>
          <section className='max-w-5xl w-full mx-auto shadow-xl'>
            <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
              <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Kembali</span>
              </Link>
              <h2 className='text-white text-center font-bold space-x-2'>
                <FontAwesomeIcon icon={faCircleDot} />
                <span>Ujian Online</span>
              </h2>
              <div className='flex justify-center md:justify-end'>
                <img src={LogoLP3IPutih} alt="" width={150} />
              </div>
            </header>
            <section className='bg-white p-5 space-y-4'>
              <p className='text-sm text-center'>{message}</p>
              <div className="grid grid-cols-1 md:grid-cols-3">
                {histories.length > 0 &&
                  histories.map((history) => (
                    <button key={history.id} className="p-2">
                      <div className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-2xl text-sm">
                        <span className="mr-2">{history.category.name}</span>
                        <FontAwesomeIcon icon={faCircleCheck} />
                      </div>
                    </button>
                  ))}
                {categories.length > 0 &&
                  categories.map((category) => (
                    <button
                      onClick={() => handleSelect(category.id)}
                      key={category.id}
                      className="p-2"
                      disabled={loading}
                    >
                      <div className="cursor-pointer bg-red-500 hover:bg-red-600 text-white p-6 rounded-2xl text-sm">
                        <span className="mr-2">{category.name}</span>
                        <FontAwesomeIcon icon={faCircleXmark} />
                      </div>
                    </button>
                  ))}
              </div>
            </section>
          </section>
        </main>
      )
    )
  )
}

export default Scholarship