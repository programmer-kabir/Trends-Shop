import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AddProduct = () => {
  // Category State
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Select Category");

  // Toggle Category Dropdown
  const toggleCategoryDropdown = () => setIsCategoryOpen(!isCategoryOpen);

  // Select Category
  const handleCategorySelect = (label) => {
    setSelectedCategory(label);
    setIsCategoryOpen(false);
  };

  // Category Options
  const categories = [
    { id: 1, label: "MAN'S-CASUAL" },
    { id: 2, label: "MAN'S-FORMAL" },
    { id: 3, label: "MAN'S-SPORT" },
    { id: 4, label: "WOMEN'S-CASUAL" },
    { id: 5, label: "WOMEN'S-FORMAL" },
    { id: 6, label: "WOMEN'S-SPORT" },
    { id: 7, label: "KID'S-CASUAL" },
    { id: 8, label: "KID'S-FORMAL" },
    { id: 9, label: "KID'S-SPORT" },
  ];

  // Size State (Array for Multiple Selections)
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Toggle Size Dropdown
  const toggleSizeDropdown = () => setIsSizeOpen(!isSizeOpen);

  // Select Size (Add/Remove Size)
  const handleSizeSelect = (size) => {
    setSelectedSizes((prevSelectedSizes) => {
      if (prevSelectedSizes.includes(size)) {
        // Remove the size if already selected
        return prevSelectedSizes.filter((s) => s !== size);
      } else {
        // Add the size if not already selected
        return [...prevSelectedSizes, size];
      }
    });
  };

  // Size Options
  const sizes = ["39", "40", "41", "42", "43", "44", "45"];

  // PRice State
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Select Gender");

  // Toggle Category Dropdown
  const toggleGenderDropdown = () => setIsGenderOpen(!isGenderOpen);

  // Select Category
  const handleGenderSelect = (label) => {
    setSelectedGender(label);
    setIsGenderOpen(false);
  };

  // Category Options
  const genders = [
    { id: 1, label: "MEN'S" },
    { id: 4, label: "WOMEN" },
    { id: 7, label: "KID'S" },
  ];
  // State for Product Description
  const [description, setDescription] = useState("");

  // Default description template
  const defaultDescriptionTemplate = `
      Item_code: 
      Brand: 
      Upper_Material: 
      Sole_Material: 
      Product:
    `;

  // Handler to set default description on first focus
  const handleDescriptionFocus = () => {
    if (description === "") {
      setDescription(defaultDescriptionTemplate);
    }
  };
  // c State
  const [isColorOpen, setIsColorOPen] = useState(false);
  const [selectColor, setSelectedColor] = useState("Select Color");

  // Toggle Gender Dropdown
  const toggleColorDropdown = () => setIsColorOPen(!isColorOpen);

  // Select Gender
  const handleColorSelect = (label) => {
    setSelectedColor(label);
    setIsColorOPen(false);
  };

  // Category Options
  const colors = [
    { id: 1, label: "Black" },
    { id: 4, label: "White" },
    { id: 7, label: "Brown" },
    { id: 7, label: "Navy" },
    { id: 7, label: "Red" },
  ];
  return (
    <div className="px-5 pt-7 mx-auto">
      <span className="flex items-center">
        <span className="h-px flex-1 bg-black"></span>
        <span className="shrink-0 px-3 uppercase font-semibold text-[#0284C7]">
          Review's
        </span>
        <span className="h-px flex-1 bg-black"></span>
      </span>

      <section className="space-y-5">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium text-gray-700"
          >
            {" "}
            Product Name
          </label>

          <input
            type="text"
            id="name"
            placeholder="Enter Your Product Name"
            className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
          />
        </div>
        {/* Category Dropdown */}
        <div className="relative z-50 space-y-2 inline-block text-left w-full">
          <label className="block text-xs font-medium text-gray-700">
            Select Category
          </label>
          <button
            onClick={toggleCategoryDropdown}
            className="flex border border-gray-300 items-center justify-between px-2 w-full py-1 rounded-md"
          >
            <span
              className={
                selectedCategory === "Select Category"
                  ? "text-gray-400"
                  : "text-black"
              }
            >
              {selectedCategory}
            </span>
            {isCategoryOpen ? (
              <FaChevronUp className="w-5 h-5 ml-2 transition-transform transform duration-200" />
            ) : (
              <FaChevronDown className="w-5 h-5 ml-2 transition-transform transform duration-200" />
            )}
          </button>

          {isCategoryOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {categories.map((category) => (
                  <p
                    key={category.id}
                    onClick={() => handleCategorySelect(category.label)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {category.label}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Size Dropdown with Multiple Selection */}
        <div className="relative z-10 space-y-2 inline-block text-left w-full">
          <label className="block text-xs font-medium text-gray-700">
            Select Size
          </label>
          <button
            onClick={toggleSizeDropdown}
            className="flex border border-gray-300 items-center justify-between px-2 w-full py-1 rounded-md"
          >
            <span
              className={
                selectedSizes.length === 0 ? "text-gray-400" : "text-black"
              }
            >
              {selectedSizes.length === 0
                ? "Select Size"
                : selectedSizes.join(", ")}
            </span>
            {isSizeOpen ? (
              <FaChevronUp className="w-5 h-5 ml-2 transition-transform transform duration-200" />
            ) : (
              <FaChevronDown className="w-5 h-5 ml-2 transition-transform transform duration-200" />
            )}
          </button>

          {isSizeOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out">
              <div
                className="p-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {sizes.map((size, index) => (
                  <p
                    key={index}
                    onClick={() => handleSizeSelect(size)}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                      selectedSizes.includes(size) ? "bg-gray-200" : ""
                    }`}
                    role="menuitem"
                  >
                    {size}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Product Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-xs font-medium text-gray-700"
          >
            {" "}
            Product Price
          </label>

          <input
            type="number"
            id="price"
            placeholder="Enter Your Product Price"
            className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
          />
        </div>
        {/* Gender */}
        <div className="relative space-y-2 inline-block text-left w-full">
          <label className="block text-xs font-medium text-gray-700">
            Select Gender
          </label>
          <button
            onClick={toggleGenderDropdown}
            className="flex border border-gray-300 items-center justify-between px-2 w-full py-1 rounded-md"
          >
            <span
              className={
                selectedGender === "Select Gender"
                  ? "text-gray-400"
                  : "text-black"
              }
            >
              {selectedGender}
            </span>
            {isGenderOpen ? (
              <FaChevronUp className="w-5 h-5 ml-2 transition-transform transform duration-200" />
            ) : (
              <FaChevronDown className="w-5 h-5 ml-2 transition-transform transform duration-200" />
            )}
          </button>

          {isGenderOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {genders.map((gender) => (
                  <p
                    key={gender.id}
                    onClick={() => handleGenderSelect(gender.label)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {gender.label}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Product Star */}
        <div>
          <label
            htmlFor="star"
            className="block text-xs font-medium text-gray-700"
          >
            {" "}
            Product Star
          </label>

          <input
            type="number"
            id="star"
            placeholder="Enter Your Product Star"
            className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
          />
        </div>
        {/* Product Discount */}
        <div>
          <label
            htmlFor="discount"
            className="block text-xs font-medium text-gray-700"
          >
            {" "}
            Product Discount
          </label>

          <input
            type="number"
            id="star"
            placeholder="Enter Your Product Discount"
            className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
          />
        </div>
        {/* Product Short Description */}
        <div>
          <label className="block text-xs font-medium text-gray-700">
            {" "}
            Product Short Description
          </label>

          <textarea
            rows={5}
            id="star"
            placeholder="Enter Your Product Short Description"
            className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
          />
        </div>
        {/* Product Long Description */}
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Product Description
          </label>

          <textarea
            rows={5}
            id="star"
            placeholder="Enter Your Product Description"
            value={description}
            onFocus={handleDescriptionFocus}
            onChange={(e) => setDescription(e.target.value)}
            className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
          />
        </div>
        {/* Color */}
        <div className="relative space-y-2 inline-block text-left w-full">
          <label className="block text-xs font-medium text-gray-700">
            Select Color
          </label>
          <button
            onClick={toggleColorDropdown}
            className="flex border border-gray-300 items-center justify-between px-2 w-full py-1 rounded-md"
          >
            <span
              className={
                selectColor === "Select Color" ? "text-gray-400" : "text-black"
              }
            >
              {selectColor}
            </span>
            {isColorOpen ? (
              <FaChevronUp className="w-5 h-5 ml-2 transition-transform transform duration-200" />
            ) : (
              <FaChevronDown className="w-5 h-5 ml-2 transition-transform transform duration-200" />
            )}
          </button>

          {isColorOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {colors.map((color) => (
                  <p
                    key={color.id}
                    onClick={() => handleColorSelect(color.label)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {color.label}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AddProduct;
