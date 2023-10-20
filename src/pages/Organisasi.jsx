import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import moment from "moment-timezone";
import checkExpiry from "../config/checkExpiry.js";
import Navigation from "../components/Navigation.jsx";

import "../assets/css/datatables-custom.css";

const Organisasi = () => {
  const [organizations, setOrganizations] = useState([]);

  const tableRef = useRef(null);

  const token = localStorage.getItem("token");
  const identity = localStorage.getItem("identity");

  const getUser = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/user/get", {
        params: {
          identity: identity,
          token: token,
        },
      })
      .then((res) => {
        let applicant = res.data.applicant;
        let organizations = res.data.organizations;
        console.log(res.data);
        setOrganizations(organizations);
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

  const addOrganization = async () => {
    let name = prompt("Nama organisasi");
    let position = prompt("Apa jabatan anda?");
    let year = prompt("Tulis tanggalnya (YYYY-MM-DD):");
    if (name && position && year) {
      await axios
        .post(`http://127.0.0.1:8000/api/organization`, {
          name: name,
          position: position,
          year: year,
          identity_user: identity,
        })
        .then((res) => {
          console.log(res.data);
          getUser();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const deleteOrganization = async (id) => {
    let confirmDelete = confirm(
      "Apakah anda yakin ingin menghapus organisasi?"
    );
    if (confirmDelete) {
      await axios
        .delete(`http://127.0.0.1:8000/api/organization/${id}`)
        .then((res) => {
          console.log(res.data);
          getUser();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  useEffect(() => {
    if (!token) {
      return navigate("/");
    }
    getUser();
    checkExpiry();
  }, []);

  useEffect(() => {
    if (organizations.length > 0 && tableRef.current) {
      $(tableRef.current).DataTable();
    }
  }, [organizations]);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-5">
        <Navigation />

        <div className="block max-w-7xl px-6 py-4 bg-white border border-gray-200 rounded-2xl mx-auto mt-5">
          <button
            type="button"
            onClick={addOrganization}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Tambah Data
          </button>
          <div className="relative overflow-x-auto py-5">
            <table
              ref={tableRef}
              className="w-full text-sm text-left text-gray-500"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3 whitespace-nowrap rounded-tl-xl">
                    No.
                  </th>
                  <th className="px-6 py-3 whitespace-nowrap">
                    Nama Organisasi
                  </th>
                  <th className="px-6 py-3 whitespace-nowrap">Jabatan</th>
                  <th className="px-6 py-3 whitespace-nowrap">Tahun</th>
                  <th className="px-6 py-3 whitespace-nowrap rounded-tr-xl">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {organizations.length > 0 ? (
                  organizations.map((organization, i) => (
                    <tr className="bg-white border-b" key={organization.id}>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {organization.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {organization.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment
                          .tz(organization.year, "Asia/Jakarta")
                          .format("L")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => deleteOrganization(organization.id)}
                          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <td
                    colSpan={5}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    Data organisasi belum ada.
                  </td>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Organisasi;
