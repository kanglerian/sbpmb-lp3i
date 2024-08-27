import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleDot, faEdit, faSave } from '@fortawesome/free-solid-svg-icons'
import { getProvinces, getRegencies, getDistricts, getVillages } from '../utilities/StudentAddress.js'
import axios from 'axios';
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import ServerError from '../pages/errors/ServerError'
import LoadingScreen from './LoadingScreen'

const Orangtua = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  const [errorPage, setErrorPage] = useState(false);

  const [editFatherAddress, setEditFatherAddress] = useState(false);
  const [editMotherAddress, setEditMotherAddress] = useState(false);

  const [fatherProvinces, setFatherProvinces] = useState([]);
  const [fatherRegencies, setFatherRegencies] = useState([]);
  const [fatherDistricts, setFatherDistricts] = useState([]);
  const [fatherVillages, setFatherVillages] = useState([]);

  const [motherProvinces, setMotherProvinces] = useState([]);
  const [motherRegencies, setMotherRegencies] = useState([]);
  const [motherDistricts, setMotherDistricts] = useState([]);
  const [motherVillages, setMotherVillages] = useState([]);

  const [formData, setFormData] = useState({
    // Father
    father_name: '',
    father_phone: '',
    father_education: '',
    father_job: '',
    father_place_of_birth: '',
    father_date_of_birth: '',
    father_province: '',
    father_regency: '',
    father_district: '',
    father_village: '',
    father_place: '',
    father_rt: '',
    father_rw: '',
    father_postal_code: '',
    father_address: '',
    // Mother
    mother_name: '',
    mother_phone: '',
    mother_education: '',
    mother_job: '',
    mother_place_of_birth: '',
    mother_date_of_birth: '',
    mother_province: '',
    mother_regency: '',
    mother_district: '',
    mother_village: '',
    mother_place: '',
    mother_rt: '',
    mother_rw: '',
    mother_postal_code: '',
    mother_address: '',
  });

  const [errors, setErrors] = useState({
    // Father
    fatherName: [],
    fatherPhone: [],
    fatherEducation: [],
    fatherJob: [],
    fatherPlaceOfBirth: [],
    fatherDateOfBirth: [],
    fatherPlace: [],
    fatherRt: [],
    fatherRw: [],
    fatherPostalCode: [],
    // Mother
    motherName: [],
    motherPhone: [],
    motherEducation: [],
    motherJob: [],
    motherPlaceOfBirth: [],
    motherDateOfBirth: [],
    motherPlace: [],
    motherRt: [],
    motherRw: [],
    motherPostalCode: [],
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
        const response = await axios.get('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/profiles/v1', {
          headers: { Authorization: token },
          withCredentials: true,
        });
        return response.data;
      };
      try {
        const profileData = await fetchProfile(token);
        setEditFatherAddress(false);
        setEditMotherAddress(false);
        setFormData({
          // Father
          father_name: profileData.father.name,
          father_phone: profileData.father.phone,
          father_education: profileData.father.education,
          father_job: profileData.father.job,
          father_place_of_birth: profileData.father.place_of_birth,
          father_date_of_birth: profileData.father.date_of_birth,
          father_address: profileData.father.address,
          // Mother
          mother_name: profileData.mother.name,
          mother_phone: profileData.mother.phone,
          mother_education: profileData.mother.education,
          mother_job: profileData.mother.job,
          mother_place_of_birth: profileData.mother.place_of_birth,
          mother_date_of_birth: profileData.mother.date_of_birth,
          mother_address: profileData.mother.address,
        });
        if (!profileData.father.address) {
          setEditFatherAddress(true);
        }
        if (!profileData.mother.address) {
          setEditMotherAddress(true);
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
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
            setEditFatherAddress(false);
            setEditMotherAddress(false);
            setFormData({
              // Father
              father_name: newProfileData.father.name,
              father_phone: newProfileData.father.phone,
              father_education: newProfileData.father.education,
              father_job: newProfileData.father.job,
              father_place_of_birth: newProfileData.father.place_of_birth,
              father_date_of_birth: newProfileData.father.date_of_birth,
              father_address: newProfileData.father.address,
              // Mother
              mother_name: newProfileData.mother.name,
              mother_phone: newProfileData.mother.phone,
              mother_education: newProfileData.mother.education,
              mother_job: newProfileData.mother.job,
              mother_place_of_birth: newProfileData.mother.place_of_birth,
              mother_date_of_birth: newProfileData.mother.date_of_birth,
              mother_address: newProfileData.mother.address,
            });
            if (!newProfileData.father.address) {
              setEditFatherAddress(true);
            }
            if (!newProfileData.mother.address) {
              setEditMotherAddress(true);
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
      // Father
      fatherName: [],
      fatherPhone: [],
      fatherEducation: [],
      fatherJob: [],
      fatherPlaceOfBirth: [],
      fatherDateOfBirth: [],
      fatherPlace: [],
      fatherRt: [],
      fatherRw: [],
      fatherPostalCode: [],
      // Mother
      motherName: [],
      motherPhone: [],
      motherEducation: [],
      motherJob: [],
      motherPlaceOfBirth: [],
      motherDateOfBirth: [],
      motherPlace: [],
      motherRt: [],
      motherRw: [],
      motherPostalCode: [],
    });

    const token = localStorage.getItem('LP3ISBPMB:token');
    await axios.patch(`https://api.politekniklp3i-tasikmalaya.ac.id/pmb/applicants/updatefamily/v1/${user.identity}`, formData, {
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
            const response = await axios.get('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/token/v3', {
              withCredentials: true,
            });

            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem('LP3ISBPMB:token', newToken);
            setUser(decodedNewToken.data);

            const responseData = await axios.patch(`https://api.politekniklp3i-tasikmalaya.ac.id/pmb/applicants/updatefamily/v1/${user.identity}`, formData, {
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
            fatherName: formattedErrors.father_name || [],
            fatherPhone: formattedErrors.father_phone || [],
            fatherJob: formattedErrors.father_job || [],
            fatherEducation: formattedErrors.father_date_of_birth || [],
            fatherPlaceOfBirth: formattedErrors.father_place_of_birth || [],
            fatherDateOfBirth: formattedErrors.father_date_of_birth || [],
            fatherPlace: formattedErrors.father_place || [],
            fatherRt: formattedErrors.father_rt || [],
            fatherRw: formattedErrors.father_rw || [],
            fatherPostalCode: formattedErrors.father_postal_code || [],
            motherName: formattedErrors.mother_name || [],
            motherPhone: formattedErrors.mother_phone || [],
            motherJob: formattedErrors.mother_job || [],
            motherEducation: formattedErrors.mother_date_of_birth || [],
            motherPlaceOfBirth: formattedErrors.mother_place_of_birth || [],
            motherDateOfBirth: formattedErrors.mother_date_of_birth || [],
            motherPlace: formattedErrors.mother_place || [],
            motherRt: formattedErrors.mother_rt || [],
            motherRw: formattedErrors.mother_rw || [],
            motherPostalCode: formattedErrors.mother_postal_code || [],
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
    getProvinces()
      .then((response) => {
        setFatherProvinces(response);
        setMotherProvinces(response);
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
          <form onSubmit={saveHandle} className='max-w-8xl w-full mx-auto shadow-xl'>
            <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
              <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Kembali</span>
              </Link>
              <h2 className='text-white text-center font-bold space-x-2'>
                <FontAwesomeIcon icon={faCircleDot} />
                <span>Data Orang Tua</span>
              </h2>
              <div className='flex justify-center md:justify-end'>
                <img src={LogoLP3IPutih} alt="" width={150} />
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Ayah */}
              <div className='bg-white px-8 py-10 space-y-5'>
                <header className='space-y-1'>
                  <h2 className='font-bold text-2xl'>Biodata Ayah</h2>
                  <p className='text-sm text-gray-700'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt repudiandae repellat aperiam totam fugit. Fugit nobis reprehenderit eos obcaecati quaerat.</p>
                </header>
                <hr />
                <div className='space-y-5'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    <div>
                      <label htmlFor="father_name" className="block mb-2 text-sm font-medium text-gray-900">Nama lengkap</label>
                      <input type="text" id="father_name" value={formData.father_name} maxLength={150} name='father_name' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Nama lengkap" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.fatherName.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.fatherName.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="father_place_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tempat lahir</label>
                      <input type="text" id="father_place_of_birth" maxLength={150} value={formData.father_place_of_birth} name='father_place_of_birth' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tempat lahir" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.fatherPlaceOfBirth.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.fatherPlaceOfBirth.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="father_date_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tanggal lahir</label>
                      <input type="date" id="father_date_of_birth" value={formData.father_date_of_birth} name='father_date_of_birth' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tanggal lahir" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.fatherDateOfBirth.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.fatherDateOfBirth.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="father_phone" className="block mb-2 text-sm font-medium text-gray-900">No. Whatsapp</label>
                      <input type="number" id="father_phone" value={formData.father_phone} name='father_phone' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="No. Whatsapp" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.fatherPhone.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.fatherPhone.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="father_education" className="block mb-2 text-sm font-medium text-gray-900">Pendidikan Terakhir</label>
                      <input type="text" id="father_education" value={formData.father_education} maxLength={150} name='father_education' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Pendidikan" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.fatherEducation.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.fatherEducation.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="father_job" className="block mb-2 text-sm font-medium text-gray-900">Pekerjaan</label>
                      <input type="text" id="father_job" value={formData.father_job} maxLength={150} name='father_job' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Pekerjaan" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.fatherJob.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.fatherJob.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                  </div>
                  <hr />
                  {
                    !editFatherAddress ? (
                      <div className='space-y-1'>
                        <h3 className='font-bold'>Alamat:</h3>
                        <p className='text-sm text-gray-800 space-x-2 leading-6'>
                          <span>{formData.father_address}</span>
                          <button type='button' onClick={() => setEditFatherAddress(!editFatherAddress)} className='text-amber-500 hover:text-amber-600'>
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
                              father_province: e.target.value
                            });
                            getRegencies(e.target.options[e.target.selectedIndex].dataset.id)
                              .then((response) => {
                                setFatherRegencies(response)
                              })
                              .catch((error) => {
                                console.log(error);
                              })
                          }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={true}>
                            <option value="">Pilih Provinsi</option>
                            {
                              fatherProvinces.length > 0 && (
                                fatherProvinces.map((province) =>
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
                              father_regency: e.target.value
                            });
                            getDistricts(e.target.options[e.target.selectedIndex].dataset.id)
                              .then((response) => {
                                setFatherDistricts(response)
                              })
                              .catch((error) => {
                                console.log(error);
                              })
                          }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={true} disabled={fatherRegencies.length === 0}>
                            <option value="">Pilih Kota / Kabupaten</option>
                            {
                              fatherRegencies.length > 0 ? (
                                fatherRegencies.map((regency) =>
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
                              father_district: e.target.value
                            });
                            getVillages(e.target.options[e.target.selectedIndex].dataset.id)
                              .then((response) => {
                                setFatherVillages(response)
                              })
                              .catch((error) => {
                                console.log(error);
                              })
                          }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={true} disabled={fatherDistricts.length === 0}>
                            <option value="">Pilih Kecamatan</option>
                            {
                              fatherDistricts.length > 0 ? (
                                fatherDistricts.map((district) =>
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
                              father_village: e.target.value
                            });
                          }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={true} disabled={fatherVillages.length === 0}>
                            <option value="">Pilih Desa / Kelurahan</option>
                            {
                              fatherVillages.length > 0 ? (
                                fatherVillages.map((village) =>
                                  <option key={village.id} data-id={village.id} value={village.name}>{village.name}</option>
                                )
                              ) : (
                                <option value="">Pilih Desa / Kelurahan</option>
                              )
                            }
                          </select>
                        </div>
                        <div>
                          <label htmlFor="father_place" className="block mb-2 text-sm font-medium text-gray-900">Jl/Kp/Perum</label>
                          <input type="text" id="father_place" value={formData.father_place} maxLength={150} name='father_place' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Jl/Kp/Perum" required={true} />
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {
                              errors.fatherPlace.length > 0 &&
                              <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                                {errors.fatherPlace.map((error, index) => (
                                  <li className="font-regular" key={index}>{error}</li>
                                ))}
                              </ul>
                            }
                          </ul>
                        </div>
                        <div>
                          <label htmlFor="father_rt" className="block mb-2 text-sm font-medium text-gray-900">RT.</label>
                          <input type="number" id="father_rt" value={formData.father_rt} name='father_rt' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RT." required={true} />
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {
                              errors.fatherRt.length > 0 &&
                              <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                                {errors.fatherRt.map((error, index) => (
                                  <li className="font-regular" key={index}>{error}</li>
                                ))}
                              </ul>
                            }
                          </ul>
                        </div>
                        <div>
                          <label htmlFor="father_rw" className="block mb-2 text-sm font-medium text-gray-900">RW.</label>
                          <input type="number" id="father_rw" value={formData.father_rw} name='father_rw' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RW." required={true} />
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {
                              errors.fatherRw.length > 0 &&
                              <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                                {errors.fatherRw.map((error, index) => (
                                  <li className="font-regular" key={index}>{error}</li>
                                ))}
                              </ul>
                            }
                          </ul>
                        </div>
                        <div>
                          <label htmlFor="father_postal_code" className="block mb-2 text-sm font-medium text-gray-900">Kode pos</label>
                          <input type="number" id="father_postal_code" value={formData.father_postal_code} name='father_postal_code' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Kode pos" required={true} />
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {
                              errors.fatherPostalCode.length > 0 &&
                              <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                                {errors.fatherPostalCode.map((error, index) => (
                                  <li className="font-regular" key={index}>{error}</li>
                                ))}
                              </ul>
                            }
                          </ul>
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
              {/* Mother */}
              <div className='bg-white px-8 py-10 space-y-5'>
                <header className='space-y-1'>
                  <h2 className='font-bold text-2xl'>Biodata Ibu</h2>
                  <p className='text-sm text-gray-700'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt repudiandae repellat aperiam totam fugit. Fugit nobis reprehenderit eos obcaecati quaerat.</p>
                </header>
                <hr />
                <div className='space-y-5'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    <div>
                      <label htmlFor="mother_name" className="block mb-2 text-sm font-medium text-gray-900">Nama lengkap</label>
                      <input type="text" id="mother_name" value={formData.mother_name} maxLength={150} name='mother_name' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Nama lengkap" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.motherName.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.motherName.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="mother_place_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tempat lahir</label>
                      <input type="text" id="mother_place_of_birth" maxLength={150} value={formData.mother_place_of_birth} name='mother_place_of_birth' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tempat lahir" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.motherPlaceOfBirth.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.motherPlaceOfBirth.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="mother_date_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tanggal lahir</label>
                      <input type="date" id="mother_date_of_birth" value={formData.mother_date_of_birth} name='mother_date_of_birth' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tanggal lahir" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.motherDateOfBirth.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.motherDateOfBirth.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="mother_phone" className="block mb-2 text-sm font-medium text-gray-900">No. Whatsapp</label>
                      <input type="number" id="mother_phone" value={formData.mother_phone} name='mother_phone' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="No. Whatsapp" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.motherPhone.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.motherPhone.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="mother_education" className="block mb-2 text-sm font-medium text-gray-900">Pendidikan Terakhir</label>
                      <input type="text" id="mother_education" value={formData.mother_education} maxLength={150} name='mother_education' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Pendidikan" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.motherEducation.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.motherEducation.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="mother_job" className="block mb-2 text-sm font-medium text-gray-900">Pekerjaan</label>
                      <input type="text" id="mother_job" value={formData.mother_job} maxLength={150} name='mother_job' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Pekerjaan" required={true} />
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.motherJob.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.motherJob.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                  </div>
                  <hr />
                  {
                    !editMotherAddress ? (
                      <div className='space-y-1'>
                        <h3 className='font-bold'>Alamat:</h3>
                        <p className='text-sm text-gray-800 space-x-2 leading-6'>
                          <span>{formData.mother_address}</span>
                          <button type='button' onClick={() => setEditMotherAddress(!editMotherAddress)} className='text-amber-500 hover:text-amber-600'>
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
                              mother_province: e.target.value
                            });
                            getRegencies(e.target.options[e.target.selectedIndex].dataset.id)
                              .then((response) => {
                                setMotherRegencies(response)
                              })
                              .catch((error) => {
                                console.log(error);
                              })
                          }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={true}>
                            <option value="">Pilih Provinsi</option>
                            {
                              motherProvinces.length > 0 && (
                                motherProvinces.map((province) =>
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
                              mother_regency: e.target.value
                            });
                            getDistricts(e.target.options[e.target.selectedIndex].dataset.id)
                              .then((response) => {
                                setMotherDistricts(response)
                              })
                              .catch((error) => {
                                console.log(error);
                              })
                          }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={true} disabled={motherRegencies.length === 0}>
                            <option value="">Pilih Kota / Kabupaten</option>
                            {
                              motherRegencies.length > 0 ? (
                                motherRegencies.map((regency) =>
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
                              mother_district: e.target.value
                            });
                            getVillages(e.target.options[e.target.selectedIndex].dataset.id)
                              .then((response) => {
                                setMotherVillages(response)
                              })
                              .catch((error) => {
                                console.log(error);
                              })
                          }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={true} disabled={motherDistricts.length === 0}>
                            <option value="">Pilih Kecamatan</option>
                            {
                              motherDistricts.length > 0 ? (
                                motherDistricts.map((district) =>
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
                              mother_village: e.target.value
                            });
                          }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required={true} disabled={motherVillages.length === 0}>
                            <option value="">Pilih Desa / Kelurahan</option>
                            {
                              motherVillages.length > 0 ? (
                                motherVillages.map((village) =>
                                  <option key={village.id} data-id={village.id} value={village.name}>{village.name}</option>
                                )
                              ) : (
                                <option value="">Pilih Desa / Kelurahan</option>
                              )
                            }
                          </select>
                        </div>
                        <div>
                          <label htmlFor="mother_place" className="block mb-2 text-sm font-medium text-gray-900">Jl/Kp/Perum</label>
                          <input type="text" id="mother_place" value={formData.mother_place} maxLength={150} name='mother_place' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Jl/Kp/Perum" required={true} />
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {
                              errors.motherPlace.length > 0 &&
                              <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                                {errors.motherPlace.map((error, index) => (
                                  <li className="font-regular" key={index}>{error}</li>
                                ))}
                              </ul>
                            }
                          </ul>
                        </div>
                        <div>
                          <label htmlFor="mother_rt" className="block mb-2 text-sm font-medium text-gray-900">RT.</label>
                          <input type="number" id="mother_rt" value={formData.mother_rt} name='mother_rt' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RT." required={true} />
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {
                              errors.motherRt.length > 0 &&
                              <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                                {errors.motherRt.map((error, index) => (
                                  <li className="font-regular" key={index}>{error}</li>
                                ))}
                              </ul>
                            }
                          </ul>
                        </div>
                        <div>
                          <label htmlFor="mother_rw" className="block mb-2 text-sm font-medium text-gray-900">RW.</label>
                          <input type="number" id="mother_rw" value={formData.mother_rw} name='mother_rw' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RW." required={true} />
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {
                              errors.motherRw.length > 0 &&
                              <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                                {errors.motherRw.map((error, index) => (
                                  <li className="font-regular" key={index}>{error}</li>
                                ))}
                              </ul>
                            }
                          </ul>
                        </div>
                        <div>
                          <label htmlFor="mother_postal_code" className="block mb-2 text-sm font-medium text-gray-900">Kode pos</label>
                          <input type="number" id="mother_postal_code" value={formData.mother_postal_code} name='mother_postal_code' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Kode pos" required={true} />
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {
                              errors.motherPostalCode.length > 0 &&
                              <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                                {errors.motherPostalCode.map((error, index) => (
                                  <li className="font-regular" key={index}>{error}</li>
                                ))}
                              </ul>
                            }
                          </ul>
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
            <div className='bg-white pb-8 px-8 rounded-b-3xl'>
              <button type="submit" className="text-white bg-lp3i-200 hover:bg-lp3i-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
                <FontAwesomeIcon icon={faSave} />
                <span>Simpan perubahan</span>
              </button>
            </div>
          </form>
        </main>
      )
    )
  )
}

export default Orangtua