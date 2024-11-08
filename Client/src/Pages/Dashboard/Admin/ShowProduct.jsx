import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { FiEdit } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import Dropdown from "./DropDown";
import EmptyCard from "../../../Components/Design/Empty/Empty";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ShowProduct = () => {
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedPriceSort, setSelectedPriceSort] = useState("");
  const dispatch = useDispatch();
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchShoes());
  }, [dispatch,Shoes]);

  // Apply filters based on selected values
  const filteredShoes = Shoes.filter((shoe) => {
    const genderMatch = !selectedGender || shoe.gender === selectedGender;
    const categoryMatch =
      !selectedSubCategory || shoe.category === selectedSubCategory;
    return genderMatch && categoryMatch;
  });

  // Apply sorting by price if a sort option is selected
  const sortedShoes = [...filteredShoes].sort((a, b) => {
    if (selectedPriceSort === "Low to High") return a.price - b.price;
    if (selectedPriceSort === "High to Low") return b.price - a.price;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedShoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedShoes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleDelete = (id) => {
    console.log(id); // Check that id is being passed correctly
    axios
      .delete(`${import.meta.env.VITE_LOCALHOST_KEY}/shoe/${id}`) // Make sure the URL format is correct
      .then((response) => {
        console.log(response.data);
        if(response.data.deletedCount===1){

          toast.success("Your Shoe is delete"); // Success response from the server
        }else{
          toast.error("Error deleting shoe");
        }
        
      })
      .catch((error) => {
        toast.error("Error deleting shoe:"); // Log any errors
      });
  };

  return (
    <section
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
      }}
      className="mx-5 pb-5 px-5 rounded-md py-7 my-4 bg-white "
    >
      <span className="flex items-center">
        <span className="h-px flex-1 bg-black"></span>
        <span className="shrink-0 px-3 uppercase font-semibold text-[#0284C7]">
          Show Product
        </span>
        <span className="h-px flex-1 bg-black"></span>
      </span>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Gender Dropdown */}
        <Dropdown
          mainTitle="Filter by Category"
          title="Select Gender"
          options={["MEN'S", "WOMEN'S", "KID'S"]}
          onSelect={(value) => setSelectedGender(value)}
        />

        {/* Filter by subCategory Dropdown */}
        <Dropdown
          mainTitle="Filter by SubCategory"
          title="Select SubCategory"
          options={[
            "MAN'S CASUAL",
            "MAN'S FORMAL",
            "MAN'S SPORT",
            "WOMEN'S CASUAL",
            "WOMEN'S FORMAL",
            "WOMEN'S SPORT",
            "KID'S CASUAL",
            "KID'S FORMAL",
            "KID'S FORMAL",
          ]}
          onSelect={(value) => setSelectedSubCategory(value)}
        />

        {/* Sort By Price Dropdown */}
        <Dropdown
          mainTitle="Sort By Price"
          title="Sort By Price"
          options={["Low to High", "High to Low"]}
          onSelect={(value) => setSelectedPriceSort(value)}
        />
      </div>

      {/* Table */}
      {/* Table */}
      <div className="pt-5 overflow-x-auto w-full">
        {" "}
        {/* Ensure the outer container is scrollable */}
        {currentItems.length === 0 ? (
          <div className="flex py-5 mx-auto items-center justify-center">
            <EmptyCard />
          </div>
        ) : (
          <table className="w-full min-w-[500px] md:min-w-[1000px] border">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 border-r text-sm font-medium text-start py-5">
                  Image
                </th>
                <th className="px-4 border-r text-sm font-medium text-start py-5">
                  Product Name
                </th>
                <th className="px-4 border-r text-sm font-medium text-start py-5">
                  Gender
                </th>
                <th className="px-4 border-r text-sm font-medium text-start py-5">
                  Price
                </th>
                <th className="px-4 border-r text-sm font-medium text-start py-5">
                  Category
                </th>
                <th className="px-4 border-r text-sm font-medium text-start py-5">
                  Product Code
                </th>
                <th className="px-4 border-r text-sm font-medium text-start py-5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((shoe, index) => (
                <tr
                  key={index}
                  className="text-start border-b text-sm text-gray-800"
                >
                  <td className="p-2 border-r">
                    <img
                      src={shoe.mainImage}
                      className="w-[50px] h-auto"
                      alt={shoe.name}
                    />
                  </td>
                  <td className="p-2 border-r">{shoe.name}</td>
                  <td className="p-2 border-r">{shoe.gender}</td>
                  <td className="p-2 border-r">{shoe.price}</td>
                  <td className="p-2 border-r">{shoe.category}</td>
                  <td className="p-2 border-r">
                    {shoe.Description?.Item_code}
                  </td>
                  <td className="p-2 border-r flex items-center gap-2">
                    <Link
                      to={`Edit-product/${shoe._id}`}
                      className="border p-1.5 border-gray-500 rounded cursor-pointer"
                    >
                      <FiEdit size={16} />
                    </Link>
                    <div
                      onClick={() => handleDelete(shoe._id)}
                      className="border p-1.5 border-gray-500 rounded cursor-pointer"
                    >
                      <FaPlus className="rotate-45" size={16} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ShowProduct;
