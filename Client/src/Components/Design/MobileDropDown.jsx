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
      <div className="flex w-full border-b border-slate-200 dark:border-white/10 pb-2 text-left items-center justify-between">
        <p className="mr-1 text-slate-800 dark:text-slate-100 font-semibold">{name}</p>
        <button
          className="p-1 rounded-lg transition-all duration-300 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:text-slate-950 hover:bg-amber-500"
          onClick={toggleDropDown}
          aria-label={`Toggle ${name}`}
        >
          <GoPlus
            size={22}
            className={`${
              isDropDownOpen
                ? "rotate-45 transition-all ease-out duration-300 text-amber-500"
                : "transition-all ease-out duration-300"
            }`}
          />
        </button>
      </div>
      {isDropDownOpen && (
        <div className="py-1">
          {items.map((item, idx) => (
            <Link key={idx} to={`/${item.link}`}>
              <p className="border-b border-slate-100 dark:border-white/5 py-2.5 font-medium px-4 text-slate-600 dark:text-slate-300 cursor-pointer hover:text-amber-500 dark:hover:text-amber-400 hover:translate-x-1 transition-all text-left text-sm">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileDropDown;