import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { VscCloudUpload } from "react-icons/vsc";
import PropagateLoader from "react-spinners/PropagateLoader";

const AddProduct = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors: formError },
  } = useForm({
    defaultValues: {
      category: "", // Initialize category as empty for validation
      size: [], // Initialize size as an empty array
      gender: "", // Initialize gender as empty
      color: "",
    },
  });
  // Category State
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Select Category");

  // Toggle Category Dropdown
  const toggleCategoryDropdown = () => setIsCategoryOpen(!isCategoryOpen);

  // Select Category
  const handleCategorySelect = (label) => {
    setSelectedCategory(label);
    setValue("category", label, { shouldValidate: true }); // Set form value
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

  // Size State (Array for Multiple Selections)
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Toggle Size Dropdown
  const toggleSizeDropdown = () => setIsSizeOpen(!isSizeOpen);

  // Select Size (Add/Remove Size)
  const handleSizeSelect = (size) => {
    let updatedSizes = [...selectedSizes];
    if (updatedSizes.includes(size)) {
      updatedSizes = updatedSizes.filter((s) => s !== size); // Deselect if already selected
    } else {
      updatedSizes.push(size); // Add if not selected
    }
    setSelectedSizes(updatedSizes);
    setValue("size", updatedSizes, { shouldValidate: true }); // Set form value and validate
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
    setValue("gender", label, { shouldValidate: true }); // Set value with validation
    setIsGenderOpen(false);
  };

  // Category Options
  const genders = [
    { id: 1, label: "MEN'S" },
    { id: 4, label: "WOMEN" },
    { id: 7, label: "KID'S" },
  ];
  // State for Product Description
  const [description, setDescription] = useState({
    Item_code: "",
    Brand: "",
    Upper_Material: "",
    Sole_Material: "",
    product: "",
  });

  // c State
  const [isColorOpen, setIsColorOPen] = useState(false);
  const [selectColor, setSelectedColor] = useState("Select Color");

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

  const [mainImage, setMainImage] = useState(null); // Main image file
  const [additionalImages, setAdditionalImages] = useState([]); // Secondary images array
  const [imageLoading, setImageLoading] = useState(false);
  const [additionalImageLoading, setAdditionalImageLoading] = useState(false);
  const [error, setError] = useState("");
  //  Image
  const url =
    "https://api.imgbb.com/1/upload?key=f1e08dc7c44c396aa409d50dfcc797da";
  // Handle main image file change
  const handleMainFileChange = (event) => {
    const image = event.target.files[0];
    console.log(image);
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      setImageLoading(true);
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((image) => {
          const photo = image?.data?.display_url;
          setMainImage(photo);
          setError("");
          setImageLoading(false);
        })
        .catch((error) => {
          setError("Error uploading the image. Please try again.");
          toast.error(error);

          setImageLoading(false); // Corrected from setLoading to setImageLoading
        });
    }
  };
  // Handle secondary image file change
  const handleAdditionalFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      // const newImages = [...additionalImages];
      // newImages[index] = URL.createObjectURL(file);
      // setAdditionalImages(newImages);
      const formData = new FormData();
      formData.append("image", file);
      setAdditionalImageLoading(true);
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          const photoUrl = data?.data?.display_url;
          const newImages = [...additionalImages];
          newImages[index] = photoUrl;
          setAdditionalImages(newImages);
          setError("");
        })
        .catch((error) => {
          setError("Error uploading the additional image. Please try again.");
          toast.error(error);
        })
        .finally(() => setAdditionalImageLoading(false));
    }
  };
  // Add a new input for another image
  const addImageInput = () => {
    setAdditionalImages([...additionalImages, null]);
  };

  // Remove image by index
  const handleRemoveImage = (index) => {
    if (index === -1) {
      setMainImage(null); // Remove main image
    } else {
      const newImages = [...additionalImages];
      newImages.splice(index, 1);
      setAdditionalImages(newImages); // Remove specific additional image
    }
  };
  const imageKeys = ["hoverImage", "thirdImage", "fourthImage"];
  const renamedImages = additionalImages.reduce((acc, url, index) => {
    acc[imageKeys[index]] = url;
    return acc;
  }, {});

  register("category", { required: "Category is required" });
  register("size", { required: "Please select at least one size" });
  register("gender", {
    required: "Please select a gender option to proceed.",
  });
  register("color", { required: "Please select at least one color choose" });

  // Form submit handler
  const onSubmit = (data) => {
    const name = data.name;

    const category = data.category;
    const size = data.size;
    const price = data.price;
    const gender = data.gender;
    const star = data.star;
    const Discount = data.Discount;
    const shortDescription = data.shortDescription;
    const formattedDescription = {
      Item_code: data.Item_code,
      Brand: data.Brand,
      Upper_Material: data.Upper_Material,
      Sole_Material: data.Sole_Material,
      product: data.product.split("\n"), // Convert product to array by splitting input on newline
    };
    const selling = 0;
    const mainData = {
      name,
      category,
      size,
      price,
      gender,
      star,
      Discount,
      shortDescription,
      formattedDescription,
      selling,
      mainImage,
      ...(renamedImages?.hoverImage && { hoverImage: renamedImages.hoverImage }),
      ...(renamedImages?.thirdImage && { thirdImage: renamedImages.thirdImage }),
      ...(renamedImages?.fourthImage && { fourthImage: renamedImages.fourthImage }),
    };
    console.log(mainData);
    axios.post(`${import.meta.env.VITE_LOCALHOST_KEY}/shoes`, mainData)
    .then(response => {
      if (response?.data?.insertedId) {
        // Show success message if insertedId exists in response
        toast.success("Your data has been successfully added!");
        navigate('../show-product')
      }
    })
    .catch(error => {
      // Show error message if something goes wrong
      if (error.response) {
        // Server responded with a status code other than 2xx
        toast.error(`Error: ${error.response?.data?.message || 'Something went wrong'}`);
      } else if (error.request) {
        // Request was made but no response was received
        toast.error("No response from server, please try again later.");
      } else {
        // Something else went wrong
        toast.error("An unexpected error occurred.");
      }
    });
  

  };

  return (
    <div className="px-5 pt-7 mx-auto ">
      <span className="flex items-center">
        <span className="h-px flex-1 bg-black"></span>
        <span className="shrink-0 px-3 uppercase font-semibold text-[#0284C7]">
          Review's
        </span>
        <span className="h-px flex-1 bg-black"></span>
      </span>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Product Name */}
        <div className="">
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

        {/* Category Size */}
        <div className="gap-7 flex">
          {/* Category Dropdown */}
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
              {isCategoryOpen ? (
                <FaChevronUp className="w-5 h-5 ml-2 transition-transform transform duration-200" />
              ) : (
                <FaChevronDown className="w-5 h-5 ml-2 transition-transform transform duration-200" />
              )}
            </div>

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
            {/* Display validation error if category is not selected */}
            {formError.category && (
              <span className="text-[#f50400] text-sm">
                {formError.category.message}
              </span>
            )}
          </div>

          {/* Size Dropdown with Multiple Selection */}
          <div className="relative z-10 space-y-2 inline-block text-left w-full">
            <label className="block text-xs font-medium text-gray-700">
              Select Size
            </label>
            <div
              onClick={toggleSizeDropdown}
              className="flex cursor-pointer border border-gray-300 items-center justify-between px-2 w-full py-1 rounded-md"
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
            </div>

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
            {formError.size && (
              <span className="text-[#f50400] text-sm">
                {formError.size.message}
              </span>
            )}
          </div>
        </div>
        {/* Price Gender */}
        <div className="gap-7 flex">
          {/* Product Price */}
          <div className="w-1/2">
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
          {/* Gender */}
          <div className="relative w-1/2 space-y-2 inline-block text-left ">
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
                <FaChevronUp className="w-5 h-5 ml-2 transition-transform transform duration-200" />
              ) : (
                <FaChevronDown className="w-5 h-5 ml-2 transition-transform transform duration-200" />
              )}
            </div>

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
            {formError.gender && (
              <span className="text-[#f50400] text-sm">
                {formError.gender.message}
              </span>
            )}
          </div>
        </div>
        {/* star Discount */}
        <div className="gap-7 flex">
          {/* Product Star */}
          <div className="w-1/2">
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
          {/* Product Discount */}
          <div className="w-1/2">
            <label
              htmlFor="discount"
              className="block text-xs font-medium text-gray-700"
            >
              {" "}
              Product Discount
            </label>

            <input
              type="number"
              id="discount"
              {...register("Discount", {
                required: "Please enter a product Discount",
              })}
              placeholder="Enter Your Product Discount"
              className="px-2 py-1 outline-none border border-gray-300 rounded w-full mt-2"
            />
            {formError.Discount && (
              <span className="text-[#f50400] text-sm">
                {formError.Discount.message}
              </span>
            )}
          </div>
        </div>
        {/* Color And avaible PRoduct */}
        <div className="gap-7 flex">
          {/* Color */}
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
            {formError.color && (
              <span className="text-[#f50400] text-sm">
                {formError.color.message}
              </span>
            )}
          </div>
          {/* Avaible */}
          <div className="w-1/2">
            <label
              htmlFor="stock"
              className="block text-xs font-medium text-gray-700"
            >
              {" "}
              Product Stock
            </label>

            <input
              type="number"
              id="stock"
              {...register("stock", {
                required: "Please Give me Product Stock",
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
        {/* Product Long Description */}

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
              placeholder="Item Code"
              {...register("Item_code", { required: "Item code is required" })}
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
              placeholder=" Sole Material"
              id="Sole_Material"
              {...register("Sole_Material", {
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
        <div className="relative">
          {/* Main Image */}
          <div>
            <p className="mb-2">Upload Main Image</p>
            <div className="flex justify-center items-center">
              <div className="bg-white rounded-lg w-full max-w-lg">
                <label className="flex flex-col items-center cursor-pointer">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainFileChange}
                  />
                  <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#dd0d5d] rounded-lg p-6 hover:border-[#f50963] transition">
                    {imageLoading ? (
                      <div className="text-center flex flex-col items-center justify-center text-gray-500">
                        <PropagateLoader />
                      </div>
                    ) : mainImage ? (
                      <div className="relative flex flex-col items-center justify-center">
                        <div className="border p-2 rounded-md">
                          <img
                            src={mainImage}
                            alt="Preview"
                            className="w-28 h-20 flex object-contain rounded-md"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveImage(-1)}
                          className="bg-white"
                        >
                          <RxCross2
                            className="absolute -top-2 right-12 border border-red-500 rounded-full"
                            color="red"
                          />
                        </button>
                        <p className="text-[12px] text-stone-700 pt-2">
                          (Only png* jpg* jpeg* webp/ will be accepted)
                        </p>
                      </div>
                    ) : (
                      <div className="text-center flex flex-col items-center justify-center text-gray-500">
                        <VscCloudUpload size={35} />
                        <span>Select a file or drag here</span>
                        <p className="text-[12px] text-stone-700">
                          (Only png* jpg* jpeg* webp/ will be accepted)
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Additional Images */}
          <div
            type="button"
            onClick={addImageInput}
            className="border mt-2 w-fit left-0 absolute text-sm text-white border-slate-200 hover:border-[#398EFA] rounded-md flex gap-1 justify-start bg-[#f50400] hover:bg-transparent hover:text-[#398EFA] px-3 py-1 cursor-pointer transition-all duration-300 ease-in-out"
          >
            Upload Other Product Images
          </div>

          <div className="grid grid-cols-4 gap-4 mt-12">
            {additionalImages.map((image, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center"
              >
                <label className="flex flex-col items-center cursor-pointer w-full">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAdditionalFileChange(e, index)}
                  />
                  <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#f50963] transition">
                    {additionalImageLoading ? (
                      <div className="text-center flex flex-col items-center justify-center text-gray-500">
                        <PropagateLoader />
                      </div>
                    ) : (
                      <>
                        {image ? (
                          <div className="relative flex flex-col items-center justify-center">
                            <div className="border p-2 rounded-md">
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="w-28 h-20 object-contain rounded-md"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="bg-white"
                            >
                              <RxCross2
                                className="absolute -top-2 -right-1 border border-red-500 rounded-full"
                                color="red"
                              />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center flex flex-col items-center justify-center text-gray-500">
                            <VscCloudUpload size={35} />
                            <span>Select a file or drag here</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="">
          <button className="border mt-12 w-full text-fuchsia-50 border-slate-200 hover:border-[#398EFA] rounded-md  gap-1  bg-[#f50400] hover:bg-transparent hover:text-[#398EFA] px-5 py-2 text-lg transition-all duration-300 ease-in-out">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
