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


  return !Loading ? (<div className='min-h-screen flex flex-wrap content-between bg-gray-400'> 
    <Toaster position="top-right" />
    <div className='w-full block'>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  </div>) : null
}

export default App
