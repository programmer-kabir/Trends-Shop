import React, { useState } from "react";
import { FaArrowLeftLong, FaArrowRightToBracket } from "react-icons/fa6";
import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../../assets/LOGO/LOGO.png";
import { BsGrid } from "react-icons/bs";
import { AiOutlineFileDone, AiOutlineSearch } from "react-icons/ai";
import useAuth from "../Hooks/useAuth";
import Heading from "./Heading";
import { LuUser2 } from "react-icons/lu";
import Content from "../Content/Content";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import useAdmin from "../Hooks/useAdmin";
import LoadingSpinner from "../Design/LoadingSpinner/LoadingSpinner";

const Sidebar = () => {
  const { user, logOut, loading } = useAuth();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, isAdminLoading] = useAdmin();

  const handleNavLinkClick = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSignOut = () => {
    logOut();
  };

  if (isAdminLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <section>
      <nav className="shadow border-b">
        <div className="flex px-2 md:px-0 items-center w-full md:w-[96%] mx-auto justify-between py-2">
          <button onClick={toggleSidebar} className="md:hidden">
            <HiMiniBars3BottomLeft size={25} />
          </button>
          <div className="flex items-center">
            <Link to={'/'}>
              <img
                className="md:w-1/4 w-[90px] object-fill mr-4 rounded"
                src={logo}
                alt="logo"
              />
            </Link>
          </div>
          <div className="flex gap-5 items-center">
            <div className="md:flex hidden px-2 py-1 rounded-md bg-[#F3F3F9] gap-2 items-center">
              <AiOutlineSearch className="w-7 h-7" color="#64748b" />
              <input
                type="search"
                className="w-full text-gray-700 bg-[#F3F3F9] focus:outline-none text-base"
                placeholder="Type to search..."
              />
            </div>
            <button
              onClick={handleSignOut}
              className="border text-white border-slate-200 hover:border-[#398EFA] rounded-md flex gap-1 items-center bg-[#f50400] hover:bg-transparent hover:text-[#398EFA] px-3 py-1 transition-all duration-300 ease-in-out"
            >
              <LuUser2 size={18} />
              <p className="font-bold uppercase text-[15px]">Logout</p>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`pt-5 px-5 overflow-hidden space-y-1 h-screen transition-transform duration-300 ${
            isSidebarOpen ? "block" : "hidden"
          } lg:block lg:w-[20%] bg-white fixed lg:static z-50 w-[70%] md:w-[40%]`}
          style={{
            boxShadow:
              "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
          }}
        >
          {isAdmin ? (
            <div className="space-y-1">
              <NavLink
                to="dashboard"
                className={({ isActive }) =>
                  `font-normal transition-all py-3 text-base w-full flex items-center gap-4 px-5 capitalize ${
                    isActive ? "bg-[#e6f4ff] text-[#1677ff] rounded" : ""
                  }`
                }
              >
                <span>Dashboard</span>
              </NavLink>
              <NavLink className={({ isActive }) =>
                  `font-normal transition-all py-3 text-base w-full flex items-center gap-4 px-5 capitalize ${
                    isActive ? "bg-[#e6f4ff] text-[#1677ff] rounded" : ""
                  }`
                } to="manage_users" >
                <span>Users</span>
              </NavLink>
              <NavLink className={({ isActive }) =>
                  `font-normal transition-all py-3 text-base w-full flex items-center gap-4 px-5 capitalize ${
                    isActive ? "bg-[#e6f4ff] text-[#1677ff] rounded" : ""
                  }`
                } to="create-product" >
                <span>Create Product</span>
              </NavLink>
              <NavLink className={({ isActive }) =>
                  `font-normal transition-all py-3 text-base w-full flex items-center gap-4 px-5 capitalize ${
                    isActive ? "bg-[#e6f4ff] text-[#1677ff] rounded" : ""
                  }`
                } to="show-product" >
                <span>Show Product</span>
              </NavLink>
              <NavLink className={({ isActive }) =>
                  `font-normal transition-all py-3 text-base w-full flex items-center gap-4 px-5 capitalize ${
                    isActive ? "bg-[#e6f4ff] text-[#1677ff] rounded" : ""
                  }`
                } to="coupon" >
                <span>Coupon</span>
              </NavLink>
              <NavLink className={({ isActive }) =>
                  `font-normal transition-all py-3 text-base w-full flex items-center gap-4 px-5 capitalize ${
                    isActive ? "bg-[#e6f4ff] text-[#1677ff] rounded" : ""
                  }`
                } to="request_Payment" >
                <span>Request Payment</span>
              </NavLink>
            </div>
          ) : (
            <div className="space-y-1">
              <NavLink to="dashboard" className={({ isActive }) =>
                  `font-normal transition-all py-3 text-base w-full flex items-center gap-4 px-5 capitalize ${
                    isActive ? "bg-[#e6f4ff] text-[#1677ff] rounded" : ""
                  }`
                }>
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="my_orders" className={({ isActive }) =>
                  `font-normal transition-all py-3 text-base w-full flex items-center gap-4 px-5 capitalize ${
                    isActive ? "bg-[#e6f4ff] text-[#1677ff] rounded" : ""
                  }`
                }>
                <span>My Orders</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="md:w-[80%] overflow-x-scroll">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
