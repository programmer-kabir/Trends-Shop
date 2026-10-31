import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/LOGO/LOGO.png";
import {
  FiHome,
  FiShoppingBag,
  FiArrowLeft,
  FiSearch,
  FiCompass,
  FiHelpCircle,
  FiLayers,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const NotFound = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const popularDestinations = [
    { label: "Men's Atelier", path: "/products" },
    { label: "Women's Collection", path: "/products" },
    { label: "Client Portal", path: "/user/dashboard" },
    { label: "Saved Wishlist", path: "/user/wishlist" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-white transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient luxury glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP BAR / LOGO */}
      <header className="w-full px-6 py-6 max-w-7xl mx-auto flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Trends Shop"
            className="h-10 w-auto object-contain dark:invert dark:hue-rotate-180 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <Link
          to="/"
          className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500/50 hover:text-amber-500 transition shadow-xs flex items-center gap-2"
        >
          <FiHome className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
      </header>

      {/* MAIN 404 CONTENT */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <FiCompass className="w-3.5 h-3.5" />
          <span>404 Error • Page Lost in the Atelier</span>
        </div>

        {/* 404 Big Gradient Number */}
        <div className="relative mb-3 select-none">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 dark:from-amber-300 dark:via-amber-500 dark:to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
            404
          </h1>
          <span className="absolute -top-3 right-0 text-amber-500 dark:text-amber-400">
            <RiSparklingFill className="w-8 h-8 animate-spin-slow opacity-80" />
          </span>
        </div>

        {/* Headline & Description */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          Sole Not Found
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mb-8 leading-relaxed">
          The artisan footwear silhouette or page you are seeking has either stepped out of catalog or moved to another boutique destination.
        </p>

        {/* Search Bar directly on 404 */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-md mb-8 relative flex items-center"
        >
          <FiSearch className="absolute left-4 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search footwear collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 rounded-2xl text-sm bg-white dark:bg-slate-900/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm focus:outline-none focus:border-amber-500 transition"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Call-to-action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 hover:text-amber-500 transition shadow-xs flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/25 transition flex items-center gap-2"
          >
            <FiHome className="w-4 h-4" />
            <span>Explore Home</span>
          </Link>

          <Link
            to="/products"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 hover:text-amber-500 transition shadow-xs flex items-center gap-2"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>Browse Shoes</span>
          </Link>
        </div>

        {/* Suggested Quick Links */}
        <div className="w-full max-w-lg pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
            Popular Atelier Destinations
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularDestinations.map((dest, idx) => (
              <Link
                key={idx}
                to={dest.path}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-slate-800/60 transition"
              >
                {dest.label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 dark:text-slate-500 z-10 border-t border-slate-200/60 dark:border-slate-800/60">
        © {new Date().getFullYear()} Trends Shop Atelier • Handcrafted Excellence
      </footer>
    </div>
  );
};

export default NotFound;
