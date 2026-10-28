import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Pages/Share/Navbar/Navbar'
import Footer from '../Pages/Share/Footer/Footer'
import useAuth from '../Components/Hooks/useAuth'
import Loader from '../Components/Design/LoadingSpinner/LoadingSpinner'

const MainLayout = () => {
  const {user, loading} = useAuth()
  if(loading){
    return <Loader />
  }
  return (
    <div className="bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
        <Navbar />
        <div className='pt-[70px] md:pt-[75px]'>
          <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default MainLayout