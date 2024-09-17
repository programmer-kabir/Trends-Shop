import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";

const MobileDropDown = ({ name, items }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  return (
    <div className="w-full">
      <div className="flex w-full border-b pb-2 text-left items-center justify-between">
        <p className="mr-1 text-black font-medium">{name}</p>
        <button
          className="transition-all duration-300 text-black border hover:text-white hover:bg-[#F62977]"
          onClick={toggleDropDown}
        >
          <GoPlus
            size={27}
            className={`${
              isDropDownOpen
                ? "rotate-45 transition-all ease-out duration-300"
                : "transition-all ease-out duration-30"
            }`}
          />
        </button>
      </div>
      {isDropDownOpen && (
        <div>
          {items.map((item) => (
            <p className="border-b py-2 font-medium px-10 text-black cursor-pointer hover:text-[#F62977] text-left">
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileDropDown;