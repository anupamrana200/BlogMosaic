import { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import authService from './appwrite/auth'
import {login,logout} from './store/authSlice'
import {Header, Footer} from './components';
import {Outlet} from 'react-router-dom' 
import { Toaster } from 'react-hot-toast';

import './App.css'

function App() {
  const [Loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData){
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => {setLoading(false)})
  }, []);

  return !Loading ? (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden max-w-full'> 
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
      <Header/>
      <main className='flex-1 overflow-x-hidden max-w-full'>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden max-w-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 font-medium">Loading BlogMosaic...</p>
      </div>
    </div>
  )
}

export default App