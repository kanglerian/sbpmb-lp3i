import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import checkExpiry from "../config/checkExpiry.js";
import Navigation from "../components/Navigation.jsx";

const Berkas = () => {
  const [fileUpload, setfileUpload] = useState([]);
  const [userUpload, setuserUpload] = useState([]);
  const token = localStorage.getItem("token");
  const identity = localStorage.getItem("identity");

  const handleFileChange = (e) => {
    const targetFile = e.target.files[0];
    const targetId = e.target.dataset.id;
    const targetNamefile = e.target.dataset.namefile;
    let data = {
      targetFile: targetFile,
      targetId: targetId,
      targetNamefile: targetNamefile,
    };
    if (targetFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        let data = {
          identity: identity,
          image: event.target.result.split(";base64,").pop(),
          namefile: targetNamefile,
          typefile: targetFile.name.split(".").pop(),
        };
        let status = {
          identity_user: identity,
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
              .post(`https://database.politekniklp3i-tasikmalaya.ac.id/api/userupload`, status)
              .then((res) => {
                console.log(res.data);
                alert('Berhasil diupload!');
                getUser();
              })
              .catch((err) => {
                console.log(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      };

      reader.readAsDataURL(targetFile);
    }
  };

  const getUser = async () => {
    await axios
      .get("https://database.politekniklp3i-tasikmalaya.ac.id/api/user/get", {
        params: {
          identity: identity,
          token: token,
        },
      })
      .then((res) => {
        let applicant = res.data.applicant;
        let fileuploadData = res.data.fileupload;
        let useruploadData = res.data.userupload;
        console.log(res.data);
        setfileUpload(fileuploadData);
        setuserUpload(useruploadData);
        setStudent(applicant);
      })
      .catch((err) => {
        if (err.message == "Request failed with status code 404") {
          localStorage.removeItem("identity");
          localStorage.removeItem("token");
          localStorage.removeItem("expiry");
          navigate("/");
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
    checkExpiry();
  }, []);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-5">
        <Navigation />
        <div className="block max-w-7xl px-6 py-4 bg-white border border-gray-200 rounded-2xl mx-auto mt-5">
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
                    <tr className="bg-white border-b dark:bg-gray-800">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {user.name}
                      </th>
                      <td className="px-6 py-4">
                        <button className="inline-block bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs text-white">
                          <i className="fa-solid fa-circle-check" />
                        </button>
                        <a
                          href="https://api.politekniklp3i-tasikmalaya.ac.id/pmbonline/download?identity"
                          className="bg-sky-500 px-3 py-1 rounded-md text-xs text-white"
                        >
                          <i className="fa-solid fa-download" />
                        </a>
                      </td>
                    </tr>
                  ))}
                {fileUpload.length > 0 &&
                  fileUpload.map((file) => (
                    <tr className="bg-white border-b dark:bg-gray-800">
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
                        >
                          <div>
                            <input
                              type="file"
                              accept={file.accept}
                              data-id={file.id}
                              data-namefile={file.namefile}
                              name="berkas"
                              className="text-xs"
                              onChange={handleFileChange}
                            />
                            <button
                              type="submit"
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                              Upload
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Berkas;
