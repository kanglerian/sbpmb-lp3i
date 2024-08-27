import Lottie from 'lottie-react'
import ServerAnimation from '../assets/server.json'

const LoadingScreen = () => {
  return (
    <main className='flex flex-col items-center justify-center bg-gray-100 h-screen z-50'>
      <div className='w-1/2 md:w-1/5'>
        <Lottie animationData={ServerAnimation} loop={true} className='text-lg' />
      </div>
      <div className='max-w-xl w-full mx-auto px-8'>
        <div className='w-full text-center space-y-1'>
          <h2 className='font-bold text-lg text-gray-800'>Memuat...</h2>
          <p className='text-gray-700 text-sm'>
            Harap tunggu sejenak. Kami sedang memproses permintaan Anda!
          </p>
        </div>
      </div>
    </main>
  )
}

export default LoadingScreen