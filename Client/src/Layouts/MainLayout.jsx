import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Pages/Share/Navbar/Navbar'
import Footer from '../Pages/Share/Footer/Footer'

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