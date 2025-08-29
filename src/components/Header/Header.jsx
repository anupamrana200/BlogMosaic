import React, { useState } from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link, useLocation } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "My Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className='sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/50'>
      <Container>
        <nav className='flex items-center justify-between py-4'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to='/' className='flex items-center space-x-2 hover:opacity-80 transition-opacity'>
              <Logo width='50px' />
              <span className='text-xl font-bold text-slate-800 hidden sm:block'>
                BlogMosaic
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            {navItems.map((item) => 
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => navigate(item.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.slug 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  } ${
                    item.name === 'Login' ? 'hover:bg-emerald-500 hover:text-white' : 
                    item.name === 'Signup' ? 'hover:bg-amber-400 hover:text-slate-900' : ''
                  }`}
                >
                  {item.name}
                </button>
              ) : null
            )}
            {authStatus && (
              <LogoutBtn />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={toggleMobileMenu}
              className='p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {isMobileMenuOpen ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-slate-200/50'>
            <div className='flex flex-col space-y-2'>
              {navItems.map((item) => 
                item.active ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.slug)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.slug 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    } ${
                      item.name === 'Login' ? 'hover:bg-emerald-500 hover:text-white' : 
                      item.name === 'Signup' ? 'hover:bg-amber-400 hover:text-slate-900' : ''
                    }`}
                  >
                    {item.name}
                  </button>
                ) : null
              )}
              {authStatus && (
                <div className='pt-2'>
                  <LogoutBtn />
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header