import React, { useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { VscTriangleDown } from "react-icons/vsc";
import { Link, NavLink } from "react-router-dom";

const DropDown = ({ name, items }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="relative inline-block text-left">
      <div className="w-full text-slate-700 dark:text-slate-200 group hover:text-amber-500 dark:hover:text-amber-400 inline-block transition-colors">
        <button className="py-2 flex items-center">
          <p className="mr-1 text-base font-medium">{name}</p>
          <VscTriangleDown className="font-thin text-xs transition-transform duration-300 transform rotate-0 group-hover:rotate-180" />
        </button>

        <ul className="absolute hidden group-hover:block pt-2 py-3 w-56 bg-white dark:bg-[#111827] border border-slate-100 dark:border-white/10 rounded-xl shadow-xl z-50">
          {items.map((item, index) => (
            <li
              key={index}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <NavLink
                to={item.link}
                className={`flex items-center hover:text-amber-500 dark:hover:text-amber-400 gap-1 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 transition-all duration-300 ${
                  hoveredItem === index ? "hover:transform translate-x-2" : ""
                }`}
              >
                {hoveredItem === index && <FaMinus className="text-xs text-amber-500" />}
                <span className={hoveredItem === index ? "ml-0" : ""}>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDown;
