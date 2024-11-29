import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleDot, faSave } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import ServerError from './errors/ServerError'
import LoadingScreen from './LoadingScreen'

const Prodi = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  const [errorPage, setErrorPage] = useState(false);

  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program: '',
    program_second: '',
  });

  const [errors, setErrors] = useState({
    program: [],
    programSecond: [],
  });

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
        setFormData({
          program: profileData.applicant.program,
          program_second: profileData.applicant.program_second,
        });
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (profileError) {
        if (profileError.response && profileError.response.status === 403) {
          try {
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v3', {
              withCredentials: true,
            });

            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem('LP3ISBPMB:token', newToken);
            setUser(decodedNewToken.data);

            const newProfileData = await fetchProfile(newToken);
            setFormData({
              program: newProfileData.applicant.program,
              program_second: newProfileData.applicant.program_second,
            });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const saveHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({
      program: [],
      programSecond: [],
    });
    const token = localStorage.getItem('LP3ISBPMB:token');
    await axios.patch(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/applicants/updateprodi/v1/${user.identity}`, formData, {
      headers: {
        Authorization: token
      },
      withCredentials: true
    })
      .then((response) => {
        getInfo();
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        navigate('/dashboard');
        alert(response.data.message);
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 403) {
          try {
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v3', {
              withCredentials: true,
            });

            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem('LP3ISBPMB:token', newToken);
            setUser(decodedNewToken.data);

            const responseData = await axios.patch(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/applicants/updateprodi/v1/${user.identity}`, formData, {
              headers: {
                Authorization: newToken
              },
              withCredentials: true
            })

            getInfo();
            setTimeout(() => {
              setLoading(false);
            }, 2000);
            navigate('/dashboard');
            alert(responseData.data.message);

          } catch (error) {
            if (error.response && error.response.status === 422) {
              const errorArray = error.response.data.errors || [];
              const formattedErrors = errorArray.reduce((acc, err) => {
                if (!acc[err.path]) {
                  acc[err.path] = [];
                }
                acc[err.path].push(err.msg);
                return acc;
              }, {});
              const newAllErrors = {
                name: formattedErrors.name || [],
                gender: formattedErrors.gender || [],
                placeOfBirth: formattedErrors.place_of_birth || [],
                dateOfBirth: formattedErrors.date_of_birth || [],
                religion: formattedErrors.religion || [],
                school: formattedErrors.school || [],
                major: formattedErrors.major || [],
                class: formattedErrors.class || [],
                year: formattedErrors.year || [],
                incomeParent: formattedErrors.income_parent || [],
                socialMedia: formattedErrors.social_media || [],
                place: formattedErrors.place || [],
                rt: formattedErrors.rt || [],
                rw: formattedErrors.rw || [],
                postalCode: formattedErrors.postal_code || [],
              };
              setErrors(newAllErrors);
              setTimeout(() => {
                setLoading(false);
              }, 1000);
              alert('Silahkan periksa kembali form yang telah diisi, ada kesalahan pengisian.');
            } else {
              console.error('Error refreshing token or fetching profile:', error);
              if (error.response && error.response.status === 400) {
                localStorage.removeItem('LP3ISBPMB:token');
              } else {
                setErrorPage(true);
              }
            }
          }
        } else if (error.response && error.response.status === 422) {
          const errorArray = error.response.data.errors || [];
          const formattedErrors = errorArray.reduce((acc, err) => {
            if (!acc[err.path]) {
              acc[err.path] = [];
            }
            acc[err.path].push(err.msg);
            return acc;
          }, {});
          const newAllErrors = {
            program: formattedErrors.program || [],
            programSecond: formattedErrors.program_second || [],
          };
          setErrors(newAllErrors);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          alert('Silahkan periksa kembali form yang telah diisi, ada kesalahan pengisian.');
        } else {
          console.error('Error fetching profile:', error);
          setErrorPage(true);
        }
      });
  }

  const getPrograms = async () => {
    await axios
      .get(`https://endpoint.politekniklp3i-tasikmalaya.ac.id/programs`,{
        headers: {
          'lp3i-api-key': 'b35e0a901904d293'
        }
      })
      .then((res) => {
        const programsData = res.data;
        const results = programsData.filter((program) => program.type === "R" && (program.campus == 'Kampus Tasikmalaya' || program.campus == 'LP3I Tasikmalaya'));
        setPrograms(results);
      })
      .catch((err) => {
        let networkError = err.message == "Network Error";
        if (networkError) {
          alert("Mohon maaf, data program studi tidak bisa muncul. Periksa server.");
        } else {
          console.log(err.message);
        }
      });
  };

  useEffect(() => {
    getInfo();
    getPrograms();
  }, []);
  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 py-10 px-5 h-screen'>
          <form onSubmit={saveHandle} className='max-w-5xl w-full mx-auto shadow-xl'>
            <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
              <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Kembali</span>
              </Link>
              <h2 className='text-white text-center font-bold space-x-2'>
                <FontAwesomeIcon icon={faCircleDot} />
                <span>Data Program Studi</span>
              </h2>
              <div className='flex justify-center md:justify-end'>
                <img src={LogoLP3IPutih} alt="" width={150} />
              </div>
            </header>
            <div className='bg-white px-8 py-10 rounded-b-2xl'>
              <div className='space-y-5'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="program" className="block mb-2 text-sm font-medium text-gray-900">Program Studi 1</label>
                    <select id="program" name='program' value={formData.program} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="">Pilih</option>
                      {programs.length > 0 &&
                        programs.map((program) => (
                          <optgroup
                            label={`${program.level} ${program.title} - ${program.campus}`}
                            key={program.uuid}
                          >
                            {program.interests.length > 0 &&
                              program.interests.map((inter, index) => (
                                <option
                                  value={`${program.level} ${program.title}`}
                                  key={index}
                                >
                                  {inter.name}
                                </option>
                              ))}
                          </optgroup>
                        ))}
                    </select>
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.program.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.program.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="program_second" className="block mb-2 text-sm font-medium text-gray-900">Program Studi 2</label>
                    <select id="program_second" name='program_second' value={formData.program_second} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="">Pilih</option>
                      {programs.length > 0 &&
                        programs.map((program) => (
                          <optgroup
                            label={`${program.level} ${program.title} - ${program.campus}`}
                            key={program.uuid}
                          >
                            {program.interests.length > 0 &&
                              program.interests.map((inter, index) => (
                                <option
                                  value={`${program.level} ${program.title}`}
                                  key={index}
                                >
                                  {inter.name}
                                </option>
                              ))}
                          </optgroup>
                        ))}
                    </select>
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.programSecond.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.programSecond.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                </div>
                <hr />
                <button type="submit" className="text-white bg-lp3i-200 hover:bg-lp3i-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
                  <FontAwesomeIcon icon={faSave} />
                  <span>Simpan perubahan</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      )
    )
  )
}

export default Prodi