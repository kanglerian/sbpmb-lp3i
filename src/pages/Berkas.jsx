import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../templates/Navbar.jsx";

const Berkas = () => {

  const navigate = useNavigate();

  const [student, setStudent] = useState({});

  const [fileUpload, setFileUpload] = useState([]);
  const [userUpload, setUserUpload] = useState([]);

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
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
                getUser();
              })
              .catch((err) => {
                alert("Mohon maaf, ada kesalahan di sisi Server.");
                console.log(err.message);
              });
          })
          .catch((err) => {
            alert("Mohon maaf, ada kesalahan di sisi Server.");
          });
      };

      reader.readAsDataURL(targetFile);
    }
  };

  const handleDelete = async (user) => {
    console.log(user);
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
              getUser();
            })
            .catch((err) => {
              console.log(err.message);
            });
        })
        .catch((err) => {
          console.log(err.message);
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
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.log(error);
        }
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
                        {userUpload.find((upload) => upload.fileupload.namefile === 'foto') ? (
                          <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                        ) : (
                          <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                        )}
                      </li>
                    )
                  }
                  {
                    userUpload && (
                      <li className="space-x-2">
                        <span className="text-gray-900">Akta Kelahiran</span>
                        {userUpload.find((upload) => upload.fileupload.namefile === 'akta-kelahiran') ? (
                          <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                        ) : (
                          <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                        )}
                      </li>
                    )
                  }
                  {
                    userUpload && (
                      <li className="space-x-2">
                        <span className="text-gray-900">Kartu Kelaurga</span>
                        {userUpload.find((upload) => upload.fileupload.namefile === 'kartu-keluarga') ? (
                          <i className="text-emerald-500 fa-solid fa-circle-check"></i>
                        ) : (
                          <i className="text-red-500 fa-solid fa-circle-xmark"></i>
                        )}
                      </li>
                    )
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-6 bg-white border border-gray-200 rounded-2xl mx-auto mt-5">
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
                        <td className="px-6 py-4 space-x-1">
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
                          <td className="px-6 py-4">
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
