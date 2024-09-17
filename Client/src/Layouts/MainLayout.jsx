import React from 'react'
import Navbar from '../Pages/Share/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Pages/Share/Footer'

const MainLayout = () => {
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