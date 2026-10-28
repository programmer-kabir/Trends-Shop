import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { fetchCategories } from "../../Redux/Categories/categoriesSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPackage,
  FiTag,
  FiCheckCircle,
} from "react-icons/fi";

const ShowProduct = () => {
  const dispatch = useDispatch();
  const { Shoes = [], isLoading } = useSelector((state) => state.Shoes || {});
  const { Categories = [] } = useSelector((state) => state.Categories || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchShoes());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter & Search
  const filteredShoes = Shoes.filter((shoe) => {
    const matchesSearch =
      shoe?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoe?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoe?.Description?.Item_code?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = !selectedGender || shoe?.gender === selectedGender;
    const matchesCategory =
      !selectedCategory || shoe?.category === selectedCategory;

    return matchesSearch && matchesGender && matchesCategory;
  });

  // Sorting
  const sortedShoes = [...filteredShoes].sort((a, b) => {
    if (priceSort === "low") return (a.price || 0) - (b.price || 0);
    if (priceSort === "high") return (b.price || 0) - (a.price || 0);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedShoes.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedShoes.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (shoe) => {
    Swal.fire({
      title: "Delete Footwear?",
      text: `Are you sure you want to remove "${shoe.name}" from catalog?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `${import.meta.env.VITE_LOCALHOST_KEY}/shoe/${shoe._id}`
          );
          if (res.data.deletedCount === 1) {
            toast.success(`"${shoe.name}" deleted from store.`);
            dispatch(fetchShoes());
          } else {
            toast.error("Failed to delete shoe.");
          }
        } catch (error) {
          toast.error("Error deleting shoe.");
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6  mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <FiPackage className="w-3.5 h-3.5" />
              Catalog Inventory
            </span>
            <span className="text-xs text-slate-400">
              {Shoes.length} Handcrafted Articles
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Footwear Collection Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            View, filter, edit prices, and manage active shoes in your Trends Shop storefront.
          </p>
        </div>

        <Link
          to="/admin/create-product"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md shadow-amber-600/20 transition self-start md:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New Footwear</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            placeholder="Search footwear name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Gender */}
          <select
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="">All Genders</option>
            <option value="MEN'S">Men's</option>
            <option value="WOMEN'S">Women's</option>
            <option value="KID'S">Kid's</option>
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {Categories.length > 0 ? (
              Categories.map((cat) => (
                <optgroup key={cat._id || cat.name} label={`${cat.name} (${cat.department || "GENERAL"})`}>
                  {(cat.subcategories || []).map((subItem) => {
                    const subName =
                      typeof subItem === "object" && subItem !== null
                        ? subItem.name || subItem.title || ""
                        : String(subItem || "");
                    if (!subName) return null;
                    return (
                      <option key={subName} value={subName}>
                        {subName}
                      </option>
                    );
                  })}
                </optgroup>
              ))
            ) : (
              <>
                <option value="MAN'S FORMAL">Men's Formal</option>
                <option value="MAN'S CASUAL">Men's Casual</option>
                <option value="MAN'S SPORT">Men's Sport</option>
                <option value="WOMEN'S FORMAL">Women's Formal</option>
                <option value="WOMEN'S CASUAL">Women's Casual</option>
                <option value="WOMEN'S SPORT">Women's Sport</option>
                <option value="KID'S FORMAL">Kid's Formal</option>
                <option value="KID'S CASUAL">Kid's Casual</option>
                <option value="KID'S SPORT">Kid's Sport</option>
              </>
            )}
          </select>

          {/* Sort */}
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="">Sort by Price</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {currentItems.length === 0 ? (
          <div className="py-16 text-center">
            <FiPackage className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No matching footwear found
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Shoe Article</th>
                  <th className="py-3 px-4">Gender & Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Item Code</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {currentItems.map((shoe) => (
                  <tr
                    key={shoe._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Shoe Article */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={shoe.mainImage}
                          alt={shoe.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                        />
                        <div>
                          <Link
                            to={`/product-details/${shoe._id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-amber-600 transition line-clamp-1 max-w-[240px]"
                            title={shoe.name}
                          >
                            {shoe.name}
                          </Link>
                          <span className="text-[11px] text-slate-400">
                            ID: {shoe._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Gender & Category */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {shoe.gender}
                      </span>
                      <span className="text-[11px] text-slate-400 uppercase">
                        {shoe.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        ৳{Number(shoe.price || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Item Code */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {shoe.Description?.Item_code || `TR-${shoe._id.slice(-4).toUpperCase()}`}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <FiCheckCircle className="w-3 h-3" /> In Stock
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/product-details/${shoe._id}`}
                          title="View on Store"
                          className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`Edit-product/${shoe._id}`}
                          title="Edit Shoe"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(shoe)}
                          title="Delete Shoe"
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, sortedShoes.length)} of{" "}
              {sortedShoes.length} shoes
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                    currentPage === i + 1
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowProduct;
