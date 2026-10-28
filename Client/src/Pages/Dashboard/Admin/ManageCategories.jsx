import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories as fetchReduxCategories } from "../../Redux/Categories/categoriesSlice";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiLayers,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiX,
  FiCheck,
  FiSearch,
  FiTag,
  FiImage,
  FiCheckCircle,
  FiAlertCircle,
  FiFolder,
  FiRefreshCw,
  FiGrid,
  FiPackage,
} from "react-icons/fi";

const API_BASE = import.meta.env.VITE_LOCALHOST_KEY || "http://localhost:5000";

const getSubName = (sub) => {
  if (!sub) return "";
  if (typeof sub === "string") return sub;
  if (typeof sub === "object") return sub.name || sub.title || sub.label || "";
  return String(sub);
};

const PRESET_IMAGES = [
  {
    label: "Men's Luxury",
    url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
  },
  {
    label: "Women's Heels",
    url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
  },
  {
    label: "Kid's Sneakers",
    url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop",
  },
  {
    label: "Athletic & Running",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
  },
  {
    label: "Leather Boots",
    url: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
  },
];

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    department: "MEN'S",
    image: "",
    description: "",
    subcategoriesText: "",
  });

  // Inline subcategory inputs per category card
  const [inlineSubInputs, setInlineSubInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { Shoes = [] } = useSelector((state) => state.Shoes || {});

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/categories`);
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      }
      dispatch(fetchReduxCategories());
    } catch (err) {
      console.error("Failed to load categories:", err);
      Swal.fire({
        icon: "error",
        title: "Connection Failed",
        text: "Could not fetch categories from the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    dispatch(fetchShoes());
  }, []);

  // Product Count per Subcategory
  const getSubcategoryProductCount = (subName) => {
    if (!Shoes || !Array.isArray(Shoes)) return 0;
    const clean = (subName || "").trim().toUpperCase();
    return Shoes.filter(
      (s) => (s?.category || "").trim().toUpperCase() === clean
    ).length;
  };

  // Product Count per Category
  const getCategoryProductCount = (cat) => {
    if (!Shoes || !Array.isArray(Shoes)) return 0;
    const subs = (cat?.subcategories || []).map((s) => getSubName(s).trim().toUpperCase());
    const catName = (cat?.name || "").trim().toUpperCase();
    const dept = (cat?.department || cat?.gender || "").trim().toUpperCase();

    return Shoes.filter((s) => {
      const sCat = (s?.category || "").trim().toUpperCase();
      const sGender = (s?.gender || "").trim().toUpperCase();

      if (sCat && subs.includes(sCat)) return true;
      if (sCat && sCat === catName) return true;
      if (dept && sGender === dept) return true;
      return false;
    }).length;
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setActiveCategoryId(null);
    setFormData({
      name: "",
      department: "MEN'S",
      image: PRESET_IMAGES[0].url,
      description: "",
      subcategoriesText: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (cat) => {
    setIsEditing(true);
    setActiveCategoryId(cat._id);
    setFormData({
      name: cat.name || "",
      department: cat.department || "MEN'S",
      image: cat.image || "",
      description: cat.description || "",
      subcategoriesText: Array.isArray(cat.subcategories)
        ? cat.subcategories.map(getSubName).filter(Boolean).join(", ")
        : "",
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire("Required", "Please enter a category name.", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      const subcategories = formData.subcategoriesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        department: formData.department,
        image: formData.image.trim() || PRESET_IMAGES[0].url,
        description: formData.description.trim(),
        subcategories,
      };

      if (isEditing && activeCategoryId) {
        await axios.patch(`${API_BASE}/categories/${activeCategoryId}`, payload);
        Swal.fire({
          icon: "success",
          title: "Category Updated",
          text: `"${payload.name}" updated successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axios.post(`${API_BASE}/categories`, payload);
        Swal.fire({
          icon: "success",
          title: "Category Created",
          text: `"${payload.name}" created with ${subcategories.length} subcategories.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Save category error:", err);
      Swal.fire("Error", "Could not save category. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = (cat) => {
    Swal.fire({
      title: "Delete Category?",
      text: `Are you sure you want to permanently delete "${cat.name}" and its ${(cat.subcategories || []).length} subcategories?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete It",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE}/categories/${cat._id}`);
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Category removed successfully.",
            timer: 1800,
            showConfirmButton: false,
          });
          fetchCategories();
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Failed to delete category.", "error");
        }
      }
    });
  };

  // Add Inline Subcategory
  const handleAddInlineSubcategory = async (catId) => {
    const subName = (inlineSubInputs[catId] || "").trim();
    if (!subName) return;

    try {
      await axios.post(`${API_BASE}/categories/${catId}/subcategory`, {
        subcategory: subName,
      });

      // Clear input
      setInlineSubInputs((prev) => ({ ...prev, [catId]: "" }));

      // Optimistic update
      setCategories((prev) =>
        prev.map((c) => {
          if (c._id === catId) {
            const currentSubs = Array.isArray(c.subcategories) ? c.subcategories : [];
            if (!currentSubs.includes(subName)) {
              return { ...c, subcategories: [...currentSubs, subName] };
            }
          }
          return c;
        })
      );
      dispatch(fetchReduxCategories());
    } catch (err) {
      console.error("Add subcategory error:", err);
      Swal.fire("Error", "Failed to add subcategory.", "error");
    }
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (catId, subName) => {
    try {
      await axios.delete(
        `${API_BASE}/categories/${catId}/subcategory/${encodeURIComponent(subName)}`
      );

      // Optimistic update
      setCategories((prev) =>
        prev.map((c) => {
          if (c._id === catId) {
            return {
              ...c,
              subcategories: (c.subcategories || []).filter((s) => s !== subName),
            };
          }
          return c;
        })
      );
      dispatch(fetchReduxCategories());
    } catch (err) {
      console.error("Delete subcategory error:", err);
      Swal.fire("Error", "Failed to remove subcategory.", "error");
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter((cat) => {
    const matchesDept =
      selectedDept === "ALL" ||
      (cat.department || "").toUpperCase() === selectedDept.toUpperCase();

    const matchesSearch =
      (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.subcategories || []).some((s) =>
        getSubName(s).toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesDept && matchesSearch;
  });

  // Statistics
  const totalSubcategories = categories.reduce(
    (sum, c) => sum + (c.subcategories?.length || 0),
    0
  );

  return (
    <div className="w-full min-h-screen pb-16 pt-2 px-3 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100">
      {/* Header & Stat Cards */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <FiLayers className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Category & Subcategory Studio
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage footwear taxonomy, departments, banner visuals, and nested collections.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/40 bg-white dark:bg-slate-900 transition shadow-sm"
              title="Refresh Categories"
            >
              <FiRefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <FiPlus className="w-5 h-5 stroke-[2.5]" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Categories
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {categories.length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Subcategories
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
              {totalSubcategories}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Catalog Products
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {Shoes?.length || 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Departments Active
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
              {new Set(categories.map((c) => c.department || "MEN'S")).size}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search category, subcategory, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition shadow-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {["ALL", "MEN'S", "WOMEN'S", "KID'S", "UNISEX"].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedDept === dept
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FiRefreshCw className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Fetching categories from database...
          </p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white/50 dark:bg-slate-900/40">
          <FiFolder className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Categories Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? `No category or subcategory matches "${searchTerm}".`
              : "No categories created yet in this department."}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const subs = Array.isArray(category.subcategories)
              ? category.subcategories
              : [];
            const inlineValue = inlineSubInputs[category._id] || "";

            return (
              <div
                key={category._id}
                className="group flex flex-col rounded-2xl bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-all duration-200 overflow-hidden"
              >
                {/* Category Banner Image & Actions */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={
                      category.image ||
                      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                        {category.department || "MEN'S"}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-500 text-slate-950 backdrop-blur-md shadow-sm flex items-center gap-1.5">
                        <FiPackage className="w-3.5 h-3.5" />
                        <span>{getCategoryProductCount(category)} Products</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10">
                      <button
                        onClick={() => handleOpenEditModal(category)}
                        className="p-1.5 rounded-md text-slate-300 hover:text-amber-400 hover:bg-white/10 transition"
                        title="Edit Category"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="p-1.5 rounded-md text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition"
                        title="Delete Category"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-lg sm:text-xl font-black text-white drop-shadow-sm tracking-tight leading-tight">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 font-medium">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subcategories Management Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FiTag className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Subcategories ({subs.length}) • {getCategoryProductCount(category)} Items
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Click <span className="text-rose-500">×</span> to remove
                      </span>
                    </div>

                    {/* Subcategory Pills */}
                    <div className="flex flex-wrap gap-1.5 min-h-[50px] mb-4">
                      {subs.length === 0 ? (
                        <p className="text-xs italic text-slate-400 dark:text-slate-500 py-2">
                          No subcategories added yet. Use the quick box below.
                        </p>
                      ) : (
                        subs.map((subItem, idx) => {
                          const subName = getSubName(subItem);
                          if (!subName) return null;
                          const subProductCount = getSubcategoryProductCount(subName);
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-500/40 transition group/tag"
                            >
                              <span>{subName}</span>
                              <span
                                className="px-1.5 py-0.2 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                                title={`${subProductCount} products in this subcategory`}
                              >
                                {subProductCount}
                              </span>
                              <button
                                onClick={() => handleDeleteSubcategory(category._id, subName)}
                                className="w-3.5 h-3.5 rounded flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                                title={`Remove "${subName}"`}
                              >
                                <FiX className="w-3 h-3 stroke-[2.5]" />
                              </button>
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Inline Quick Add Subcategory */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddInlineSubcategory(category._id);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={inlineValue}
                        onChange={(e) =>
                          setInlineSubInputs((prev) => ({
                            ...prev,
                            [category._id]: e.target.value,
                          }))
                        }
                        placeholder="Add subcategory (e.g. LOAFERS)..."
                        className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition"
                      />
                      <button
                        type="submit"
                        disabled={!inlineValue.trim()}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                        title="Add Subcategory"
                      >
                        <FiPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <FiLayers className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isEditing ? "Edit Category Details" : "Create New Footwear Category"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Men's Collection, Winter Boots, Luxury Formals"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Department
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["MEN'S", "WOMEN'S", "KID'S", "UNISEX"].map((dept) => (
                    <button
                      type="button"
                      key={dept}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, department: dept }))
                      }
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                        formData.department === dept
                          ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Banner Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, image: e.target.value }))
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                    />
                  )}
                </div>

                {/* Preset Fast Selection */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Quick Presets:
                  </span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: preset.url }))
                      }
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Tagline / Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="e.g. Mastercrafted Italian leathers, oxfords, and luxury formals."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {/* Subcategories (comma-separated for bulk edit) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Subcategories (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.subcategoriesText}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subcategoriesText: e.target.value,
                    }))
                  }
                  placeholder="e.g. MAN'S FORMAL, MAN'S CASUAL, MAN'S SPORT, LOAFERS"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Separate each subcategory with a comma. You can also add more later directly from the category card.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>{isEditing ? "Save Changes" : "Create Category"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
