import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCheckCircle, faDesktop, faFilePdf, faSignOut, faSitemap, faTrophy, faUserCircle, faUsers, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import { jwtDecode } from 'jwt-decode'
import ServerError from "./errors/ServerError.jsx";
import LoadingScreen from "./LoadingScreen.jsx";
import AuthenticatedProfile from "../Layouts/AuthenticatedProfile.jsx";

import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import LogoTagline from '../assets/tagline-warna.png'

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });

  const [errorPage, setErrorPage] = useState(false);
  const [loading, setLoading] = useState(true);

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
        return navigate('/');
      }

      const decoded = jwtDecode(token);
      setUser(decoded.data);

      const fetchProfile = async (token) => {
        const response = await axios.get('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/profiles/v1', {
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
            const response = await axios.get('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/token/v3', {
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
              navigate('/')
            }
          }
        } else {
          console.error('Error fetching profile:', profileError);
          localStorage.removeItem('LP3ISBPMB:token');
          setErrorPage(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    } catch (error) {
      if (error.response) {
        if ([400, 403].includes(error.response.status)) {
          localStorage.removeItem('LP3ISBPMB:token');
          navigate('/');
        } else {
          console.error('Unexpected HTTP error:', error);
          setErrorPage(true);
        }
      } else if (error.request) {
        console.error('Network error:', error);
        setErrorPage(true);
      } else {
        console.error('Error:', error);
        setErrorPage(true);
      }
      navigate('/');
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
          navigate('/login');
          return;
        }
        const responseData = await axios.delete('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/logout/v3', {
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
            const response = await axios.get('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/token/v3', {
              withCredentials: true,
            });

            const newToken = response.data;
            const responseData = await axios.delete('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/logout/v3', {
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
        <AuthenticatedProfile>
          <main className="flex flex-col items-center justify-between bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 h-screen py-3">
            <nav className='flex items-center gap-3'>
              <img src={LogoLP3IPutih} alt="" width={180} />
              <img src={LogoTagline} alt="" width={115} />
            </nav>
            <div className='flex flex-col items-center justify-center gap-5 md:gap-8 max-w-3xl w-full mx-auto px-5 md:h-screen'>
              <section className='flex flex-col items-center text-center gap-1'>
                <h1 className='text-white text-xl font-medium'>Halo, {user.name}! 👋</h1>
                <p className='text-gray-200 text-sm'>Selamat datang <span className='underline'>{user.name}</span> dengan email <span className='underline'>{user.email}</span>. Lakukan registrasi mahasiswa baru dengan melengkapi isian dan langkah-langkah berikut.</p>
              </section>
              <section className='w-full grid grid-cols-2 md:grid-cols-4 items-center gap-3'>
                <Link to={`/pribadi`} className='flex flex-col items-center gap-1 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl space-y-1'>
                  <FontAwesomeIcon icon={faUserCircle} size='lg' className={validateData ? 'text-emerald-600' : 'text-red-600'} />
                  <p className='text-xs'>Data Pribadi</p>
                </Link>
                <Link to={`/orangtua`} className='flex flex-col items-center gap-1 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl space-y-1'>
                  <FontAwesomeIcon icon={faUsers} size='lg' className={(validateFather && validateMother) ? 'text-emerald-600' : 'text-red-600'} />
                  <p className='text-xs'>Data Orangtua</p>
                </Link>
                <Link to={`/programstudi`} className='flex flex-col items-center gap-1 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl space-y-1'>
                  <FontAwesomeIcon icon={faBook} size='lg' className={validateProgram ? 'text-emerald-600' : 'text-red-600'} />
                  <p className='text-xs'>Program Studi</p>
                </Link>
                <Link to={`/berkas`} className='flex flex-col items-center gap-1 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl space-y-1'>
                  <FontAwesomeIcon icon={faFilePdf} size='lg' className={validateFiles ? 'text-emerald-600' : 'text-red-600'} />
                  <p className='text-xs'>Unggah Berkas</p>
                </Link>
                <Link to={`/prestasi`} className='flex flex-col items-center gap-1 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl space-y-1'>
                  <FontAwesomeIcon icon={faTrophy} size='lg' />
                  <p className='text-xs'>Prestasi</p>
                </Link>
                <Link to={`/organisasi`} className='flex flex-col items-center gap-1 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl space-y-1'>
                  <FontAwesomeIcon icon={faSitemap} size='lg' />
                  <p className='text-xs'>Organisasi</p>
                </Link>
                {
                  validateData && validateFather && validateMother && validateProgram && validateFiles &&
                  <Link to={`/scholarship`} className='flex flex-col items-center gap-1 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl space-y-1'>
                    <FontAwesomeIcon icon={faDesktop} size='lg' />
                    <p className='text-xs'>CAT</p>
                  </Link>
                }
              </section>
              <section className='flex flex-col md:flex-row items-center gap-4'>
                {/* {
                validate ? (
                  <a href='https://wa.me?phone=6282219509698&text=Kirim%20pesan%20perintah%20ini%20untuk%20konfirmasi%20pendaftaran%20:confirmregistration:' target='_blank' className="text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
                    <span className='text-sm'>Konfirmasi Pendaftaran</span>
                    <FontAwesomeIcon icon={faWhatsapp} size='sm' />
                  </a>
                ) : (
                  <button type="button" className="text-white bg-red-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2" disabled>
                    <span className='text-sm'>Konfirmasi Belum Tersedia</span>
                    <FontAwesomeIcon icon={faXmarkCircle} size='sm' />
                  </button>
                )
              } */}
                <button type="button" onClick={logoutHandle} className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
                  <span className='text-sm'>Keluar</span>
                  <FontAwesomeIcon icon={faSignOut} size='sm' />
                </button>
              </section>
            </div>
            <p className='text-xs text-lp3i-50'>Copyright © 2024 Politeknik LP3I Kampus Tasikmalaya</p>
          </main>
        </AuthenticatedProfile>
      )
    )
  );
};

export default Dashboard;
