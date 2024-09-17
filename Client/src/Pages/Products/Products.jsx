import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../Redux/Shoes/shoesSlice";
import { IoIosArrowDown } from "react-icons/io";

const Products = () => {
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShoes());
  }, [dispatch]);

  // State to track open dropdown and subcategory
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Toggle main category dropdown
  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
      setOpenSubcategory(null);
    }
  };

  // Toggle subcategory and set its value
  const toggleSubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory); // Set selected subcategory value
  };
  console.log(selectedSubcategory);
  const categories = [
    {
      name: "GENDER'S CATEGORY",
      subcategories: ["MEN'S", "WOMEN'S", "KID'S"],
    },
    {
      name: "MAN'S SUB-CATEGORY",
      subcategories: ["MAN'S CASUAL", "MAN'S FORMAL", "MAN'S SPORT"],
    },
    {
      name: "WOMEN'S SUB-CATEGORY",
      subcategories: ["WOMEN'S CASUAL", "WOMEN'S FORMAL", "WOMEN'S SPORT"],
    },
    {
      name: "KID'S SUB-CATEGORY",
      subcategories: ["KID'S CASUAL", "KID'S FORMAL", "KID'S SPORT"],
    },
    {
      name: "PRODUCT'S TYPE",
      subcategories: ["SHOE'S", "BELT'S", "BAG'S", "SOCK'S"],
    },
    {
      name: "OFFER'S",
      subcategories: ["DISCOUNT", "CLEARANCE", "BUNDLE OFFERS"],
    },
  ];

  // Price dropdown
  const [selectedOption, setSelectedOption] = useState("Sort By Price");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const togglePriceDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false); 
  };
  return (
    <section className="flex pt-16 px-2 gap-5">
      <div className="h-auto w-[25%] text-center text-[#4D4F53]">
        <p className="uppercase border-b-2 border-gray-400  font-bold text-center">
          Shop by Filter
        </p>
        {/* Category */}
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative border-r flex flex-col  w-full text-center px-5"
          >
            <button
              onClick={() => toggleDropdown(index)}
              className="flex justify-center items-center text-center px-2 py-[14px] text-sm  hover:bg-gray-100 text-black rounded-md focus:outline-none w-full"
            >
              <span>{category.name}</span>
              <IoIosArrowDown
                className={`w-5 h-5 ml-auto transform transition-transform duration-500 ${
                  openDropdown === index ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`w-full   transition-all duration-300 ${
                openDropdown === index
                  ? "opacity-100 max-h-40 "
                  : "opacity-0 max-h-0 py-0 pointer-events-none"
              } overflow-hidden`}
            >
              {category.subcategories.map((subcategory, subIndex) => (
                <div key={subIndex}>
                  <a
                    href="#"
                    className="block px-4 text-[15px] py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => toggleSubcategory(subcategory)}
                  >
                    {subcategory}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Short Price */}
        <div className="pt-5">
          <p className="uppercase border-b-2 border-gray-400 font-bold  text-center">
            Sort By Price
          </p>
          <div className="relative inline-block px-2 pt-2 font-light text-left w-full">
      <button
        onClick={togglePriceDropdown}
        className="flex items-center text-sm px-4 py-2  text-black border rounded-md focus:outline-none w-full"
      >
        <span>{selectedOption}</span>
        <IoIosArrowDown
          className={`w-5 h-5 ml-auto transform transition-transform duration-500 ${
            isDropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className="absolute  w-full text-sm rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300"
        >
          <a
            href="#"
            onClick={() => handleOptionClick("Low to High")}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Low to High
          </a>
          <a
            href="#"
            onClick={() => handleOptionClick("High to Low")}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            High to Low
          </a>
        </div>
      )}
    </div>
        </div>
      </div>

      <div className="  w-full">sd</div>
    </section>
  );
};

export default Products;
