import React from 'react'
import Lottie from 'lottie-react';
import ServerAnimation from '../assets/animations/server.json'

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 w-full h-full z-50 fixed" id="data-loading">
      <Lottie animationData={ServerAnimation} loop={true} className='h-40' />
      <h1 className="text-white relative top-0 text-sm">Sedang memuat data...</h1>
    </div>

  )
}

export default LoadingScreen