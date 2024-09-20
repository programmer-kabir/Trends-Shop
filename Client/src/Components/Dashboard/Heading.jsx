import React, { useEffect, useState } from "react";
import {
  AiOutlineMessage,
  AiOutlineSearch,
} from "react-icons/ai";
import {  MdOutlineNotifications } from "react-icons/md";
import { FaBars, FaCircleUser, FaUser } from "react-icons/fa6";
import useAuth from "../Hooks/useAuth";
const Heading = ({ toggleSidebar }) => {

  const { user, logOut } = useAuth();
  // console.log(user);
  const [open, setOpen] = useState(false);
  const toggleBar = () => {
    setOpen(!open);
  };
  const handleLogOut = () => {
    logOut();
  };
  return (
    <div className="md:w-[75%] w-[100%]  ml-auto z-50">
      <div
        className="flex  h-16 bg-[#FFFFFF] fixed w-[100%] md:w-[75%] text-gray-100  items-center px-5 py-3 justify-between"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 0.0625em 0.0625em, rgba(5, 0, 10, 0.1) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 5px 1px inset",
        }}
      >
        <button className="md:hidden pl-2 pr-2" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className="md:flex hidden px-2 py-1 rounded-md  bg-[#F3F3F9] gap-2 items-center ">
          <AiOutlineSearch className="w-7 h-7" color="#64748b" />
          <input
            type="search"
            name=""
            className="w-full text-gray-700 bg- bg-[#F3F3F9] focus:outline-none text-base"
            id=""
            placeholder="Type to search..."
          />
        </div>
        <div className="flex items-center gap-4 md:space-x-5 space-x-0">
          <MdOutlineNotifications className="w-7 h-7" color="#64748b" />
          <AiOutlineMessage className="w-6 h-6" color="#64748b" />
          <div className="text-end">
            {/* <h2 className="font-semibold">{matchedUser?.name}</h2> */}
            <p className="font-light">Web Designer</p>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Heading;