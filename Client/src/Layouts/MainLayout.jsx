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
    <div>
        <Navbar />
        <div className='pt-[75px]'>
          <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default MainLayout