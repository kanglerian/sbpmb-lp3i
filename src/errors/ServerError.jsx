import React from 'react'
import Lottie from 'lottie-react'
import ServerAnimation from '../assets/server.json'

const ServerError = () => {
  return (
    <main className='flex flex-col items-center justify-center bg-gray-50 h-screen'>
      <div className='w-1/2 md:w-1/5'>
        <Lottie animationData={ServerAnimation} loop={true} className='text-lg' />
      </div>
      <div className='max-w-xl w-full mx-auto px-8'>
        <div className='w-full text-center space-y-1'>
          <h2 className='font-bold text-lg text-gray-800'>Oops! Sesuatu Tidak Beres... 🚧</h2>
          <p className='text-gray-700 text-sm'>Maaf, server kami sedang mengalami masalah dan tidak dapat memproses permintaan Anda saat ini. Kami sedang bekerja keras untuk memperbaikinya.
            Silakan coba lagi dalam beberapa menit. Terima kasih atas kesabaran Anda!</p>
        </div>
      </div>
    </main>
  )
}

export default ServerError