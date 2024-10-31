import React from 'react'
import useAuth from '../../../Components/Hooks/useAuth'
import todayOrder from "../../../assets/AdminDashboardIcon/TodayOrder.svg";
import yesterDayOrder from "../../../assets/AdminDashboardIcon/YeasteDayOrder.svg";
import monthlyOrder from "../../../assets/AdminDashboardIcon/MonthlyOrder.svg";
import TotalOrder from "../../../assets/AdminDashboardIcon/TotalOrder.svg";
const AdminBoard = () => {
  const {user} = useAuth()
  return (
    <div className='px-5 pt-7'>
       <div className="space-y-1">
            <h2 className="text-2xl font-medium">Dashboard</h2>
            <p className="text-sm">
              Welcome to your dashboard {user?.displayName}
            </p>
          </div>
          <section className="md:flex pt-8 items-center gap-7 justify-between">
            <div className="flex  items-center justify-between bg-white shadow rounded-md px-6 w-full py-5">
              <div className="space-y-1 ">
                <h2 className="text-base font-semibold">
                  10
                </h2>
                <p className="text-sm">Today Orders </p>
              </div>
              <div className="bg-[#50CD89] text-white rounded-full p-3">
                <img className="text-white" src={todayOrder} alt="" />
              </div>
            </div>
            <div className="flex  items-center justify-between bg-white shadow rounded-md px-6 w-full py-5">
              <div className="space-y-1 ">
                <h2 className="text-base font-semibold">
                 12
                </h2>
                <p className="text-sm">Yesterday Orders</p>
              </div>
              <div className="bg-[#50CD89] text-white rounded-full p-3">
                <img className="text-white" src={yesterDayOrder} alt="" />
              </div>
            </div>
            <div className="flex  items-center justify-between bg-white shadow rounded-md px-6 w-full py-5">
              <div className="space-y-1 ">
                <h2 className="text-base font-semibold">185</h2>
                <p className="text-sm">Monthly Orders</p>
              </div>
              <div className="bg-[#50CD89] text-white rounded-full p-3">
                <img className="text-white" src={monthlyOrder} alt="" />
              </div>
            </div>
            <div className="flex  items-center justify-between bg-white shadow rounded-md px-6 w-full py-5">
              <div className="space-y-1 ">
                <h2 className="text-base font-semibold">
                  4055
                </h2>
                <p className="text-sm">Total Orders</p>
              </div>
              <div className="bg-[#50CD89] text-white rounded-full p-3">
                <img className="text-white" src={TotalOrder} alt="" />
              </div>
            </div>
          </section>
    </div>
  )
}

export default AdminBoard