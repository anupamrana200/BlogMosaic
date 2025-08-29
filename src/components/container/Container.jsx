import React from 'react'

function Container({children}) {
  return (
    <div className='w-full max-w-7xl mx-auto px-4' style={{ fontFamily: 'Poppins, sans-serif, Montserrat' }}>
      {children}
    </div>
  )
}

export default Container