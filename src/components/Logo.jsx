import React from 'react'
import logoImg from '../assets/BlogMosaicLogo.png'

function Logo({width = '100px', className = '', showText = false}) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src={logoImg} 
        alt="BlogMosaic Logo" 
        style={{ width }} 
        className="object-contain transition-all duration-200 hover:scale-105"
      />
      {showText && (
        <span className="text-xl font-bold text-slate-800 hidden sm:block">
          BlogMosaic
        </span>
      )}
    </div>
  )
}

export default Logo