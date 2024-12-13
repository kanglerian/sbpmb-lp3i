import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons'


import LoadingScreen from '../../components/LoadingScreen'
import ServerError from '../../errors/ServerError'
import LogoLP3IPutih from '../../assets/logo/logo-lp3i-putih.svg'
import KampusMandiriPutih from '../../assets/logo/kampusmandiri-putih.png';

const Register = () => {
  const navigate = useNavigate();

  const [errorPage, setErrorPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const [presenters, setPresenters] = useState([]);

  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappDisabled, setWhatsappDisabled] = useState(false);
  const [whatsappValidate, setWhatsappValidate] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState(false);

  const [email, setEmail] = useState("");
  const [emailShow, setEmailShow] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [emailValidate, setEmailValidate] = useState(false);
  const [emailMessage, setEmailMessage] = useState(false);

  const [selectedSchool, setSelectedSchool] = useState(null);

  const [schoolsAPI, setSchoolsAPI] = useState([]);

  const [name, setName] = useState("");
  const [information, setInformation] = useState("6281313608558");
  const [school, setSchool] = useState("");

  const [errors, setErrors] = useState({
    name: [],
    phone: [],
    email: [],
    information: [],
    school: [],
  });

  const getSchools = async () => {
    await axios.get(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/schools`, {
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
        console.log(error);
      });
  };

  const schoolHandle = (selectedOption) => {
    if (selectedOption) {
      setSchool(selectedOption.value);
      setSelectedSchool(selectedOption);
    }
  };

  const setValidatePhone = (inputPhone) => {
    let formattedPhone = inputPhone.trim();
    if (formattedPhone.length <= 14) {
      if (formattedPhone.startsWith("62")) {
        if (formattedPhone.length === 3 && (formattedPhone[2] === "0" || formattedPhone[2] !== "8")) {
          setWhatsapp('62');
        } else {
          setWhatsapp(formattedPhone);
        }
      } else if (formattedPhone.startsWith("0")) {
        setWhatsapp('62' + formattedPhone.substring(1));
      } else {
        setWhatsapp('62');
      }
    }
  };

  const checkValidation = async (e, field) => {
    e.preventDefault();
    setLoading(true);
    if (field !== '') {
      let value;
      if (field == 'phone') {
        if (whatsapp.length < 12) {
          return alert('Nomor telpon tidak valid, check jumlah nomor!');
        }
        value = whatsapp;
      } else if (field == 'email') {
        value = email;
      }
      await axios.post('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/validation', {
        value: value,
        field: field
      })
        .then((response) => {
          if (response.status == 200) {
            if (field == 'phone') {
              setWhatsappMessage(true);
              setWhatsappValidate(true);
              if (response.data.create) {
                setWhatsappDisabled(true);
                setEmailShow(true);
              }
            } else if (field == 'email') {
              setEmailMessage(true);
              setEmailValidate(true);
              if (response.data.create) {
                setEmailDisabled(true);
              }
            }
          }
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .catch((error) => {
          const responseError = error.response;
          if (responseError.status == 404 && responseError.data.create) {
            if (field == 'phone') {
              setWhatsappMessage(true);
              setWhatsappValidate(false);
              setWhatsappDisabled(true);
              setEmailShow(true);
              if (responseError.data.data) {
                setName(responseError.data.data.name);
                setEmail(responseError.data.data.email);
              }
            } else if (field == 'email') {
              setEmailMessage(true);
              setEmailValidate(false);
              setEmailDisabled(true);
              if (responseError.data.data) {
                setName(responseError.data.data.name);
                setWhatsapp(responseError.data.data.phone);
              }
            }
          }
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    }
  }

  const registerHandle = async () => {
    setLoading(true);
    if (whatsapp !== '' && email !== '' && name !== '' && information !== '') {
      const confirmed = confirm(`Berikut data yang akan didaftarkan\n------\nNama lengkap: ${name}\nEmail: ${email}\nNo. Whatsapp: ${whatsapp}\n------\nApakah sudah benar?`)
      const data = {
        phone: whatsapp,
        email: email,
        name: name,
        school: school,
        information: information
      }

      if (confirmed) {
        await axios.post('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/register/v1', data, {
          withCredentials: true
        })
          .then((response) => {
            console.log(response);
            localStorage.setItem('LP3ISBPMB:token', response.data.token)
            setLoading(false);
            alert(response.data.message);
            navigate('/dashboard');
          })
          .catch((error) => {
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
                phone: formattedErrors.phone || [],
                email: formattedErrors.email || [],
                information: formattedErrors.information || [],
                school: formattedErrors.school || [],
              };
              setErrors(newAllErrors);
              alert('Silahkan periksa kembali form yang telah diisi, ada kesalahan pengisian.');
            } else {
              console.error('Error refreshing token or fetching profile:', error);
            }
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          });
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        setWhatsappDisabled(false);
        setEmailDisabled(false);
        setEmail("");
        setEmailShow(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      alert('Ada form yang belum diisi!');
    }
  }

  const getPresenters = async () => {
    await axios.get(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/presenters`, {
      headers: {
        'lp3i-api-key': 'aEof9XqcH34k3g6IbJcQLxGY'
      }
    })
      .then((response) => {
        setPresenters(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getInfo = async () => {
    try {
      const token = localStorage.getItem('LP3ISBPMB:token');
      if (!token) {
        return navigate('/register');
      }

      const fetchProfile = async (token) => {
        const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/profiles/v1', {
          headers: { Authorization: token },
          withCredentials: true,
        });
        return response.data;
      };

      try {
        const profileData = await fetchProfile(token);
        if (profileData) {
          navigate('/dashboard');
        }
      } catch (profileError) {
        if (profileError.response && profileError.response.status === 403) {
          try {
            const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/auth/token/v1', {
              withCredentials: true,
            });

            const newToken = response.data;
            localStorage.setItem('LP3ISBPMB:token', newToken);
            const newProfileData = await fetchProfile(newToken);
            if (newProfileData) {
              navigate('/dashboard');
            }
          } catch (error) {
            console.error('Error refreshing token or fetching profile:', error);
            if (error.response && error.response.status === 400) {
              localStorage.removeItem('LP3ISBPMB:token');
              navigate('/login')
            }
          }
        } else {
          console.error('Error fetching profile:', profileError);
          localStorage.removeItem('LP3ISBPMB:token');
          setErrorPage(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (error) {
      if (error.response) {
        if ([400, 403].includes(error.response.status)) {
          localStorage.removeItem('LP3ISBPMB:token');
          navigate('/register');
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
      navigate('/register');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  useEffect(() => {
    getInfo();
    getPresenters();
    getSchools();
  }, []);

  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main className={`flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 h-screen p-5 space-y-4`}>
          <nav className='flex items-center py-3 gap-3'>
            <img src={LogoLP3IPutih} alt="" width={180} />
            <img src={KampusMandiriPutih} alt="" width={110} />
          </nav>
          <div className='max-w-2xl w-full bg-white p-10 rounded-3xl shadow-xl space-y-6'>
            <div className="space-y-4">
              <form onSubmit={(e) => checkValidation(e, 'phone')} method='POST' className='flex items-center gap-4'>
                <div className='w-full'>
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
                    Nama lengkap
                  </label>
                  <div className='flex gap-2'>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="Tulis nama lengkap anda..." required={true} />
                  </div>
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
                <div className='w-full'>
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
                    No. Whatsapp
                  </label>
                  <div className='flex gap-2'>
                    <input type="number" value={whatsapp} onChange={(e) => setValidatePhone(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="No. Whatsapp" required={true} disabled={whatsappDisabled} />
                    {
                      !whatsappDisabled &&
                      <button type="submit" className="text-white bg-lp3i-100 hover:bg-lp3i-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5">
                        {
                          loading ? (
                            <div role="status">
                              <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                              </svg>
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            <FontAwesomeIcon icon={faSearch} />
                          )
                        }
                      </button>
                    }
                  </div>
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.phone.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.phone.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                  {
                    whatsappMessage ? (
                      whatsappValidate &&
                      <p className="mt-2 text-xs text-red-500">
                        <span className="font-medium">No. Whatsapp </span>
                        <span>sudah digunakan. Apakah anda </span>
                        <a href="https://wa.me?phone=6282219509698&text=Kirim%20pesan%20perintah%20ini%20untuk%20reset%20password%20:resetpass:" target='_blank' className='underline'>lupa kata sandi?</a>
                      </p>
                    ) : null
                  }
                </div>
              </form>
              {
                emailShow &&
                <form onSubmit={(e) => checkValidation(e, 'email')} method='POST' className='space-y-4'>
                  <div className='flex items-center gap-4'><div className='w-full'>
                    <label htmlFor="information" className="block mb-2 text-sm font-medium text-gray-900">Sumber Informasi</label>
                    <select id="information" defaultValue={information} onChange={(e) => setInformation(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3" required={true}>
                      <option disabled>Pilih</option>
                      <option value="6281313608558">Website</option>
                      {
                        presenters.length > 0 &&
                        presenters.map((presenter, index) =>
                          <option value={presenter.phone} key={index}>{presenter.name}</option>
                        )
                      }
                    </select>
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.information.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.information.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                    <div className='w-full'>
                      <label htmlFor="school" className="block mb-2 text-sm font-medium text-gray-900">Sekolah</label>
                      <CreatableSelect type="text" id="school" styles={{ fontFamily: 'Rubik' }} options={schoolsAPI} value={selectedSchool} onChange={schoolHandle} placeholder='Sekolah' required={true} />
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
                  </div>
                  <div>
                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <div className='flex gap-2'>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="Email" required={true} disabled={emailDisabled} />
                      {
                        !emailDisabled &&
                        <button type="submit" className="text-white bg-lp3i-100 hover:bg-lp3i-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5">
                          {
                            loading ? (
                              <div role="status">
                                <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                              </div>
                            ) : (
                              <FontAwesomeIcon icon={faSearch} />
                            )
                          }
                        </button>
                      }
                    </div>
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.email.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.email.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                    {
                      emailMessage ? (
                        emailValidate &&
                        <p className="mt-2 text-xs text-red-500"><span className="font-medium">Email</span> sudah digunakan! silahkan masukan email lainnya.</p>
                      ) : null
                    }
                  </div>
                </form>
              }
            </div>
            <div className='flex items-center gap-3'>
              {
                whatsappDisabled && emailDisabled && (
                  <button type="button" onClick={registerHandle} className="text-white bg-lp3i-200 hover:bg-lp3i-300  font-medium rounded-xl text-sm px-5 py-2.5 text-center inline-flex items-center gap-2">
                    <span>Lanjutkan</span>
                    {
                      loading ? (
                        <div role="status">
                          <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <FontAwesomeIcon icon={faArrowRight} />
                      )
                    }
                  </button>
                )
              }
              {
                !whatsappDisabled && !emailDisabled && (
                  <Link to={`/`} className="text-gray-700 font-medium rounded-xl text-sm text-center">
                    <span>Sudah punya akun? </span>
                    <span className='underline font-semibold'>Masuk disini</span>
                  </Link>
                )
              }
            </div>
          </div>
        </main>
      )
    )
  );
}

export default Register