import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../Redux/Shoes/shoesSlice";
import { fetchCategories } from "../Redux/Categories/categoriesSlice";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import LuxuryProductCard from "../../Components/Design/LuxuryProductCard";
import Content from "../../Components/Content/Content";
import LoadingSpinner from "../../Components/Design/LoadingSpinner/LoadingSpinner";
import { 
  FiFilter, 
  FiX, 
  FiCheck, 
  FiSliders, 
  FiSearch, 
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiRotateCcw,
  FiTag
} from "react-icons/fi";
import { GiLeatherBoot, GiConverseShoe } from "react-icons/gi";
import { Empty } from "antd";

const sizeRanges = {
  ALL: [26, 28, 30, 32, 34, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  "MEN'S": [39, 40, 41, 42, 43, 44, 45],
  "WOMEN'S": [36, 37, 38, 39, 40, 41],
  "KID'S": [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
};

const availableSizes = sizeRanges.ALL;

const shoeStylesList = [
  { label: "All Styles", value: "ALL" },
  { label: "Oxfords & Brogues", value: "oxford" },
  { label: "Loafers & Moccasins", value: "loafer" },
  { label: "Monk Straps & Boots", value: "monk_boot" },
  { label: "Sneakers & Trainers", value: "sneaker" },
  { label: "Pumps & High Heels", value: "pump" },
];

const pricePresets = [
  { label: "All Prices", min: 0, max: 999999 },
  { label: "Under ৳3,000", min: 0, max: 3000 },
  { label: "৳3,000 - ৳5,000", min: 3000, max: 5000 },
  { label: "৳5,000 - ৳8,000", min: 5000, max: 8000 },
  { label: "Above ৳8,000", min: 8000, max: 999999 },
];

const departmentTabs = [
  { label: "All Shoes", value: "ALL", icon: "👞" },
  { label: "Men's Footwear", value: "MEN'S", icon: "👞" },
  { label: "Women's Footwear", value: "WOMEN'S", icon: "👠" },
  { label: "Kid's Footwear", value: "KID'S", icon: "👟" },
];

const categoryHierarchy = {
  "MEN'S": [
    { label: "All Men's Shoes", value: "MEN'S" },
    { label: "Formal (Oxford & Derby)", value: "MAN'S FORMAL" },
    { label: "Casual Loafers & Slip-ons", value: "MAN'S CASUAL" },
    { label: "Sport & Athletic Sneakers", value: "MAN'S SPORT" },
  ],
  "WOMEN'S": [
    { label: "All Women's Shoes", value: "WOMEN'S" },
    { label: "Formal Heels & Pumps", value: "WOMEN'S FORMAL" },
    { label: "Casual Loafers & Flats", value: "WOMEN'S CASUAL" },
    { label: "Sport & Running Shoes", value: "WOMEN'S SPORT" },
  ],
  "KID'S": [
    { label: "All Kid's Shoes", value: "KID'S" },
    { label: "School & Formal Shoes", value: "KID'S FORMAL" },
    { label: "Casual Slip-ons & Loafers", value: "KID'S CASUAL" },
    { label: "Active Runners & Trainers", value: "KID'S SPORT" },
  ],
};
const mainCategoryList = [
  {
    id: "MEN'S",
    title: "Men's Collection",
    gender: "MEN'S",
    icon: "👞",
    subcategories: [
      { label: "Formal (Oxford & Derby)", value: "MAN'S FORMAL" },
      { label: "Casual Loafers & Slip-ons", value: "MAN'S CASUAL" },
      { label: "Sport & Athletic Sneakers", value: "MAN'S SPORT" },
    ],
  },
  {
    id: "WOMEN'S",
    title: "Women's Collection",
    gender: "WOMEN'S",
    icon: "👠",
    subcategories: [
      { label: "Formal Heels & Pumps", value: "WOMEN'S FORMAL" },
      { label: "Casual Loafers & Flats", value: "WOMEN'S CASUAL" },
      { label: "Sport & Running Shoes", value: "WOMEN'S SPORT" },
    ],
  },
  {
    id: "KID'S",
    title: "Kid's Collection",
    gender: "KID'S",
    icon: "👟",
    subcategories: [
      { label: "School & Formal Shoes", value: "KID'S FORMAL" },
      { label: "Casual Slip-ons & Loafers", value: "KID'S CASUAL" },
      { label: "Active Runners & Trainers", value: "KID'S SPORT" },
    ],
  },
];

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, Shoes, error } = useSelector((state) => state?.Shoes);

  const { Name } = useParams();
  const routeCategory = Name ? Name.replace(/-/g, " ") : "ALL";

  // Helper to determine parent department
  const getDeptFromCategory = (cat) => {
    if (!cat || cat === "ALL") return null;
    const upper = cat.toUpperCase();
    if (upper.includes("WOMEN")) return "WOMEN'S";
    if (upper.includes("KID")) return "KID'S";
    if (upper.includes("MAN") || upper.includes("MEN")) return "MEN'S";
    return null;
  };

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(routeCategory || "ALL");
  const [openCategoryAccordion, setOpenCategoryAccordion] = useState(
    getDeptFromCategory(routeCategory) || "MEN'S"
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("ALL");
  const [selectedPricePreset, setSelectedPricePreset] = useState(0);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Accordion open/close states for compact sidebar
  const [openSections, setOpenSections] = useState({
    category: true,
    size: true,
    price: true,
    style: false,
    offers: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { Categories = [] } = useSelector((state) => state.Categories || {});

  useEffect(() => {
    dispatch(fetchShoes());
    dispatch(fetchCategories());
  }, [dispatch]);

  const displayCategoryList = useMemo(() => {
    if (!Categories || Categories.length === 0) return mainCategoryList;
    return Categories.map((c) => {
      const deptUpper = (c.department || c.gender || "").toUpperCase();
      const normalizedGender = deptUpper.includes("WOMEN")
        ? "WOMEN'S"
        : deptUpper.includes("KID")
        ? "KID'S"
        : "MEN'S";

      return {
        id: normalizedGender,
        rawId: c._id || c.name,
        title: c.name,
        gender: normalizedGender,
        icon: normalizedGender === "WOMEN'S"
          ? "👠"
          : normalizedGender === "KID'S"
          ? "👟"
          : "👞",
        subcategories: (c.subcategories || []).map((sub) => {
          const subName =
            typeof sub === "object" && sub !== null
              ? sub.name || sub.title || ""
              : String(sub || "");
          return {
            label: subName,
            value: subName,
          };
        }),
      };
    });
  }, [Categories]);

  // Sync route param with state
  useEffect(() => {
    if (Name) {
      setSelectedCategory(Name.replace(/-/g, " "));
    } else {
      setSelectedCategory("ALL");
    }
  }, [Name]);

  // Sync search query from URL
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Count items per category dynamically
  const getCategoryCount = (catValue) => {
    if (!Shoes || !Array.isArray(Shoes)) return 0;
    if (catValue === "ALL") return Shoes.length;
    if (["MEN'S", "WOMEN'S", "KID'S"].includes(catValue)) {
      return Shoes.filter((s) => s.gender === catValue).length;
    }
    return Shoes.filter((s) => s.category === catValue).length;
  };

  // Determine active department based on selectedCategory
  const activeDepartment = useMemo(() => {
    if (selectedCategory.includes("MAN'S") || selectedCategory === "MEN'S") return "MEN'S";
    if (selectedCategory.includes("WOMEN'S")) return "WOMEN'S";
    if (selectedCategory.includes("KID'S")) return "KID'S";
    return "ALL";
  }, [selectedCategory]);

  // Dynamic available shoe sizes based on active department
  const currentAvailableSizes = useMemo(() => {
    if (selectedCategory.includes("KID'S") || selectedCategory === "KID'S") {
      return sizeRanges["KID'S"];
    }
    if (selectedCategory.includes("WOMEN'S") || selectedCategory === "WOMEN'S") {
      return sizeRanges["WOMEN'S"];
    }
    if (selectedCategory.includes("MAN'S") || selectedCategory === "MEN'S") {
      return sizeRanges["MEN'S"];
    }
    return sizeRanges.ALL;
  }, [selectedCategory]);

  // Sync accordion with selected category so matching collection stays open
  useEffect(() => {
    const parentDept = getDeptFromCategory(selectedCategory);
    if (parentDept) {
      setOpenCategoryAccordion(parentDept);
    }
  }, [selectedCategory]);

  // Handle main category accordion header click (closes previous main category, opens this one)
  const toggleCategoryAccordion = (genderVal) => {
    setOpenCategoryAccordion(genderVal);
    handleCategorySelect(genderVal);
  };

  // Handle subcategory click (guarantees parent accordion STAYS open)
  const handleSubcategoryClick = (subValue, parentGender) => {
    setOpenCategoryAccordion(parentGender);
    handleCategorySelect(subValue);
  };

  // Handle Category select
  const handleCategorySelect = (val) => {
    setSelectedCategory(val);
    setShowMobileFilter(false);
    if (val === "ALL") {
      navigate("/products/ALL");
    } else {
      navigate(`/products/${val.replace(/ /g, "-")}`);
    }
  };

  // Handle Department Tab click
  const handleDepartmentTab = (deptVal) => {
    handleCategorySelect(deptVal);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedSize(null);
    setSelectedStyle("ALL");
    setSelectedPricePreset(0);
    setOnlyDiscounted(false);
    setOnlyInStock(false);
    setSortBy("featured");
    setSearchQuery("");
    setSearchParams({});
    navigate("/products/ALL");
  };

  // Filter & Sort Logic
  const filteredShoes = useMemo(() => {
    if (!Shoes || !Array.isArray(Shoes)) return [];

    let list = [...Shoes];

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((s) => {
        const nameMatch = (s.name || "").toLowerCase().includes(q);
        const catMatch = (s.category || "").toLowerCase().includes(q);
        const descMatch = (s.shortDescription || "").toLowerCase().includes(q);
        const brandMatch = (s.Brand || "").toLowerCase().includes(q);
        return nameMatch || catMatch || descMatch || brandMatch;
      });
    }

    // 2. Category / Gender filter
    if (selectedCategory && selectedCategory !== "ALL") {
      if (["MEN'S", "WOMEN'S", "KID'S"].includes(selectedCategory)) {
        list = list.filter((s) => s.gender === selectedCategory);
      } else {
        list = list.filter((s) => s.category === selectedCategory);
      }
    }

    // 3. Size filter
    if (selectedSize) {
      list = list.filter((s) => {
        if (!s.size) return false;
        if (Array.isArray(s.size)) {
          return s.size.includes(selectedSize) || s.size.includes(Number(selectedSize));
        }
        return Number(s.size) === Number(selectedSize);
      });
    }

    // 4. Shoe Style / Silhouette keyword search
    if (selectedStyle && selectedStyle !== "ALL") {
      list = list.filter((s) => {
        const text = `${s.name || ""} ${s.category || ""} ${s.shortDescription || ""}`.toLowerCase();
        if (selectedStyle === "oxford") return text.includes("oxford") || text.includes("brogue") || text.includes("derby");
        if (selectedStyle === "loafer") return text.includes("loafer") || text.includes("moccasin") || text.includes("mule") || text.includes("slip-on");
        if (selectedStyle === "monk_boot") return text.includes("monk") || text.includes("boot") || text.includes("chelsea");
        if (selectedStyle === "sneaker") return text.includes("sneaker") || text.includes("runner") || text.includes("trainer");
        if (selectedStyle === "pump") return text.includes("pump") || text.includes("heel") || text.includes("court") || text.includes("stiletto");
        return true;
      });
    }

    // 5. Price Range Preset
    if (selectedPricePreset > 0) {
      const { min, max } = pricePresets[selectedPricePreset];
      list = list.filter((s) => {
        const effectivePrice = s.Discount ? Math.round(s.price * (1 - s.Discount / 100)) : s.price;
        return effectivePrice >= min && effectivePrice <= max;
      });
    }

    // 6. Discount only
    if (onlyDiscounted) {
      list = list.filter((s) => Number(s.Discount) > 0);
    }

    // 6b. In-Stock only
    if (onlyInStock) {
      list = list.filter((s) => Number(s.stock) > 0);
    }

    // 7. Sorting
    if (sortBy === "price-low") {
      list.sort((a, b) => {
        const priceA = a.Discount ? Math.round(a.price * (1 - a.Discount / 100)) : a.price;
        const priceB = b.Discount ? Math.round(b.price * (1 - b.Discount / 100)) : b.price;
        return Number(priceA) - Number(priceB);
      });
    } else if (sortBy === "price-high") {
      list.sort((a, b) => {
        const priceA = a.Discount ? Math.round(a.price * (1 - a.Discount / 100)) : a.price;
        const priceB = b.Discount ? Math.round(b.price * (1 - b.Discount / 100)) : b.price;
        return Number(priceB) - Number(priceA);
      });
    } else if (sortBy === "rating") {
      list.sort((a, b) => (Number(b.star) || 5) - (Number(a.star) || 5));
    } else if (sortBy === "popular") {
      list.sort((a, b) => (Number(b.selling) || 0) - (Number(a.selling) || 0));
    }

    return list;
  }, [Shoes, searchQuery, selectedCategory, selectedSize, selectedStyle, selectedPricePreset, onlyDiscounted, sortBy]);

  const activeFilterCount =
    (selectedCategory !== "ALL" ? 1 : 0) +
    (selectedSize ? 1 : 0) +
    (selectedStyle !== "ALL" ? 1 : 0) +
    (selectedPricePreset > 0 ? 1 : 0) +
    (onlyDiscounted ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // Subcategories to display in sidebar
  const relevantSubcategories = useMemo(() => {
    if (activeDepartment === "ALL") {
      return [
        { label: "All Footwear", value: "ALL", group: "All" },
        ...categoryHierarchy["MEN'S"].map((c) => ({ ...c, group: "Men's" })),
        ...categoryHierarchy["WOMEN'S"].map((c) => ({ ...c, group: "Women's" })),
        ...categoryHierarchy["KID'S"].map((c) => ({ ...c, group: "Kid's" })),
      ];
    }
    return categoryHierarchy[activeDepartment] || [];
  }, [activeDepartment]);

  return (
    <div className="bg-slate-50 dark:bg-[#0B0F19] min-h-screen py-5 md:py-8 transition-colors mt-5">
      <Content>
        {/* ================= Top Breadcrumb & Department Tabs ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <FiChevronRight className="text-slate-400" />
            <Link to="/products/ALL" className="hover:text-amber-500 transition-colors">Footwear</Link>
            {selectedCategory !== "ALL" && (
              <>
                <FiChevronRight className="text-slate-400" />
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {selectedCategory}
                </span>
              </>
            )}
          </nav>

          {/* Quick Department Switcher Tabs (Like Nike / Farfetch) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {departmentTabs.map((dept) => {
              const isActive = activeDepartment === dept.value;
              return (
                <button
                  key={dept.value}
                  onClick={() => handleDepartmentTab(dept.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm"
                      : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-amber-400"
                  }`}
                >
                  <span>{dept.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    {getCategoryCount(dept.value)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= Catalog Header Bar ================= */}
        <div className="p-4 sm:p-5 mb-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xl flex-shrink-0">
              <GiLeatherBoot />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {selectedCategory === "ALL"
                  ? "All Handcrafted Footwear"
                  : selectedCategory}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-extrabold text-amber-600 dark:text-amber-400">{filteredShoes.length}</span> luxury styles available
              </p>
            </div>
          </div>

          {/* Quick Search & Sort Control Strip */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search style, leather, color..."
                className="w-full pl-8 pr-7 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <FiX size={12} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm transition-all"
            >
              <option value="featured">Featured / Newest</option>
              <option value="popular">Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <FiFilter size={13} />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>
          </div>
        </div>

        {/* ================= Active Filter Chips Bar ================= */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5 px-3 py-2.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <FiSliders className="text-amber-500 text-xs" />
              Active:
            </span>

            {selectedCategory !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-xs">
                {selectedCategory}
                <FiX className="cursor-pointer hover:text-rose-500" onClick={() => handleCategorySelect("ALL")} />
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-xs">
                "{searchQuery}"
                <FiX className="cursor-pointer hover:text-rose-500" onClick={() => setSearchQuery("")} />
              </span>
            )}

            {selectedSize && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-xs">
                EU {selectedSize}
                <FiX className="cursor-pointer hover:text-rose-500" onClick={() => setSelectedSize(null)} />
              </span>
            )}

            {selectedPricePreset > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-xs">
                {pricePresets[selectedPricePreset].label}
                <FiX className="cursor-pointer hover:text-rose-500" onClick={() => setSelectedPricePreset(0)} />
              </span>
            )}

            {selectedStyle !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-xs">
                {shoeStylesList.find((s) => s.value === selectedStyle)?.label}
                <FiX className="cursor-pointer hover:text-rose-500" onClick={() => setSelectedStyle("ALL")} />
              </span>
            )}

            {onlyDiscounted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30 shadow-xs">
                <span>🔥</span>
                <span>Sale Items</span>
                <FiX className="cursor-pointer hover:scale-125 transition-transform" onClick={() => setOnlyDiscounted(false)} />
              </span>
            )}

            {onlyInStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shadow-xs">
                <span>⚡</span>
                <span>In-Stock Only</span>
                <FiX className="cursor-pointer hover:scale-125 transition-transform" onClick={() => setOnlyInStock(false)} />
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 ml-auto cursor-pointer"
            >
              <FiRotateCcw size={11} />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* ================= Main Grid: FIXED SIDEBAR + PRODUCT CATALOG ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= LEFT FIXED / STICKY SIDEBAR (Desktop) ================= */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
            <div className="relative bg-white/90 dark:bg-[#0d121f]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black/60 overflow-hidden flex flex-col max-h-[calc(100vh-120px)] ring-1 ring-black/5 dark:ring-white/5 transition-all">
              
              {/* Luxury Top Ambient Glow Rim */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

              {/* Sidebar Header */}
              <div className="p-4 px-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/40 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-500/5 text-amber-500 flex items-center justify-center border border-amber-500/30 shadow-xs">
                    <FiSliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Filter Catalog
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-medium">Refine your look</p>
                  </div>
                </div>

                {activeFilterCount > 0 ? (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                    title="Clear all active filters"
                  >
                    <FiRotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                    {filteredShoes.length} pairs
                  </span>
                )}
              </div>

              {/* Scrollable Compact Content (With ultra-thin luxury scrollbar) */}
              <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                
                {/* 1. Main Categories & Subcategories Accordion */}
                <div className="border-b border-slate-100 dark:border-slate-800/70 pb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <FiTag className="w-3.5 h-3.5 text-amber-500" />
                      Categories
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 lowercase">click to expand</span>
                  </div>

                  {/* All Footwear Button */}
                  <button
                    onClick={() => handleCategorySelect("ALL")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                      selectedCategory === "ALL"
                        ? "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-500 dark:text-amber-400 border-amber-500/40 shadow-xs"
                        : "text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">✨</span>
                      <span>All Footwear Catalog</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      selectedCategory === "ALL" 
                        ? "bg-amber-500 text-slate-950 shadow-xs" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                    }`}>
                      {Shoes?.length || 0}
                    </span>
                  </button>

                  {/* Main Category Accordions */}
                  <div className="space-y-1.5 pt-1">
                    {displayCategoryList.map((cat) => {
                      const isOpen = openCategoryAccordion === cat.gender;
                      const isGenderActive = selectedCategory === cat.gender;
                      const totalGenderCount = getCategoryCount(cat.gender);

                      return (
                        <div key={cat.gender} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all bg-slate-50/40 dark:bg-slate-900/30">
                          {/* Main Category Header Button */}
                          <button
                            onClick={() => toggleCategoryAccordion(cat.gender)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-all ${
                              isGenderActive
                                ? "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-500 dark:text-amber-400 font-extrabold border-l-2 border-amber-500"
                                : isOpen
                                ? "bg-slate-100/80 dark:bg-slate-800/60 text-slate-900 dark:text-white"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">{cat.icon}</span>
                              <span className="tracking-wide">{cat.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isGenderActive
                                  ? "bg-amber-500 text-slate-950"
                                  : "bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                              }`}>
                                {totalGenderCount}
                              </span>
                              {isOpen ? <FiChevronUp size={14} className="text-amber-500" /> : <FiChevronDown size={14} className="text-slate-400" />}
                            </div>
                          </button>

                          {/* Subcategories (Only visible if this accordion is open) */}
                          {isOpen && (
                            <div className="bg-white/90 dark:bg-[#0c101a] px-2.5 py-2 space-y-1 border-t border-slate-100 dark:border-slate-800/80">
                              {cat.subcategories.map((sub, sIdx) => {
                                const isSelected = selectedCategory === sub.value;
                                const count = getCategoryCount(sub.value);
                                return (
                                  <button
                                    key={sIdx}
                                    onClick={() => handleSubcategoryClick(sub.value, cat.gender)}
                                    className={`w-full text-left pl-6 pr-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between group ${
                                      isSelected
                                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-amber-500 dark:hover:text-amber-400"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate pr-1">
                                      <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isSelected ? "bg-slate-950" : "bg-slate-400 dark:bg-slate-600 group-hover:bg-amber-500"}`} />
                                      <span className="truncate">{sub.label}</span>
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                      isSelected ? "bg-slate-950/20 text-slate-950" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                                    }`}>
                                      {count}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Shoe Size Accordion (Dynamic per Department!) */}
                <div className="border-b border-slate-100 dark:border-slate-800/70 pb-4">
                  <button
                    onClick={() => toggleSection("size")}
                    className="w-full flex items-center justify-between text-left text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 hover:text-amber-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>Shoe Size (EU)</span>
                      {selectedSize && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold shadow-xs">
                          EU {selectedSize}
                        </span>
                      )}
                    </div>
                    {openSections.size ? <FiChevronUp size={14} className="text-amber-500" /> : <FiChevronDown size={14} className="text-slate-400" />}
                  </button>

                  {openSections.size && (
                    <div className="pt-1">
                      <div className="grid grid-cols-5 gap-1.5">
                        {currentAvailableSizes.map((sz) => {
                          const isSelected = selectedSize === sz;
                          return (
                            <button
                              key={sz}
                              onClick={() => setSelectedSize(isSelected ? null : sz)}
                              className={`h-9 rounded-xl text-xs font-bold transition-all duration-200 border ${
                                isSelected
                                  ? "bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 scale-105 font-black ring-2 ring-amber-400/20"
                                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-amber-400 hover:text-amber-500 hover:scale-105"
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                      {selectedSize && (
                        <button
                          onClick={() => setSelectedSize(null)}
                          className="mt-2 text-[10.5px] font-semibold text-slate-400 hover:text-rose-500 transition-colors block text-center w-full"
                        >
                          Clear selected size
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Price Range Accordion (Segmented Luxury Radio Cards) */}
                <div className="border-b border-slate-100 dark:border-slate-800/70 pb-4">
                  <button
                    onClick={() => toggleSection("price")}
                    className="w-full flex items-center justify-between text-left text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 hover:text-amber-500 transition-colors"
                  >
                    <span>Price Range</span>
                    {openSections.price ? <FiChevronUp size={14} className="text-amber-500" /> : <FiChevronDown size={14} className="text-slate-400" />}
                  </button>

                  {openSections.price && (
                    <div className="space-y-1.5 pt-1">
                      {pricePresets.map((preset, pIdx) => {
                        const isSelected = selectedPricePreset === pIdx;
                        return (
                          <button
                            key={pIdx}
                            onClick={() => setSelectedPricePreset(pIdx)}
                            className={`group w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between border ${
                              isSelected
                                ? "bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent text-amber-500 dark:text-amber-400 border-amber-500/40 shadow-xs"
                                : "text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected ? "border-amber-500 bg-amber-500" : "border-slate-400 dark:border-slate-600 group-hover:border-amber-400"
                              }`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                              </span>
                              <span>{preset.label}</span>
                            </div>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Shoe Silhouettes Accordion */}
                <div className="border-b border-slate-100 dark:border-slate-800/70 pb-4">
                  <button
                    onClick={() => toggleSection("style")}
                    className="w-full flex items-center justify-between text-left text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 hover:text-amber-500 transition-colors"
                  >
                    <span>Silhouette Style</span>
                    {openSections.style ? <FiChevronUp size={14} className="text-amber-500" /> : <FiChevronDown size={14} className="text-slate-400" />}
                  </button>

                  {openSections.style && (
                    <div className="space-y-1.5 pt-1">
                      {shoeStylesList.map((st, idx) => {
                        const isSelected = selectedStyle === st.value;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedStyle(st.value)}
                            className={`group w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                              isSelected
                                ? "bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent text-amber-500 dark:text-amber-400 border-amber-500/40 shadow-xs"
                                : "text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected ? "border-amber-500 bg-amber-500" : "border-slate-400 dark:border-slate-600 group-hover:border-amber-400"
                              }`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                              </span>
                              <span>{st.label}</span>
                            </div>
                            {isSelected && <FiCheck className="text-amber-500 text-xs" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 5. Executive Quick Toggles (Sales & In-Stock) */}
                <div className="pt-1 space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 cursor-pointer hover:bg-amber-500/15 transition-all">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🔥</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Sale Offers</p>
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium leading-tight">Discounted pairs only</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/15 transition-all">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">⚡</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">In-Stock Only</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium leading-tight">Ready for 24h dispatch</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer rounded"
                    />
                  </label>
                </div>

              </div>
            </div>
          </aside>

          {/* ================= MOBILE FILTER DRAWER ================= */}
          {showMobileFilter && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
              <div className="w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#0d121f] h-full shadow-2xl p-5 overflow-y-auto space-y-5 custom-scrollbar">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                      <FiSliders className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                      Filter Footwear
                    </span>
                  </div>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Categories
                  </h4>

                  {/* All Footwear Button */}
                  <button
                    onClick={() => handleCategorySelect("ALL")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      selectedCategory === "ALL"
                        ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                        : "text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>✨</span>
                      <span>All Footwear</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {Shoes?.length || 0}
                    </span>
                  </button>

                  {/* Accordion Categories */}
                  {displayCategoryList.map((cat) => {
                    const isOpen = openCategoryAccordion === cat.gender;
                    const isGenderActive = selectedCategory === cat.gender;
                    const totalGenderCount = getCategoryCount(cat.gender);

                    return (
                      <div key={cat.gender} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <button
                          onClick={() => toggleCategoryAccordion(cat.gender)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold ${
                            isGenderActive
                              ? "bg-gradient-to-r from-amber-500/20 to-transparent text-amber-500 font-extrabold"
                              : isOpen
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                              : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] opacity-80 font-bold">({totalGenderCount})</span>
                            {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="bg-white dark:bg-[#0c101a] px-2.5 py-2 space-y-1 border-t border-slate-100 dark:border-slate-800">
                            {cat.subcategories.map((sub, sIdx) => {
                              const isSelected = selectedCategory === sub.value;
                              return (
                                <button
                                  key={sIdx}
                                  onClick={() => handleSubcategoryClick(sub.value, cat.gender)}
                                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                                    isSelected
                                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-sm"
                                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  <span>• {sub.label}</span>
                                  <span className="text-[10px] font-bold opacity-75">
                                    {getCategoryCount(sub.value)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Sizes */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider pb-2.5">
                    Shoe Size (EU)
                  </h4>
                  <div className="grid grid-cols-5 gap-1.5">
                    {currentAvailableSizes.map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(isSelected ? null : sz)}
                          className={`h-9 rounded-xl text-xs font-bold border ${
                            isSelected
                              ? "bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 border-amber-400 font-black shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Presets */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider pb-2">
                    Price Range
                  </h4>
                  <div className="space-y-1.5">
                    {pricePresets.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => setSelectedPricePreset(pIdx)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                          selectedPricePreset === pIdx
                            ? "bg-gradient-to-r from-amber-500/15 to-transparent text-amber-500 font-bold border-amber-500/30"
                            : "text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{preset.label}</span>
                        {selectedPricePreset === pIdx && <FiCheck className="text-amber-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Toggles */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">🔥 On Sale Only</span>
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">⚡ In-Stock Only</span>
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>
                </div>

                {/* Drawer Footer CTA */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                  >
                    View {filteredShoes.length} Pairs
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full py-1.5 text-xs font-bold text-rose-500 hover:underline text-center"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= RIGHT PRODUCTS CATALOG GRID ================= */}
          <main className="lg:col-span-9">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <LoadingSpinner />
                <p className="text-xs text-slate-400 mt-4 tracking-wider uppercase font-semibold">
                  Loading Luxury Footwear Catalog...
                </p>
              </div>
            ) : error ? (
              <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#111827] border border-red-500/20 text-red-500">
                <p className="font-bold">Error loading footwear catalog</p>
                <p className="text-xs text-slate-400 mt-1">{error}</p>
              </div>
            ) : filteredShoes.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                <Empty description={false} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No Footwear Found for Selected Filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {searchQuery ? `No results matching "${searchQuery}". ` : ""}
                  Try relaxing your size or category selection to explore all artisan leather shoes in stock.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-amber-400 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredShoes.map((shoe) => (
                  <div key={shoe._id} className="h-full">
                    <LuxuryProductCard shoe={shoe} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </Content>
    </div>
  );
};

export default Products;
