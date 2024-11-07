import React, { useState } from "react";
import { FaChevronUp } from "react-icons/fa";

const Dropdown = ({ title, options, onSelect, mainTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(title);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value) => {
    setSelectedValue(value); // Update selected value to show in dropdown
    onSelect(value);         // Pass selected value to parent
    setIsOpen(false);        // Close dropdown after selection
  };
  const dropdownWidth =
  title === "Select Gender" ? "w-[214px]" :
  title === "Select SubCategory" ? "w-[290px]" :
  title === "Select Price" ? "w-[213px]" : "w-[213px]";
  return (
    <div className="relative inline-block text-left">
      <h2 className="text-[14px] tracking-wider font-semibold text-gray-500 uppercase">{mainTitle}:</h2>
      
      <div
        onClick={toggleDropdown}
        className={`flex ${dropdownWidth} justify-between cursor-pointer items-center px-2 py-1 border border-gray-400 rounded-md`}
      >
        <span
          className={`mr-2 text-[14px] ${
            selectedValue === title ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {selectedValue}
        </span>
        <FaChevronUp
          className={`text-gray-700 rounded-full p-1 w-5 h-5 transition-transform duration-200 ${
            isOpen ? "-rotate-180" : "-rotate-90"
          }`}
        />
      </div>

      {isOpen && (
        <div
          className={`absolute left-0 ${dropdownWidth} mt-2 bg-white rounded-md shadow-lg transition-all duration-1000 ease-in-out  max-h-40 overflow-y-scroll opacity-100`}
          style={{ transitionDuration: "2s" }}
        >
          <ul className="py-2">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
