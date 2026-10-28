import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Redux/Categories/categoriesSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FiPackage,
  FiArrowLeft,
  FiDollarSign,
  FiPercent,
  FiLayers,
  FiCheck,
  FiEye,
  FiUploadCloud,
  FiTag,
  FiCheckCircle,
} from "react-icons/fi";

const AddProduct = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedGender, setSelectedGender] = useState("MEN'S");
  const [selectedCategory, setSelectedCategory] = useState("MAN'S FORMAL");
  const [selectedSizes, setSelectedSizes] = useState(["40", "41", "42", "43", "44"]);
  const [selectedColor, setSelectedColor] = useState("Cognac Brown");

  // Images state
  const [mainImageUrl, setMainImageUrl] = useState(
    "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop"
  );
  const [hoverImageUrl, setHoverImageUrl] = useState(
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop"
  );
  const [thirdImageUrl, setThirdImageUrl] = useState("");
  const [fourthImageUrl, setFourthImageUrl] = useState("");

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors: formError },
  } = useForm({
    defaultValues: {
      name: "Artisan Wholecut Oxford Cognac",
      price: 3850,
      Discount: 0,
      stock: 20,
      star: 5,
      shortDescription:
        "Bespoke wholecut oxford sculpted from a single piece of full-grain Italian calfskin leather with Goodyear welted construction.",
      Item_code: `TR-ART-${Math.floor(1000 + Math.random() * 9000)}`,
      Brand: "Trends Luxury Atelier",
      Upper_Material: "Full-Grain Italian Calfskin Leather",
      Sole_Material: "Handcrafted Leather Outsole & Vibram Rubber Heel",
      productBullets:
        "Seamless wholecut silhouette sculpted from a single piece of leather\nHand-burnished cognac patina finished by master artisans\nCushioned memory-foam leather footbed for all-day comfort\nTraditional Goodyear welt construction for lifelong durability\nBreathable natural calfskin lining prevent perspiration",
    },
  });

  const watchName = watch("name");
  const watchPrice = watch("price");
  const watchDiscount = watch("Discount");

  // Presets for quick autofill
  const loadPreset = (type) => {
    if (type === "oxford") {
      setValue("name", "Artisan Cap-Toe Oxford Burnished Walnut");
      setValue("price", 3950);
      setValue("Discount", 10);
      setValue("stock", 25);
      setSelectedGender("MEN'S");
      setSelectedCategory("MAN'S FORMAL");
      setSelectedColor("Cognac Brown");
      setSelectedSizes(["40", "41", "42", "43", "44"]);
      setMainImageUrl("https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop");
      setHoverImageUrl("https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop");
      toast.success("Loaded Classic Executive Oxford preset");
    } else if (type === "chelsea") {
      setValue("name", "Artisan Chelsea Boot Waxed Camel Suede");
      setValue("price", 4200);
      setValue("Discount", 0);
      setValue("stock", 18);
      setSelectedGender("MEN'S");
      setSelectedCategory("MAN'S CASUAL");
      setSelectedColor("Tan");
      setSelectedSizes(["41", "42", "43", "44"]);
      setMainImageUrl("https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop");
      setHoverImageUrl("https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop");
      toast.success("Loaded Waxed Suede Chelsea Boot preset");
    } else if (type === "pump") {
      setValue("name", "Elegance Stiletto Leather Pump Crimson Red");
      setValue("price", 3400);
      setValue("Discount", 15);
      setValue("stock", 14);
      setSelectedGender("WOMEN'S");
      setSelectedCategory("WOMEN'S FORMAL");
      setSelectedColor("Burgundy");
      setSelectedSizes(["36", "37", "38", "39", "40"]);
      setMainImageUrl("https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop");
      setHoverImageUrl("https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop");
      toast.success("Loaded Women's Luxury Pump preset");
    }
  };

  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      } else {
        toast.error("Please keep at least one available size.");
      }
    } else {
      setSelectedSizes([...selectedSizes, size].sort());
    }
  };

  const allAvailableSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

  const colorsList = [
    { label: "Black", hex: "#18181b" },
    { label: "Cognac Brown", hex: "#78350f" },
    { label: "Espresso", hex: "#451a03" },
    { label: "Tan", hex: "#d97706" },
    { label: "Burgundy", hex: "#831843" },
    { label: "Navy Suede", hex: "#1e3a8a" },
    { label: "White", hex: "#f8fafc" },
    { label: "Honey", hex: "#b45309" },
  ];

  const categoriesByGender = {
    "MEN'S": [
      { id: "MAN'S FORMAL", label: "Men's Formal (Oxfords, Monk Straps, Derbies)" },
      { id: "MAN'S CASUAL", label: "Men's Casual (Loafers, Chelsea Boots, Moccasins)" },
      { id: "MAN'S SPORT", label: "Men's Sport (Minimalist Runners, Leather Trainers)" },
    ],
    "WOMEN'S": [
      { id: "WOMEN'S FORMAL", label: "Women's Formal (Court Pumps, Block Heels, Oxfords)" },
      { id: "WOMEN'S CASUAL", label: "Women's Casual (Penny Loafers, Mules, Suede Boots)" },
      { id: "WOMEN'S SPORT", label: "Women's Sport (Platform Trainers, Leather Runners)" },
    ],
    "KID'S": [
      { id: "KID'S FORMAL", label: "Kid's Formal (Junior Brogues & Lace-Up Oxfords)" },
      { id: "KID'S CASUAL", label: "Kid's Casual (Classic Slip-On Loafers & Ankle Boots)" },
      { id: "KID'S SPORT", label: "Kid's Sport (All-Terrain Active Trainers & Speed Runners)" },
    ],
  };

  const dispatch = useDispatch();
  const { Categories = [] } = useSelector((state) => state.Categories || {});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const activeSubcategories = useMemo(() => {
    if (Categories.length > 0) {
      const matchingCats = Categories.filter(
        (c) => (c.department || "").toUpperCase() === selectedGender.toUpperCase()
      );
      if (matchingCats.length > 0) {
        const list = [];
        matchingCats.forEach((cat) => {
          if (Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
            cat.subcategories.forEach((sub) => {
              const subName =
                typeof sub === "object" && sub !== null
                  ? sub.name || sub.title || ""
                  : String(sub || "");
              if (subName) {
                list.push({ id: subName, label: `${cat.name} → ${subName}` });
              }
            });
          } else {
            list.push({ id: cat.name, label: cat.name });
          }
        });
        if (list.length > 0) return list;
      }
    }
    return categoriesByGender[selectedGender] || [];
  }, [Categories, selectedGender]);

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
  };

  useEffect(() => {
    if (activeSubcategories.length > 0) {
      const exists = activeSubcategories.some((c) => c.id === selectedCategory);
      if (!exists) {
        setSelectedCategory(activeSubcategories[0].id);
      }
    }
  }, [activeSubcategories, selectedCategory]);

  // Submit
  const onSubmit = async (data) => {
    if (!mainImageUrl) {
      toast.error("Please provide at least a Main Showcase Image URL.");
      return;
    }

    setSubmitting(true);
    try {
      const bulletPoints = (data.productBullets || "")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const mainData = {
        name: data.name.trim(),
        category: selectedCategory,
        size: selectedSizes,
        price: Number(data.price),
        gender: selectedGender,
        star: Number(data.star) || 5,
        Discount: Number(data.Discount) || 0,
        stock: Number(data.stock) || 15,
        shortDescription: data.shortDescription,
        Description: {
          Item_code: data.Item_code || `TR-${Date.now().toString().slice(-5)}`,
          Brand: data.Brand || "Trends Luxury Atelier",
          Upper_Material: data.Upper_Material || "Full-Grain Italian Calfskin Leather",
          Sole_Material: data.Sole_Material || "Handcrafted Leather Outsole",
          Color: selectedColor,
          product: bulletPoints.length > 0 ? bulletPoints : ["Handcrafted with bespoke artisanal precision"],
        },
        selling: 0,
        mainImage: mainImageUrl,
        ...(hoverImageUrl && { hoverImage: hoverImageUrl }),
        ...(thirdImageUrl && { thirdImage: thirdImageUrl }),
        ...(fourthImageUrl && { fourthImage: fourthImageUrl }),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/shoes`,
        mainData
      );

      if (res?.data?.insertedId) {
        toast.success(`"${mainData.name}" published to catalog!`);
        navigate("/admin/show-product");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to publish footwear.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6  mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin/show-product"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-amber-600 transition"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              Back to Catalog
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <FiPackage className="w-3.5 h-3.5" />
              Artisan Footwear Creator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Add New Footwear Article
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure handcrafted specifications, sizes, leather materials, and visual photography.
          </p>
        </div>

        {/* Quick Fill Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Quick Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset("oxford")}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition"
          >
            Classic Brogue
          </button>
          <button
            type="button"
            onClick={() => loadPreset("chelsea")}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition"
          >
            Chelsea Boot
          </button>
          <button
            type="button"
            onClick={() => loadPreset("pump")}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition"
          >
            Stiletto Pump
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left (2/3), Preview and Images on Right (1/3) */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Article Identity */}
          <div className="bg-white dark:bg-[#111622] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                1. Footwear Identity & Story
              </h3>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Footwear Article Name *
              </label>
              <input
                type="text"
                {...register("name", { required: "Footwear name is required" })}
                placeholder="e.g. Artisan Oxford Brogue Cognac"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {formError.name && (
                <span className="text-rose-500 text-xs mt-1 block">
                  {formError.name.message}
                </span>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Luxury Overview / Short Tagline *
              </label>
              <textarea
                rows="2"
                {...register("shortDescription", {
                  required: "Overview description is required",
                })}
                placeholder="1-2 sentences highlighting the leather heritage, stitching, and silhouette..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          {/* Card 2: Department, Category, Sizes & Colors */}
          <div className="bg-white dark:bg-[#111622] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                2. Classification, Sizing & Palette
              </h3>
            </div>

            {/* Gender / Department Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Target Department / Gender *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["MEN'S", "WOMEN'S", "KID'S"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => handleGenderChange(gender)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      selectedGender === gender
                        ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span>{gender}</span>
                    {selectedGender === gender && <FiCheck className="w-3.5 h-3.5 text-amber-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategory */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sub-Category Line *
                </label>
                <Link
                  to="/admin/categories"
                  className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <FiLayers className="w-3 h-3" />
                  <span>Manage Categories & Sub →</span>
                </Link>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
              >
                {activeSubcategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Primary Color Palette */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Primary Color Finish: <span className="text-amber-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((col) => {
                  const isSelected = selectedColor === col.label;
                  return (
                    <button
                      key={col.label}
                      type="button"
                      onClick={() => setSelectedColor(col.label)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 shadow-inner"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes Multi-Select */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Available EU Sizes ({selectedSizes.length} selected) *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSizes(
                      selectedSizes.length === allAvailableSizes.length
                        ? ["40", "41", "42"]
                        : [...allAvailableSizes]
                    )
                  }
                  className="text-[11px] font-semibold text-amber-600 hover:underline"
                >
                  {selectedSizes.length === allAvailableSizes.length
                    ? "Reset Default"
                    : "Select All (36-45)"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allAvailableSizes.map((sz) => {
                  const isActive = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSizeToggle(sz)}
                      className={`w-11 h-10 rounded-xl text-xs font-bold transition flex items-center justify-center border ${
                        isActive
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 3: Pricing & Inventory */}
          <div className="bg-white dark:bg-[#111622] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                3. Commercial Pricing & Inventory
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Retail Price (৳ BDT) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="50"
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 500, message: "Min price ৳500" },
                    })}
                    placeholder="3450"
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                    ৳
                  </span>
                </div>
                {formError.price && (
                  <span className="text-rose-500 text-xs mt-1 block">
                    {formError.price.message}
                  </span>
                )}
              </div>

              {/* Discount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    {...register("Discount")}
                    placeholder="0"
                    className="w-full pl-3.5 pr-8 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <FiPercent className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Stock (Pairs) *
                </label>
                <input
                  type="number"
                  min="1"
                  {...register("stock", { required: true })}
                  placeholder="20"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Artisan Specifications */}
          <div className="bg-white dark:bg-[#111622] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                4. Luxury Specifications & Craftsmanship
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SKU / Item Code *
                </label>
                <input
                  type="text"
                  {...register("Item_code")}
                  placeholder="TR-ART-01"
                  className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brand / Line *
                </label>
                <input
                  type="text"
                  {...register("Brand")}
                  placeholder="Trends Luxury Atelier"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upper Material
                </label>
                <input
                  type="text"
                  {...register("Upper_Material")}
                  placeholder="Full-Grain Italian Calfskin Leather"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Outsole Material
                </label>
                <input
                  type="text"
                  {...register("Sole_Material")}
                  placeholder="Handcrafted Leather & Vibram Rubber"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Bullet points */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Artisanal Features & Highlights (1 feature per line)
              </label>
              <textarea
                rows="4"
                {...register("productBullets")}
                placeholder="Goodyear welted sole for lifelong recraftability&#10;Hand-burnished toe patina&#10;Breathable natural calfskin lining"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Assets & Live Card Preview */}
        <div className="space-y-6">
          {/* Visual Photography URLs */}
          <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Photography & Angles
              </h3>
            </div>

            {/* Main Showcase */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Main Showcase Image URL *
              </label>
              <input
                type="url"
                value={mainImageUrl}
                onChange={(e) => setMainImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Hover Image */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hover Transition Angle URL
              </label>
              <input
                type="url"
                value={hoverImageUrl}
                onChange={(e) => setHoverImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Side / Detail Image */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Side / Profile Angle URL (Optional)
              </label>
              <input
                type="url"
                value={thirdImageUrl}
                onChange={(e) => setThirdImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Insole / Sole Image */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Outsole / Packaging URL (Optional)
              </label>
              <input
                type="url"
                value={fourthImageUrl}
                onChange={(e) => setFourthImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Live Storefront Card Preview */}
          <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FiEye className="w-3.5 h-3.5 text-amber-500" /> Live Storefront Preview
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                Active Card
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-3 relative">
                {mainImageUrl ? (
                  <img
                    src={mainImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <FiPackage className="w-12 h-12" />
                  </div>
                )}
                {watchDiscount > 0 && (
                  <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {watchDiscount}% OFF
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                  {selectedCategory}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 mt-0.5">
                  {watchName || "Footwear Article Title"}
                </h4>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      ৳
                      {watchDiscount > 0
                        ? Math.round(
                            Number(watchPrice || 0) * (1 - Number(watchDiscount) / 100)
                          ).toLocaleString()
                        : Number(watchPrice || 0).toLocaleString()}
                    </span>
                    {watchDiscount > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        ৳{Number(watchPrice || 0).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {selectedSizes.length} Sizes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="sticky bottom-4 z-20 bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Footwear...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Publish Footwear Article</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
            >
              Reset All Fields
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
