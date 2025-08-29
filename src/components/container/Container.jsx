import React from 'react'

function Container({children, className = '', size = 'default'}) {
  const sizeClasses = {
    'sm': 'max-w-4xl',
    'default': 'max-w-7xl',
    'lg': 'max-w-full',
    'tight': 'max-w-2xl'
  }

  return (
    <div className={`w-full ${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export default Container