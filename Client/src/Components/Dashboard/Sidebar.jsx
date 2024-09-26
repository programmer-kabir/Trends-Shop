import React, { useState } from "react";
// import Heading from "./Heading";
import { FaArrowLeftLong, FaArrowRightToBracket } from "react-icons/fa6";
import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../../assets/LOGO/LOGO.png";
import { BsGrid } from "react-icons/bs";
import { AiOutlineFileDone, AiOutlineSearch } from "react-icons/ai";
import useAuth from "../Hooks/useAuth";
import Heading from "./Heading";
import { LuUser2 } from "react-icons/lu";
import Content from "../Content/Content";
import Thanks from "./Thanks";
import useAdmin from "../Hooks/useAdmin";
import LoadingSpinner from "../Design/LoadingSpinner/LoadingSpinner";
const Sidebar = () => {
  const { user, logOut } = useAuth();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const handleNavLinkClick = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };
  const [isAdmin,isAdminLoading] = useAdmin();

if(isAdminLoading){
  <LoadingSpinner />
}

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const handleSignOut = () => {
    logOut();
  };

  return (
    <section className="">
        <nav className=" shadow  border-b ">

         <div className="flex items-center   w-[96%] mx-auto   justify-between py-2 ">
         <div className="">
            <img
              className="w-1/4 object-fill mr-4 rounded"
              src={logo}
              alt=""
            />
          
          </div>
          <div className="flex gap-5 items-center ">
          <div className="flex px-2 py-1 rounded-md  bg-[#F3F3F9] gap-2 items-center ">
          <AiOutlineSearch className="w-7 h-7" color="#64748b" />
          <input
            type="search"
            name=""
            className="w-full text-gray-700 bg- bg-[#F3F3F9] focus:outline-none text-base"
            id=""
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
      {/*  */}
      <div className="flex">
        
          <div className="pt-5 hidden lg:block px-5 overflow-hidden space-y-1 w-[25%] h-screen" style={{boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px"}}>
            {isAdmin && (
              <div className="space-y-1  ">
                <NavLink
                  to="dashboard"
                  className={({ isActive }) =>
                    `font-medium transition-all py-3 text-base   w-full flex items-center gap-4 px-5 capitalize ${
                      isActive ? "bg-[#e6f4ff]  text-[#1677ff] rounded" : ""
                    }`
                  }
                >
                  {/* <FaUser className="w-5 h-5" /> */}
                  <span>Dashboard</span>
                </NavLink>
               
                <NavLink
                  to="manage_users"
                  className={({ isActive }) =>
                    `font-medium transition-all py-3 text-base   w-full flex items-center gap-4 px-5 capitalize ${
                      isActive ? "bg-[#e6f4ff]  text-[#1677ff] rounded" : ""
                    }`
                  }
                >
                  {/* <FaUser className="w-5 h-5" /> */}
                  <span>Users</span>
                </NavLink>
               
              
              </div>
            )}
            {!isAdmin && (
              <div className="space-y-1">
                <NavLink
                  to="dashboard"
                  className={({ isActive }) =>
                    `font-medium transition-all py-3 text-base   w-full flex items-center gap-4 px-5 capitalize ${
                      isActive ? "bg-[#e6f4ff]  text-[#1677ff] rounded" : ""
                    }`
                  }
                >
                  {/* <FaUser className="w-5 h-5" /> */}
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="my_orders"
                  className={({ isActive }) =>
                    `font-medium transition-all py-3 text-base  w-full flex items-center gap-4 px-5 capitalize ${
                       isActive ? "bg-[#e6f4ff]  text-[#1677ff] rounded" : ""
                    }`
                  }
                >
                  {/* <FaUser className="w-5 h-5" /> */}
                  <span>My Orders</span>
                </NavLink>
              </div>
            )}

            
          </div>
        
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
