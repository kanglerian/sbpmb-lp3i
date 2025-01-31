import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCheckCircle, faFilePdf, faSignOut, faUserCircle, faUsers, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import LogoLP3IPutih from '../assets/logo/logo-lp3i-putih.svg'
import KampusMandiriPutih from '../assets/logo/kampusmandiri-putih.png';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import ServerError from '../errors/ServerError';
import LoadingScreen from '../components/LoadingScreen';
import { faComputer } from '@fortawesome/free-solid-svg-icons/faComputer'

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  const [errorPage, setErrorPage] = useState(false);

  const [validate, setValidate] = useState(false);
  const [validateData, setValidateData] = useState(false);
  const [validateFather, setValidateFather] = useState(false);
  const [validateMother, setValidateMother] = useState(false);
  const [validateProgram, setValidateProgram] = useState(false);
  const [validateFiles, setValidateFiles] = useState(false);

  const getInfo = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('LP3ISBPMB:token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const decoded = jwtDecode(token);
      setUser(decoded.data);

      const fetchProfile = async (token) => {
        const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/profiles/v1', {
          headers: { Authorization: token },
          withCredentials: true,
        });
        return response.data;
      };

      try {
        const profileData = await fetchProfile(token);
        setValidateData(profileData.validate.validate_data);
        setValidateFather(profileData.validate.validate_father);
        setValidateMother(profileData.validate.validate_mother);
        setValidateProgram(profileData.validate.validate_program);
        setValidateFiles(profileData.validate.validate_files);
        setValidate(profileData.validate.validate);
      } catch (profileError) {
        if (profileError.response && profileError.response.status === 403) {
          try {
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v1', {
              withCredentials: true,
            });

            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem('LP3ISBPMB:token', newToken);
            setUser(decodedNewToken.data);

            const newProfileData = await fetchProfile(newToken);
            setValidateData(newProfileData.validate.validate_data);
            setValidateFather(newProfileData.validate.validate_father);
            setValidateMother(newProfileData.validate.validate_mother);
            setValidateProgram(newProfileData.validate.validate_program);
            setValidateFiles(newProfileData.validate.validate_files);
            setValidate(newProfileData.validate.validate);
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

  const logoutHandle = async () => {
    const confirmed = confirm('Apakah anda yakin akan keluar?');
    if (confirmed) {
      try {
        const token = localStorage.getItem('LP3ISBPMB:token');
        if (!token) {
          console.log('Token tidak ditemukan saat logout');
          navigate('/login');
          return;
        }
        const responseData = await axios.delete('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/logout/v1', {
          headers: {
            Authorization: token
          }
        });
        if (responseData) {
          alert(responseData.data.message);
          localStorage.removeItem('LP3ISBPMB:token');
          navigate('/login')
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v1', {
              withCredentials: true,
            });

            const newToken = response.data;
            const responseData = await axios.delete('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/logout/v1', {
              headers: {
                Authorization: newToken
              }
            });
            if (responseData) {
              alert(responseData.data.message);
              localStorage.removeItem('LP3ISBPMB:token');
              navigate('/login')
            }
          } catch (error) {
            console.error('Error refreshing token or fetching profile:', error);
            if (error.response && error.response.status === 400) {
              localStorage.removeItem('LP3ISBPMB:token');
            }
            if (error.response && error.response.status === 401) {
              localStorage.removeItem('LP3ISBPMB:token');
            }
          }
        } else {
          console.error('Error fetching profile:', error);
          setErrorPage(true);
        }
      }
    }
  }

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
        <main className="flex flex-col items-center justify-between bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 md:h-screen pt-5 pb-2">
          <nav className='flex items-center gap-3 py-3'>
            <img src={LogoLP3IPutih} alt="" width={180} />
            <img src={KampusMandiriPutih} alt="" width={110} />
          </nav>
          <div className='flex flex-col items-center justify-center gap-5 md:gap-8 max-w-3xl w-full mx-auto px-5 h-screen md:h-full'>
            <section className='flex flex-col items-center text-center gap-1'>
              <h1 className='text-white text-xl font-medium'>Halo, {user.name}! 👋</h1>
              <p className='text-gray-200 text-sm'>Selamat datang <span className='underline'>{user.name}</span> dengan email <span className='underline'>{user.email}</span>. Lakukan registrasi mahasiswa baru dengan melengkapi isian dan langkah-langkah berikut.</p>
            </section>
            <section className='w-full grid grid-cols-1 md:grid-cols-4 items-center gap-3'>
              <Link to={`/pribadi`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
                <FontAwesomeIcon icon={faUserCircle} size='lg' />
                <p className='space-x-2'>
                  <span className='text-sm'>Data Pribadi</span>
                  {
                    validateData ? (
                      <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
                    ) : (
                      <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
                    )
                  }
                </p>
              </Link>
              <Link to={`/orangtua`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
                <FontAwesomeIcon icon={faUsers} size='lg' />
                <p className='space-x-2'>
                  <span className='text-sm'>Data Orangtua</span>
                  {
                    validateFather && validateMother ? (
                      <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
                    ) : (
                      <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
                    )
                  }
                </p>
              </Link>
              <Link to={`/programstudi`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
                <FontAwesomeIcon icon={faBook} size='lg' />
                <p className='space-x-2'>
                  <span className='text-sm'>Program Studi</span>
                  {
                    validateProgram ? (
                      <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
                    ) : (
                      <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
                    )
                  }
                </p>
              </Link>
              <Link to={`/berkas`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
                <FontAwesomeIcon icon={faFilePdf} size='lg' />
                <p className='space-x-2'>
                  <span className='text-sm'>Unggah Berkas</span>
                  {
                    validateFiles ? (
                      <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
                    ) : (
                      <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
                    )
                  }
                </p>
              </Link>
            </section>
            <section className='flex flex-col md:flex-row items-center gap-4'>
              {/* {
                validate && ( */}
                  <Link to={`/scholarship`} className="text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
                    <span className='text-sm'>Mulai Tes Sekarang</span>
                    <FontAwesomeIcon icon={faComputer} size='sm' />
                  </Link>
                {/* )
              } */}
              <button type="button" onClick={logoutHandle} className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
                <span className='text-sm'>Keluar</span>
                <FontAwesomeIcon icon={faSignOut} size='sm' />
              </button>
            </section>
          </div>
          <p className='text-xs text-lp3i-50'>Copyright © 2024 Politeknik LP3I Kampus Tasikmalaya</p>
        </main>
      )
    )
  )
}

export default Dashboard