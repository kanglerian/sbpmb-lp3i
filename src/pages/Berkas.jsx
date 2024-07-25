import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../templates/Navbar.jsx";
import Loading from "../components/Loading.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const Berkas = () => {

  const navigate = useNavigate();

  let start = true;
  const [scholarship, setScholarship] = useState(false);

  const [student, setStudent] = useState({});

  const [fileUpload, setFileUpload] = useState([]);
  const [userUpload, setUserUpload] = useState([]);

  const [loadingScreen, setLoadingScreen] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setLoading(true);
    const targetFile = e.target.files[0];
    const targetId = e.target.dataset.id;
    const targetNamefile = e.target.dataset.namefile;
    if (targetFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        let data = {
          identity: student.identity,
          image: event.target.result.split(";base64,").pop(),
          namefile: targetNamefile,
          typefile: targetFile.name.split(".").pop(),
        };
        let status = {
          identity_user: student.identity,
          fileupload_id: targetId,
          typefile: targetFile.name.split(".").pop(),
        };
        await axios
          .post(
            `https://api.politekniklp3i-tasikmalaya.ac.id/pmbonline/upload`,
            data
          )
          .then(async (res) => {
            await axios
              .post(
                `https://database.politekniklp3i-tasikmalaya.ac.id/api/userupload`,
                status, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
              )
              .then((res) => {
                alert("Berhasil diupload!");
                setLoading(false);
                getUser();
              })
              .catch((err) => {
                alert("Mohon maaf, ada kesalahan di sisi Server.");
                setLoading(false);
                console.log(err.message);
              });
          })
          .catch((err) => {
            alert("Mohon maaf, ada kesalahan di sisi Server.");
            setLoading(false);
          });
      };

      reader.readAsDataURL(targetFile);
    }
  };

  const handleDelete = async (user) => {
    setLoading(true);
    if (confirm(`Apakah kamu yakin akan menghapus data?`)) {
      let data = {
        identity: user.identity_user,
        namefile: user.fileupload.namefile,
        typefile: user.typefile,
      };
      await axios
        .delete(
          `https://api.politekniklp3i-tasikmalaya.ac.id/pmbonline/delete`,
          {
            params: data,
          }
        )
        .then(async (res) => {
          await axios
            .delete(
              `https://database.politekniklp3i-tasikmalaya.ac.id/api/userupload/${user.id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
            )
            .then((res) => {
              alert(res.data.message);
              setLoading(false);
              getUser();
            })
            .catch((err) => {
              console.log(err.message);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    }
  };

  const getUser = async () => {
    await axios
      .get("https://database.politekniklp3i-tasikmalaya.ac.id/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFileUpload(response.data.fileupload);
        setUserUpload(response.data.userupload);
        setStudent(response.data.applicant);
        let applicant = response.data.applicant;
        let fileuploaded = response.data.fileuploaded;
        let foto = fileuploaded.find((file) => { return file.namefile == "foto" });
        let akta = fileuploaded.find((file) => { return file.namefile == "akta-kelahiran" });
        let keluarga = fileuploaded.find((file) => { return file.namefile == "kartu-keluarga" });
        if (start && applicant.name && applicant.religion && applicant.school && applicant.year && applicant.place_of_birth && applicant.date_of_birth && applicant.gender && applicant.address && applicant.email && applicant.phone && applicant.program && applicant.income_parent && applicant.father.name && applicant.father.date_of_birth && applicant.father.education && applicant.father.address && applicant.father.job && applicant.mother.name && applicant.mother.date_of_birth && applicant.mother.education && applicant.mother.address && applicant.mother.job) {
          setScholarship(true);
        }
        setLoadingScreen(false);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.log(error);
        }
        setLoadingScreen(false);
      });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    alert("upload!");
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
  }, []);

  return (
    <section className="bg-white">
      {loadingScreen && <LoadingScreen />}
      <div className="container mx-auto px-5">
        <Navbar />
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 p-6">
            <header className="space-y-1 mb-5">
              <h2 className="font-bold text-gray-900">Selamat Datang Calon Mahasiswa Baru!</h2>
              <p className="text-sm text-gray-700">Berikut ini adalah halaman informasi biodata kamu. Silahkan untuk diisi selengkap mungkin untuk syarat mengikuti E-Assessment.</p>
            </header>
            <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-2">
              <header>
                <h2 className="font-bold text-gray-900">Informasi Persyaratan: </h2>
                <p className="text-sm text-gray-700">Silahkan lengkapi untuk persyaratan beasiswa.</p>
              </header>
              <hr />
              <div className="space-y-2 py-2">
                <h5 className="text-sm text-gray-900 font-bold">Persyaratan</h5>
                <ul className="space-y-2 text-sm list-disc ml-5">
                  {
                    userUpload && (
                      <li className="space-x-2">
                        <span className="text-gray-900">Foto</span>
                        <FontAwesomeIcon icon={userUpload.find((upload) => upload.fileupload.namefile === 'foto') ? faCircleCheck : faCircleXmark} className={userUpload.find((upload) => upload.fileupload.namefile === 'foto') ? 'text-emerald-500' : 'text-red-500'} />
                      </li>
                    )
                  }
                  {
                    userUpload && (
                      <li className="space-x-2">
                        <span className="text-gray-900">Akta Kelahiran</span>
                        <FontAwesomeIcon icon={userUpload.find((upload) => upload.fileupload.namefile === 'akta-kelahiran') ? faCircleCheck : faCircleXmark} className={userUpload.find((upload) => upload.fileupload.namefile === 'akta-kelahiran') ? 'text-emerald-500' : 'text-red-500'} />
                      </li>
                    )
                  }
                  {
                    userUpload && (
                      <li className="space-x-2">
                        <span className="text-gray-900">Kartu Keluarga</span>
                        <FontAwesomeIcon icon={userUpload.find((upload) => upload.fileupload.namefile === 'kartu-keluarga') ? faCircleCheck : faCircleXmark} className={userUpload.find((upload) => upload.fileupload.namefile === 'kartu-keluarga') ? 'text-emerald-500' : 'text-red-500'} />
                      </li>
                    )
                  }
                </ul>
              </div>
              {
                scholarship ? (
                  <Link to={`/scholarship`} className="space-x-2 bg-sky-500 hover:bg-sky-600 text-white block text-center w-full px-4 py-2 rounded-xl text-sm">
                    <i className="fa-solid fa-pen"></i>
                    <span>Kerjakan E-Assessment</span>
                  </Link>
                ) : (
                  <button className="space-x-2 bg-red-500 hover:bg-red-600 text-white block w-full px-4 py-2 rounded-xl text-sm">
                    <i className="fa-solid fa-circle-xmark"></i>
                    <span>Persyaratan Belum Lengkap</span>
                  </button>
                )
              }
            </div>
          </div>
          <div className="w-full md:w-1/2 p-6 bg-white border border-gray-200 rounded-2xl mx-auto my-5">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Nama berkas
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userUpload.length > 0 &&
                    userUpload.map((user) => (
                      <tr key={user.id} className="bg-white border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {user.fileupload.name}
                        </th>
                        <td className="flex items-center px-6 py-4 space-x-1">
                          <button className="inline-block bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs text-white">
                            <i className="fa-solid fa-circle-check" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="inline-block bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs text-white"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {fileUpload.length > 0 &&
                    fileUpload
                      .filter(
                        (file) =>
                          file.namefile !== "bukti-pembayaran" &&
                          file.namefile !== "surat-keterangan-bekerja" &&
                          file.namefile !== "surat-keterangan-berwirausaha"
                      )
                      .map((file, index) => (
                        <tr key={file.id} className="bg-white border-b">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {file.name}
                          </th>
                          <td className="flex items-start gap-3 px-6 py-4">
                            {loading && <Loading width={5} height={5} fill="fill-sky-500" color="text-gray-200" />}
                            <form
                              onSubmit={handleUpload}
                              encType="multipart/form-data"
                              className="text-sm"
                            >
                              <input
                                type="file"
                                accept={file.accept}
                                data-id={file.id}
                                data-namefile={file.namefile}
                                name="berkas"
                                className="text-xs"
                                onChange={handleFileChange}
                              />
                              <p className="mt-2 text-xs text-gray-500">
                                <span className="font-medium">Keterangan file:</span>
                                {" "}
                                <span className="underline">{file.accept}</span>
                              </p>
                            </form>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Berkas;
