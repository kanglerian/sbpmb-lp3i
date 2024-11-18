import { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheckCircle, faCircleDot, faTrash, } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from 'jwt-decode'
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import ServerError from './errors/ServerError'
import LoadingScreen from './LoadingScreen';

const Berkas = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [loading, setLoading] = useState(false);

  const [errorPage, setErrorPage] = useState(false);
  const [fileupload, setFileupload] = useState([]);
  const [userupload, setUserupload] = useState([]);

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
        const response = await axios.get('https://pmb-api.politekniklp3i-tasikmalaya.ac.id/profiles/v1', {
          headers: { Authorization: token },
          withCredentials: true,
        });
        return response.data;
      };
      try {
        const profileData = await fetchProfile(token);
        setUserupload(profileData.userupload);
        setFileupload(profileData.fileupload);
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
            setUserupload(newProfileData.userupload);
            setFileupload(newProfileData.fileupload);
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

  const handleFileChange = (e) => {
    e.preventDefault();
    setLoading(true);
    const targetFile = e.target.files[0];
    const targetId = e.target.dataset.id;
    const targetNamefile = e.target.dataset.namefile;
    if (targetFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        let data = {
          identity: user.identity,
          image: event.target.result.split(";base64,").pop(),
          namefile: targetNamefile,
          typefile: targetFile.name.split(".").pop(),
        };
        let status = {
          identity_user: user.identity,
          fileupload_id: targetId,
          typefile: targetFile.name.split(".").pop(),
        };
        const token = localStorage.getItem('LP3ISBPMB:token');
        await axios.post(`https://uploadhub.politekniklp3i-tasikmalaya.ac.id/upload`, data, {
          headers: {
            'lp3i-api-key': 'cdbdb5ea29b98565'
          }
        })
          .then(async () => {
            await axios.post(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/userupload`, status, {
              headers: { Authorization: token },
              withCredentials: true
            }
            ).then(() => {
              getInfo();
              setTimeout(() => {
                setLoading(false);
              }, 1000);
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
                    await axios.post(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/userupload`, status, {
                      headers: { Authorization: newToken },
                      withCredentials: true
                    });
                    getInfo();
                    setTimeout(() => {
                      setLoading(false);
                    }, 2000);
                    navigate('/berkas');
                  } catch (error) {
                    console.error('Error refreshing token or fetching profile:', error);
                    if (error.response && error.response.status === 400) {
                      localStorage.removeItem('LP3ISBPMB:token');
                    } else {
                      setErrorPage(true);
                    }
                  }
                } else {
                  console.error('Error fetching profile:', error);
                  setErrorPage(true);
                }
              });
          })
          .catch(() => {
            alert("Mohon maaf, ada kesalahan di sisi Server.");
            setLoading(false);
          });
      };
      reader.readAsDataURL(targetFile);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    alert("upload!");
  };

  const handleDelete = async (user) => {
    if (confirm(`Apakah kamu yakin akan menghapus data?`)) {
      const data = {
        identity: user.identityUser,
        namefile: user.fileupload.namefile,
        typefile: user.typefile,
      };
      const token = localStorage.getItem('LP3ISBPMB:token');
      setLoading(true);
      await axios
        .delete(
          `https://api.politekniklp3i-tasikmalaya.ac.id/pmbonline/delete`,
          {
            params: data,
          }
        )
        .then(async () => {
          setLoading(false);
          await axios
            .delete(
              `https://pmb-api.politekniklp3i-tasikmalaya.ac.id/userupload/${user.id}`, {
              headers: {
                Authorization: token
              },
              withCredentials: true
            }
            )
            .then(() => {
              getInfo();
              setTimeout(() => {
                setLoading(false);
              }, 1000);
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

                  await axios.delete(`https://pmb-api.politekniklp3i-tasikmalaya.ac.id/userupload/${user.id}`, {
                    headers: { Authorization: newToken },
                    withCredentials: true
                  });
                  getInfo();
                  setTimeout(() => {
                    setLoading(false);
                  }, 2000);
                  navigate('/berkas');
                } catch (error) {
                  console.error('Error refreshing token or fetching profile:', error);
                  if (error.response && error.response.status === 400) {
                    localStorage.removeItem('LP3ISBPMB:token');
                  } else {
                    setErrorPage(true);
                  }
                }
              } else {
                console.error('Error fetching profile:', error);
                setErrorPage(true);
              }
            });
        })
        .catch(() => {
          setLoading(false);
        });
    }
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
        <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 py-10 px-5 md:h-screen'>
          <div className='max-w-5xl w-full mx-auto shadow-xl'>
            <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
              <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Kembali</span>
              </Link>
              <h2 className='text-white text-center font-bold space-x-2'>
                <FontAwesomeIcon icon={faCircleDot} />
                <span>Data Berkas</span>
              </h2>
              <div className='flex justify-center md:justify-end'>
                <img src={LogoLP3IPutih} alt="" width={150} />
              </div>
            </header>
            <div className='bg-white px-8 py-10 rounded-b-2xl'>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {userupload.length > 0 &&
                  userupload.map((user) => (
                    <div key={user.id}>
                      <label className="block mb-2 text-sm font-medium text-gray-900 space-x-1">
                        <span>{user.fileupload.name}</span>
                      </label>
                      <div className='flex items-center justify-between gap-2'>
                        <p className='w-full text-sm bg-gray-50 border border-gray-300 rounded-xl px-2 py-2.5 text-center space-x-2'>
                          <span className='font-medium'>Uploaded!</span>
                          <FontAwesomeIcon icon={faCheckCircle} className='text-emerald-500' />
                        </p>
                        <div className='flex items-center gap-1'>
                          <button type='button' onClick={() => handleDelete(user)} className='w-full block bg-red-500 hover:bg-red-600 text-sm px-5 py-2 rounded-xl'>
                            <FontAwesomeIcon icon={faTrash} className='text-white' />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 ml-1 text-xs text-gray-500">
                        <span className="font-medium">Keterangan file:</span>
                        {" "}
                        <span className="underline">{user.fileupload.accept}</span>
                      </p>
                    </div>
                  ))}
                {fileupload.length > 0 &&
                  fileupload.map((file) => (
                    <form key={file.id} onSubmit={handleUpload} encType="multipart/form-data">
                      <label className="block mb-2 text-sm font-medium text-gray-900">{file.name}</label>
                      <input className="block w-full text-xs text-gray-900 border border-gray-300 rounded-xl p-3 cursor-pointer bg-gray-50 focus:outline-none" type="file" accept={file.accept} data-id={file.id} data-namefile={file.namefile} name="berkas" onChange={handleFileChange} />
                      <p className="mt-2 ml-1 text-xs text-gray-500">
                        <span className="font-medium">Keterangan file:</span>
                        {" "}
                        <span className="underline">{file.accept}</span>
                      </p>
                    </form>
                  ))}
              </div>
            </div>
          </div>
        </main>
      )
    )
  )
}

export default Berkas