import React from "react";
import Navbar from "./Navbar.jsx";

const TestSchoolarship = () => {
  return (
    <div>
      <Navbar />
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="order-2 md:order-none w-full md:w-9/12 md:rounded-xl bg-gray-100 p-6">
            <header className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">English Test - Question 1</h2>
              <div className="flex gap-3">
                <button className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg text-white flex items-center gap-2">
                  <span className="text-sm">Lanjutkan</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </header>
            <hr className="my-4 border-gray-300" />
            <p className="text-base leading-7">
              Pada tanggal yang telah mengukir sejarah di hati setiap warga negara Indonesia, tepatnya pada 17 Agustus 1945, suatu peristiwa penting terjadi yang telah merubah nasib bangsa. Pada hari yang bersejarah itu, sebuah dokumen bersejarah yang berisi deklarasi kemerdekaan Indonesia, yang ditandatangani oleh para pemimpin bangsa, menandai awal dari perjuangan panjang untuk mencapai kemerdekaan. Dengan semangat juang yang menggelora, para pahlawan kemerdekaan memperjuangkan hak dan martabat bangsa ini, melawan segala bentuk penindasan dan kolonialisme. Sejak saat itu, setiap tahunnya, 17 Agustus dirayakan sebagai Hari Kemerdekaan Republik Indonesia, sebagai peringatan akan perjuangan berdarah para pahlawan yang telah merebut kemerdekaan dari cengkeraman penjajah. Sejarah yang menggetarkan jiwa, peringatan ini menjadi momen refleksi dan kebanggaan akan identitas nasional yang merdeka dan berdaulat.
              Tuliskan tanggal, bulan, dan tahun ketika Proklamasi Kemerdekaan Indonesia secara resmi terjadi.
            </p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center">
                <input id="default-radio-1" type="radio" defaultValue name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-gray-900">17 Agustus 1945</label>
              </div>
              <div className="flex items-center">
                <input defaultChecked id="default-radio-2" type="radio" defaultValue name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                <label htmlFor="default-radio-2" className="ml-2 text-sm font-medium text-gray-900">18 Agustus 1945</label>
              </div>
              <div className="flex items-center">
                <input defaultChecked id="default-radio-3" type="radio" defaultValue name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                <label htmlFor="default-radio-3" className="ml-2 text-sm font-medium text-gray-900">19 Agustus 1945</label>
              </div>
              <div className="flex items-center">
                <input defaultChecked id="default-radio-4" type="radio" defaultValue name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                <label htmlFor="default-radio-4" className="ml-2 text-sm font-medium text-gray-900">20 Agustus 1945</label>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-none w-full md:w-3/12 space-y-6 p-6">
            <div className="flex flex-col gap-2">
              <header className="text-center space-y-1 mb-3">
                <h1 className="font-bold text-gray-900">Time Left</h1>
                <p className="text-sm text-gray-800">Lorem ipsum dolor sit amet consectetur.</p>
              </header>
              <div className="flex justify-center gap-5">
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-gray-100 px-4 py-2 rounded-lg">00</span>
                  <span className="text-sm">Jam</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-gray-100 px-4 py-2 rounded-lg">00</span>
                  <span className="text-sm">Menit</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-gray-100 px-4 py-2 rounded-lg">00</span>
                  <span className="text-sm">Detik</span>
                </div>
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 text-sm rounded-lg mt-2">
                <i className="fa-solid fa-floppy-disk mr-2"></i>
                <span>Selesai</span></button>
            </div>
            <hr />
            <div>
              <header className="text-center space-y-1 mb-3">
                <h1 className="font-bold text-gray-900">Urutan Soal</h1>
                <p className="text-sm text-gray-800">Lorem ipsum dolor sit amet consectetur.</p>
              </header>
              <div className="grid grid-cols-6 md:grid-cols-5 gap-2">
                <button className="bg-emerald-500 text-white text-base px-4 py-2 rounded-lg">1</button>
                <button className="bg-gray-100 text-base px-4 py-2 rounded-lg">2</button>
                <button className="bg-gray-100 text-base px-4 py-2 rounded-lg">3</button>
                <button className="bg-gray-100 text-base px-4 py-2 rounded-lg">4</button>
                <button className="bg-gray-100 text-base px-4 py-2 rounded-lg">5</button>
                <button className="bg-gray-100 text-base px-4 py-2 rounded-lg">6</button>
                <button className="bg-gray-100 text-base px-4 py-2 rounded-lg">7</button>
                <button className="bg-gray-100 text-base px-4 py-2 rounded-lg">8</button>
                <button className="bg-gray-100 text-base px-4 py-2 rounded-lg">9</button>
                <button className="bg-gray-100 text-base px-4 py-2 rounded-lg">10</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestSchoolarship;
