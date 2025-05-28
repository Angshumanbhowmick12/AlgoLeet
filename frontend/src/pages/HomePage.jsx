import React from 'react'

const HomePage = () => {
  return (
    <div className='min-h-screen flex flex-col items-center mt-14 px-4'>
      <div className="absolute top-16 left-0 w-1/3 h-1/3 bg-amber-600 opacity-30 blur-3xl rounded-md bottom-9"></div>
        <h1 className="text-4xl font-extrabold z-10 text-center">
          Welcome to <span className='text-amber-600'>AlgoLeet</span>
        </h1>
        <p className="mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-300 z-10">
          Built for Developers. Trusted by Aspirants.
Practice hundreds of coding problems and prepare for top tech interviews with Algoleet’s developer-first platform
        </p>
      
    </div>
  )
}

export default HomePage