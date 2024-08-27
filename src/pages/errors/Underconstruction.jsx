import Lottie from 'lottie-react'
import ConstructAnimation from '../../assets/underconstruct.json'

const Underconstruction = () => {
  return (
    <main className='flex flex-col items-center justify-center bg-gray-50 gap-5 h-screen'>
      <div className='w-1/2 md:w-2/12'>
        <Lottie animationData={ConstructAnimation} loop={true} className='text-lg' />
      </div>
      <div className='max-w-xl w-full mx-auto px-8'>
        <div className='w-full text-center space-y-2'>
          <h2 className='font-bold text-2xl text-gray-800'>Dalam Pengembangan Situs 🚧</h2>
          <p className='text-gray-700'>Kami sedang mengembangkan situs untuk meningkatkan pengalaman pengguna. Tim kami fokus pada peningkatan tampilan dan fungsionalitas. Terima kasih atas dukungan dan kesabaran Anda!</p>
        </div>
      </div>
    </main>
  )
}

export default Underconstruction