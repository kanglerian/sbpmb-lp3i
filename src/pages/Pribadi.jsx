import { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { jwtDecode } from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleDot, faEdit, faSave } from '@fortawesome/free-solid-svg-icons'
import { getProvinces, getRegencies, getDistricts, getVillages } from '../utilities/StudentAddress.js'
import axios from 'axios';
import LogoLP3IPutih from '../assets/logo/logo-lp3i-putih.svg'
import ServerError from '../errors/ServerError'
import LoadingScreen from '../components/LoadingScreen'

const Pribadi = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  const [errorPage, setErrorPage] = useState(false);

  const [editAddress, setEditAddress] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolsAPI, setSchoolsAPI] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    place_of_birth: '',
    date_of_birth: '',
    religion: '',
    school: '',
    major: '',
    class: '',
    year: '',
    income_parent: '',
    social_media: '',
    province: '',
    regency: '',
    district: '',
    village: '',
    place: '',
    rt: '',
    rw: '',
    postal_code: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    name: [],
    gender: [],
    placeOfBirth: [],
    dateOfBirth: [],
    religion: [],
    school: [],
    major: [],
    class: [],
    year: [],
    incomeParent: [],
    socialMedia: [],
    place: [],
    rt: [],
    rw: [],
    postalCode: [],
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
        setEditAddress(false);
        setFormData({
          name: profileData.applicant.name,
          gender: profileData.applicant.gender,
          place_of_birth: profileData.applicant.place_of_birth,
          date_of_birth: profileData.applicant.date_of_birth,
          religion: profileData.applicant.religion,
          major: profileData.applicant.major,
          class: profileData.applicant.class,
          year: profileData.applicant.year,
          income_parent: profileData.applicant.income_parent,
          social_media: profileData.applicant.social_media,
          school: profileData.applicant.school_id,
          address: profileData.applicant.address,
        });
        if (profileData.applicant.school_id) {
          setSelectedSchool({
            value: profileData.applicant.school_id,
            label: profileData.applicant.school
          });
        }
        if (!profileData.applicant.address) {
          setEditAddress(true);
        }
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
            setUser(decodedNewToken.data);
            const newProfileData = await fetchProfile(newToken);
            setEditAddress(false);
            setFormData({
              name: newProfileData.applicant.name,
              gender: newProfileData.applicant.gender,
              place_of_birth: newProfileData.applicant.place_of_birth,
              date_of_birth: newProfileData.applicant.date_of_birth,
              religion: newProfileData.applicant.religion,
              major: newProfileData.applicant.major,
              class: newProfileData.applicant.class,
              year: newProfileData.applicant.year,
              income_parent: newProfileData.applicant.income_parent,
              social_media: newProfileData.applicant.social_media,
              school: newProfileData.applicant.school_id,
              address: newProfileData.applicant.address,
            });
            if (newProfileData.applicant.school_id) {
              setSelectedSchool({
                value: newProfileData.applicant.school_id,
                label: newProfileData.applicant.school
              });
            }
            if (!newProfileData.applicant.address) {
              setEditAddress(true);
            }
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

  const getSchools = async () => {
    await axios
      .get(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/schools`,{
        headers: {
          'lp3i-api-key': 'aEof9XqcH34k3g6IbJcQLxGY'
        }
      })
      .then((response) => {
        let bucket = [];
        let dataSchools = response.data;
        dataSchools.forEach((data) => {
          bucket.push({
            value: data.id,
            label: data.name,
          });
        });
        setSchoolsAPI(bucket);
      })
      .catch((error) => {
        if (error.code === 'ERR_NETWORK') {
          setErrorPage(true);
        } else if (error.code === 'ECONNABORTED') {
          navigate('/pribadi')
          setLoading(false);
        } else if (error.response) {
          if (error.response.status === 401) {
            localStorage.removeItem('LP3ISBPMB:token');
            navigate('/login');
          } else if (error.response.status === 403) {
            navigate('/pribadi')
            setLoading(false);
          } else if (error.response.status === 404) {
            navigate('/pribadi')
            setLoading(false);
          } else if (error.response.status === 500) {
            setErrorPage(true);
          } else {
            navigate('/pribadi')
            setLoading(false);
          }
        } else if (error.request) {
          navigate('/pribadi')
          setLoading(false);
        } else {
          navigate('/pribadi')
          setLoading(false);
        }
      });
  };

  const schoolHandle = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        school: selectedOption.value
      });
      setSelectedSchool(selectedOption);
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
      name: [],
      gender: [],
      placeOfBirth: [],
      dateOfBirth: [],
      religion: [],
      school: [],
      major: [],
      class: [],
      year: [],
      incomeParent: [],
      socialMedia: [],
      place: [],
      rt: [],
      rw: [],
      postalCode: [],
    });
    const token = localStorage.getItem('LP3ISBPMB:token');
    await axios.patch(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/applicants/update/v1/${user.identity}`, formData, {
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
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v1', {
              withCredentials: true,
            });

            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem('LP3ISBPMB:token', newToken);
            setUser(decodedNewToken.data);

            const responseData = await axios.patch(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/applicants/update/v1/${user.identity}`, formData, {
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
          console.error('Error fetching profile:', error);
          setErrorPage(true);
        }
      });
  }

  useEffect(() => {
    getInfo();
    getSchools();
    getProvinces()
      .then((response) => {
        setProvinces(response);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 py-10 px-5'>
          <form onSubmit={saveHandle} className='max-w-5xl w-full mx-auto shadow-xl'>
            <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
              <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Kembali</span>
              </Link>
              <h2 className='text-white text-center font-bold space-x-2'>
                <FontAwesomeIcon icon={faCircleDot} />
                <span>Data Pribadi</span>
              </h2>
              <div className='flex justify-center md:justify-end'>
                <img src={LogoLP3IPutih} alt="" width={150} />
              </div>
            </header>
            <div className='bg-white px-8 py-10 rounded-b-2xl'>
              <div className='space-y-5'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nama lengkap</label>
                    <input type="text" id="name" value={formData.name} maxLength={150} name='name' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Nama lengkap" />
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.name.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.name.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">Jenis Kelamin</label>
                    <select id="gender" name='gender' value={formData.gender} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={false}>
                      <option value="">Pilih</option>
                      <option value="true">Laki-laki</option>
                      <option value="false">Perempuan</option>
                    </select>
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.gender.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.gender.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="place_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tempat lahir</label>
                    <input type="text" id="place_of_birth" maxLength={150} value={formData.place_of_birth} name='place_of_birth' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tempat lahir" required={false} />
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.placeOfBirth.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.placeOfBirth.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="date_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tanggal lahir</label>
                    <input type="date" id="date_of_birth" value={formData.date_of_birth} name='date_of_birth' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tanggal lahir" required={false} />
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.dateOfBirth.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.dateOfBirth.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Agama</label>
                    <select id="religion" value={formData.religion} name='religion' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={false}>
                      <option value="">Pilih</option>
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.religion.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.religion.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="school" className="block mb-2 text-sm font-medium text-gray-900">Sekolah</label>
                    <CreatableSelect
                      options={schoolsAPI}
                      value={selectedSchool}
                      onChange={schoolHandle}
                      placeholder="Pilih sekolah"
                      className="text-sm"
                      required={false}
                    />
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.school.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.school.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="major" className="block mb-2 text-sm font-medium text-gray-900">Jurusan</label>
                    <input type="text" id="major" value={formData.major} maxLength={100} name='major' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Jurusan" required={false} />
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.major.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.major.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">Kelas</label>
                    <input type="text" id="class" value={formData.class} maxLength={100} name='class' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Kelas" required={false} />
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.class.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.class.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900">Tahun lulus</label>
                    <input type="number" id="year" value={formData.year} name='year' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tahun lulus" required={false} />
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.year.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.year.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="income_parent" className="block mb-2 text-sm font-medium text-gray-900">Penghasilan Orangtua</label>
                    <select id="income_parent" value={formData.income_parent} name='income_parent' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={false}>
                      <option value="">Pilih</option>
                      <option value="< Rp1.000.000">&lt; Rp1.000.000</option>
                      <option value="Rp1.000.000 - Rp2.000.000">Rp1.000.000 - Rp2.000.000</option>
                      <option value="Rp2.000.000 - Rp4.000.000">Rp2.000.000 - Rp4.000.000</option>
                      <option value="> Rp5.000.000">&gt; Rp5.000.000</option>
                    </select>
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.incomeParent.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.incomeParent.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="social_media" className="block mb-2 text-sm font-medium text-gray-900">Akun sosial media</label>
                    <input type="text" id="social_media" value={formData.social_media} maxLength={35} name='social_media' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="@" />
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.socialMedia.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.socialMedia.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                </div>
                <hr />
                {
                  !editAddress ? (
                    <div className='space-y-1'>
                      <h3 className='font-bold'>Alamat:</h3>
                      <p className='text-sm text-gray-800 space-x-2 leading-6'>
                        <span>{formData.address}</span>
                        <button type='button' onClick={() => setEditAddress(!editAddress)} className='text-amber-500 hover:text-amber-600'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <div>
                        <label htmlFor="provinces" className="block mb-2 text-sm font-medium text-gray-900">Provinsi</label>
                        <select id="provinces" onChange={(e) => {
                          setFormData({
                            ...formData,
                            province: e.target.value
                          });
                          getRegencies(e.target.options[e.target.selectedIndex].dataset.id)
                            .then((response) => {
                              setRegencies(response)
                            })
                            .catch((error) => {
                              console.log(error);
                            })
                        }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={false}>
                          <option value="">Pilih Provinsi</option>
                          {
                            provinces.length > 0 && (
                              provinces.map((province) =>
                                <option key={province.id} data-id={province.id} value={province.name}>{province.name}</option>
                              )
                            )
                          }
                        </select>
                      </div>
                      <div>
                        <label htmlFor="regencies" className="block mb-2 text-sm font-medium text-gray-900">Kota/Kabupaten</label>
                        <select id="regencies" onChange={(e) => {
                          setFormData({
                            ...formData,
                            regency: e.target.value
                          });
                          getDistricts(e.target.options[e.target.selectedIndex].dataset.id)
                            .then((response) => {
                              setDistricts(response)
                            })
                            .catch((error) => {
                              console.log(error);
                            })
                        }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={false} disabled={regencies.length === 0}>
                          <option value="">Pilih Kota / Kabupaten</option>
                          {
                            regencies.length > 0 ? (
                              regencies.map((regency) =>
                                <option key={regency.id} data-id={regency.id} value={regency.name}>{regency.name}</option>
                              )
                            ) : (
                              <option value="">Pilih Kota / Kabupaten</option>
                            )
                          }
                        </select>
                      </div>
                      <div>
                        <label htmlFor="disctricts" className="block mb-2 text-sm font-medium text-gray-900">Kecamatan</label>
                        <select id="disctricts" onChange={(e) => {
                          setFormData({
                            ...formData,
                            district: e.target.value
                          });
                          getVillages(e.target.options[e.target.selectedIndex].dataset.id)
                            .then((response) => {
                              setVillages(response)
                            })
                            .catch((error) => {
                              console.log(error);
                            })
                        }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={false} disabled={districts.length === 0}>
                          <option value="">Pilih Kecamatan</option>
                          {
                            districts.length > 0 ? (
                              districts.map((district) =>
                                <option key={district.id} data-id={district.id} value={district.name}>{district.name}</option>
                              )
                            ) : (
                              <option value="">Pilih Kecamatan</option>
                            )
                          }
                        </select>
                      </div>
                      <div>
                        <label htmlFor="villages" className="block mb-2 text-sm font-medium text-gray-900">Kelurahan</label>
                        <select id="villages" onChange={(e) => {
                          setFormData({
                            ...formData,
                            village: e.target.value
                          });
                        }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={false} disabled={villages.length === 0}>
                          <option value="">Pilih Desa / Kelurahan</option>
                          {
                            villages.length > 0 ? (
                              villages.map((village) =>
                                <option key={village.id} data-id={village.id} value={village.name}>{village.name}</option>
                              )
                            ) : (
                              <option value="">Pilih Desa / Kelurahan</option>
                            )
                          }
                        </select>
                      </div>
                      <div>
                        <label htmlFor="place" className="block mb-2 text-sm font-medium text-gray-900">Jl/Kp/Perum</label>
                        <input type="text" id="place" value={formData.place} maxLength={150} name='place' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Jl/Kp/Perum" required={false} />

                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {
                            errors.place.length > 0 &&
                            <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                              {errors.place.map((error, index) => (
                                <li className="font-regular" key={index}>{error}</li>
                              ))}
                            </ul>
                          }
                        </ul>
                      </div>
                      <div>
                        <label htmlFor="rt" className="block mb-2 text-sm font-medium text-gray-900">RT.</label>
                        <input type="number" id="rt" value={formData.rt} name='rt' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RT." required={false} />

                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {
                            errors.rt.length > 0 &&
                            <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                              {errors.rt.map((error, index) => (
                                <li className="font-regular" key={index}>{error}</li>
                              ))}
                            </ul>
                          }
                        </ul>
                      </div>
                      <div>
                        <label htmlFor="rw" className="block mb-2 text-sm font-medium text-gray-900">RW.</label>
                        <input type="number" id="rw" value={formData.rw} name='rw' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RW." required={false} />

                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {
                            errors.rw.length > 0 &&
                            <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                              {errors.rw.map((error, index) => (
                                <li className="font-regular" key={index}>{error}</li>
                              ))}
                            </ul>
                          }
                        </ul>
                      </div>
                      <div>
                        <label htmlFor="postal_code" className="block mb-2 text-sm font-medium text-gray-900">Kode pos</label>
                        <input type="number" id="postal_code" value={formData.postal_code} name='postal_code' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Kode pos" required={false} />

                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {
                            errors.postalCode.length > 0 &&
                            <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                              {errors.postalCode.map((error, index) => (
                                <li className="font-regular" key={index}>{error}</li>
                              ))}
                            </ul>
                          }
                        </ul>
                      </div>
                    </div>
                  )
                }
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

export default Pribadi