import React from 'react'
import logoImg from '../assets/BlogMosaicLogo.png'

function Logo({width = '100px'}) {
  return (
    <img src={logoImg} alt="Logo" style={{ width }} />
  )
}

export default Logo