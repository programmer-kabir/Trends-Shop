import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { useForm } from "react-hook-form";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isLoading, Shoes } = useSelector((state) => state.Shoes);

  useEffect(() => {
    dispatch(fetchShoes());
  }, [dispatch]);

  const currentItems = Shoes.find((shoe) => shoe._id === id);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors: formError },
  } = useForm({
    defaultValues: {
      name: currentItems?.name || "",
      category: currentItems?.category || "",
      size: currentItems?.size || [],
      gender: currentItems?.gender || "",
      price: currentItems?.price || "",
      color: currentItems?.color || "",
    },
  });

  // Dynamically set form values when currentItems change
  useEffect(() => {
    if (currentItems) {
      setValue("name", currentItems.name);
      setValue("category", currentItems.category);
      setValue("size", currentItems.size);
      setValue("gender", currentItems.gender);
      setValue("price", currentItems.price);
    }
  }, [currentItems, setValue]);

  // State for Category Dropdown
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    currentItems?.category || "Select Category"
  );

  // Toggle Category Dropdown
  const toggleCategoryDropdown = () => setIsCategoryOpen(!isCategoryOpen);

  // Handle Category Select
  const handleCategorySelect = (label) => {
    setSelectedCategory(label);
    setValue("category", label, { shouldValidate: true });
    setIsCategoryOpen(false);
  };

  // Category Options
  const categories = [
    { id: 1, label: "MAN'S CASUAL" },
    { id: 2, label: "MAN'S FORMAL" },
    { id: 3, label: "MAN'S SPORT" },
    { id: 4, label: "WOMEN'S CASUAL" },
    { id: 5, label: "WOMEN'S FORMAL" },
    { id: 6, label: "WOMEN'S SPORT" },
    { id: 7, label: "KID'S CASUAL" },
    { id: 8, label: "KID'S FORMAL" },
    { id: 9, label: "KID'S SPORT" },
  ];

  // State for Size Dropdown
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState(currentItems?.size || []);

  // Toggle Size Dropdown
  const toggleSizeDropdown = () => setIsSizeOpen(!isSizeOpen);

  // Handle Size Select
  const handleSizeSelect = (size) => {
    let updatedSizes = [...selectedSizes];
    if (updatedSizes.includes(size)) {
      updatedSizes = updatedSizes.filter((s) => s !== size);
    } else {
      updatedSizes.push(size);
    }
    setSelectedSizes(updatedSizes);
    setValue("size", updatedSizes, { shouldValidate: true });
  };

  // Size Options
  const sizes = ["39", "40", "41", "42", "43", "44", "45"];

  // State for Gender Dropdown
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(
    currentItems?.gender || "Select Gender"
  );

  const genders = [
    { id: 1, label: "Male" },
    { id: 2, label: "Female" },
    { id: 3, label: "Unisex" },
  ];

  // Toggle Gender Dropdown
  const toggleGenderDropdown = () => setIsGenderOpen(!isGenderOpen);

  // Handle Gender Select
  const handleGenderSelect = (label) => {
    setSelectedGender(label);
    setValue("gender", label, { shouldValidate: true });
    setIsGenderOpen(false);
  };
  // c State
  const [isColorOpen, setIsColorOPen] = useState(false);
  const [selectColor, setSelectedColor] = useState(
    currentItems?.Description?.Color || "Select Color"
  );

  // Toggle Gender Dropdown
  const toggleColorDropdown = () => setIsColorOPen(!isColorOpen);

  // Select Gender
  const handleColorSelect = (label) => {
    setSelectedColor(label);
    setValue("color", label, { shouldValidate: true });
    setIsColorOPen(false);
  };

  // Category Options
  const colors = [
    { id: 1, label: "Black" },
    { id: 2, label: "White" },
    { id: 3, label: "Brown" },
    { id: 4, label: "Navy" },
    { id: 5, label: "Red" },
  ];
  const navigate = useNavigate();
  // Handle Form Submission
  //   console.log(currentItems);
  const onSubmit = (data) => {
    const name = data.name;
    const stock = data.stock;
    const category = data.category;
    const size = data.size;
    const price = data.price;
    const gender = data.gender;
    const star = data.star;

    const Discount = data.Discount;
    const shortDescription = data.shortDescription;
    const Description = {
      Item_code: data.Item_code,
      Brand: data.Brand,
      Upper_Material: data.Upper_Material,
      Sole_Material: data.Sole_Material,
      Color: data.color,
      product: data.product.split("\n"), // Convert product to array by splitting input on newline
    };
    const mainData = {
      id,
      updatedData: {
        name,
        category,
        size,
        price,
        gender,
        star,
        Discount,
        stock,
        shortDescription,
        Description,
      },
    };
    axios
      .patch(`${import.meta.env.VITE_LOCALHOST_KEY}/shoes`, mainData)
      .then((response) => {
        toast.success("Item updated successfully");
        navigate("../show-product");
      })
      .catch((error) => {
        toast.error("Error updating item");
      });
  };

  return (
    <div className="px-5 pt-7 mx-auto">
      <span className="flex items-center">
        <span className="h-px flex-1 bg-black"></span>
        <span className="shrink-0 px-3 uppercase font-semibold text-[#0284C7]">
          {currentItems?.name || "Edit Product"}
        </span>
        <span className="h-px flex-1 bg-black"></span>
      </span>
      {!isLoading && currentItems && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              defaultValue={currentItems?.name}
              {...register("name", { required: true })}
              placeholder="Enter Your Product Name"
              className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
            />
            {formError.name && (
              <span className="text-[#f50400] text-sm">
                Product Name is required
              </span>
            )}
          </div>

          <div className="flex gap-7">
            {/* Category Field */}
            {currentItems?.category && (
              <div className="relative z-50 space-y-2 inline-block text-left w-full">
                <label className="block text-xs font-medium text-gray-700">
                  Select Category
                </label>
                <div
                  onClick={toggleCategoryDropdown}
                  className="flex cursor-pointer border border-gray-300 items-center justify-between px-2 w-full py-1 rounded-md"
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
                  {isCategoryOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {isCategoryOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white shadow-lg rounded-md">
                    {categories.map((category) => (
                      <p
                        key={category.id}
                        onClick={() => handleCategorySelect(category.label)}
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {category.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Size Field */}
            {currentItems?.size && (
              <div className="relative z-50 space-y-2 inline-block text-left w-full">
                <label className="block text-xs font-medium text-gray-700">
                  Select Size
                </label>
                <div
                  onClick={toggleSizeDropdown}
                  className="flex cursor-pointer border border-gray-300 items-center justify-between px-2 w-full py-1 rounded-md"
                >
                  <span
                    className={
                      selectedSizes.length === 0
                        ? "text-gray-400"
                        : "text-black"
                    }
                  >
                    {selectedSizes.length > 0
                      ? selectedSizes.join(", ")
                      : "Select Size"}
                  </span>
                  {isSizeOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {isSizeOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white shadow-lg rounded-md">
                    {sizes.map((size) => (
                      <p
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${
                          selectedSizes.includes(size) ? "bg-gray-200" : ""
                        }`}
                      >
                        {size}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-7">
            {/* Price Field */}
            {currentItems?.price !== undefined && (
              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block text-xs font-medium text-gray-700"
                >
                  Product Price
                </label>
                <input
                  type="number"
                  id="price"
                  defaultValue={currentItems?.price}
                  {...register("price", {
                    required: "Please enter the product price to continue.",
                  })}
                  placeholder="Enter Your Product Price"
                  className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
                />
                {formError.price && (
                  <span className="text-[#f50400] text-sm">
                    {formError.price.message}
                  </span>
                )}
              </div>
            )}
            {/* Gender Field */}
            {currentItems?.gender && (
              <div className="relative w-full space-y-2 inline-block text-left">
                <label className="block text-xs font-medium text-gray-700">
                  Select Gender
                </label>
                <div
                  onClick={toggleGenderDropdown}
                  className="flex cursor-pointer border border-gray-300 items-center justify-between px-2 w-full py-1 rounded-md"
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
                    <FaChevronUp className="w-5 h-5 ml-2" />
                  ) : (
                    <FaChevronDown className="w-5 h-5 ml-2" />
                  )}
                </div>
                {isGenderOpen && (
                  <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {genders.map((gender) => (
                        <p
                          key={gender.id}
                          onClick={() => handleGenderSelect(gender.label)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          {gender.label}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Star and Discount */}
          <div className="gap-7 flex">
            {/* Product Star */}
            {currentItems?.star !== undefined && (
              <div className="w-1/2">
                <label
                  htmlFor="star"
                  className="block text-xs font-medium text-gray-700"
                >
                  Product Star
                </label>

                <input
                  type="number"
                  id="star"
                  defaultValue={currentItems?.star}
                  {...register("star", {
                    required: "Please enter a product star rating",
                    min: {
                      value: 1,
                      message: "The value must be at least 1",
                    },
                    max: {
                      value: 5,
                      message: "The value must be no more than 5",
                    },
                  })}
                  placeholder="Enter Your Product Star"
                  className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
                />
                {formError.star && (
                  <span className="text-[#f50400] text-sm">
                    {formError.star.message}
                  </span>
                )}
              </div>
            )}

            {/* Product Discount */}

            <div className="w-1/2">
              <label
                htmlFor="discount"
                className="block text-xs font-medium text-gray-700"
              >
                Product Discount
              </label>

              <input
                type="number"
                id="discount"
                defaultValue={currentItems?.Discount}
                {...register("Discount", {
                  required: "Please enter a product discount",
                })}
                placeholder="Enter Your Product Discount"
                className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
              />
              {formError.discount && (
                <span className="text-[#f50400] text-sm">
                  {formError.discount.message}
                </span>
              )}
            </div>
          </div>
          {/* Color and Available Stock */}
          <div className="gap-7 flex">
            {/* Color Dropdown */}
            {currentItems?.Description.Color && (
              <div className="relative space-y-2 inline-block text-left w-1/2">
                <label className="block text-xs font-medium text-gray-700">
                  Select Color
                </label>
                <div
                  onClick={toggleColorDropdown}
                  className="flex cursor-pointer border border-gray-300 items-center justify-between px-2 w-full py-1 rounded-md"
                >
                  <span
                    className={
                      selectColor === "Select Color"
                        ? "text-gray-400"
                        : "text-black"
                    }
                  >
                    {selectColor}
                  </span>
                  {isColorOpen ? (
                    <FaChevronUp className="w-5 h-5 ml-2 transition-transform transform duration-200" />
                  ) : (
                    <FaChevronDown className="w-5 h-5 ml-2 transition-transform transform duration-200" />
                  )}
                </div>

                {isColorOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
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
                {formError.color && (
                  <span className="text-[#f50400] text-sm">
                    {formError.color.message}
                  </span>
                )}
              </div>
            )}

            {/* Product Stock */}
            {currentItems?.stock !== undefined && (
              <div className="w-1/2">
                <label
                  htmlFor="stock"
                  className="block text-xs font-medium text-gray-700"
                >
                  Product Stock
                </label>

                <input
                  type="number"
                  id="stock"
                  defaultValue={currentItems?.stock}
                  {...register("stock", {
                    required: "Please give me product stock",
                  })}
                  placeholder="Enter Your Product Stock"
                  className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
                />
                {formError.stock && (
                  <span className="text-[#f50400] text-sm">
                    {formError.stock.message}
                  </span>
                )}
              </div>
            )}
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
              defaultValue={currentItems?.shortDescription}
              {...register("shortDescription", {
                required: "Give me a Product Shortly Description",
              })}
              placeholder="Enter Your Product Short Description"
              className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
            />
            {formError.shortDescription && (
              <span className="text-[#f50400] text-sm">
                {formError.shortDescription.message}
              </span>
            )}
          </div>
          {/* Item and Brand */}

          <div className="flex gap-7">
            <div className="w-1/2">
              <label
                htmlFor="Item_code"
                className="block text-xs font-medium text-gray-700"
              >
                Item Code
              </label>
              <input
                type="text"
                id="Item_code"
                defaultValue={currentItems?.Description?.Item_code}
                placeholder="Item Code"
                {...register("Item_code", {
                  required: "Item code is required",
                })}
                className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
              />
              {formError.Item_code && (
                <span className="text-[#f50400] text-sm">
                  {formError.Item_code.message}
                </span>
              )}
            </div>

            {/* Brand */}
            <div className="w-1/2">
              <label
                htmlFor="Brand"
                className="block text-xs font-medium text-gray-700"
              >
                Brand
              </label>
              <input
                type="text"
                id="Brand"
                defaultValue={currentItems?.Description?.Brand}
                placeholder="Brand Name"
                {...register("Brand", { required: "Brand is required" })}
                className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
              />
              {formError.Brand && (
                <span className="text-[#f50400] text-sm">
                  {formError.Brand.message}
                </span>
              )}
            </div>
          </div>
          {/* Upper_Material  Sole_Material*/}
          <div className="flex gap-7">
            {/* Upper_Material */}
            <div className="w-1/2">
              <label
                htmlFor="Upper_Material"
                className="block text-xs font-medium text-gray-700"
              >
                Upper Material
              </label>
              <input
                type="text"
                id="Upper_Material"
                defaultValue={currentItems?.Description?.Upper_Material}
                placeholder=" Upper Material"
                {...register("Upper_Material", {
                  required: "Upper material is required",
                })}
                className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
              />
              {formError.Upper_Material && (
                <span className="text-[#f50400] text-sm">
                  {formError.Upper_Material.message}
                </span>
              )}
            </div>
            {/* Sole_Material */}
            <div className="w-1/2">
              <label
                htmlFor="Sole_Material"
                className="block text-xs font-medium text-gray-700"
              >
                Sole Material
              </label>
              <input
                type="text"
                defaultValue={currentItems?.Description?.Sole_material}
                placeholder=" Sole Material"
                id="Sole_Material"
                {...register("Sole_material", {
                  required: "Sole material is required",
                })}
                className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
              />
              {formError.Sole_Material && (
                <span className="text-[#f50400] text-sm">
                  {formError.Sole_Material.message}
                </span>
              )}
            </div>
          </div>
          {/* Product Description */}
          <div>
            <label
              htmlFor="product"
              className="block text-xs font-medium text-gray-700"
            >
              Product Description
            </label>
            <textarea
              id="product"
              rows={5}
              defaultValue={currentItems?.Description?.product}
              placeholder="Enter product description, separate each line with a new line"
              {...register("product", {
                required: "Product description is required",
              })}
              className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
            />
            {formError.product && (
              <span className="text-[#f50400] text-sm">
                {formError.product.message}
              </span>
            )}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="border mt-8 w-full text-white bg-[#f50400] hover:bg-[#d90400] rounded-md px-5 py-2 text-lg"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
