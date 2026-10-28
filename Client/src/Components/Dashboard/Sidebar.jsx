import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/LOGO/LOGO.png";
import useAuth from "../Hooks/useAuth";
import useAdmin from "../Hooks/useAdmin";
import LoadingSpinner from "../Design/LoadingSpinner/LoadingSpinner";
import { useSelector } from "react-redux";
import {
  FiGrid,
  FiShoppingBag,
  FiPackage,
  FiPlusSquare,
  FiTag,
  FiUsers,
  FiExternalLink,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
  FiCheckCircle,
  FiLayers,
  FiChevronRight,
  FiActivity,
} from "react-icons/fi";

const Sidebar = () => {
  const { user, logOut, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, isAdminLoading] = useAdmin();
  const location = useLocation();

  // Redux store data for live indicators
  const { RequestPayment } = useSelector((state) => state.RequestPayment || { RequestPayment: [] });
  const { Shoes } = useSelector((state) => state.Shoes || { Shoes: [] });
  const { categories } = useSelector((state) => state.Categories || { categories: [] });
  const { Coupons } = useSelector((state) => state.Coupons || { Coupons: [] });

  // Count active orders
  const activeOrdersCount = RequestPayment?.filter(
    (o) => o?.status === "Pending" || o?.status === "Receive Payment" || o?.status === "Delivery"
  )?.length || 0;

  const totalShoesCount = Shoes?.length || 0;
  const totalCategoriesCount = categories?.length || 0;
  const totalCouponsCount = Coupons?.length || 0;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleSignOut = () => {
    logOut();
  };

  if (isAdminLoading || loading) {
    return <LoadingSpinner />;
  }

  // Admin Navigation Sections
  const adminSections = [
    {
      title: "Core Operations",
      items: [
        {
          to: "/admin/dashboard",
          label: "Executive Dashboard",
          icon: <FiGrid className="w-5 h-5" />,
          badge: null,
        },
        {
          to: "/admin/request_Payment",
          label: "Orders & Payments",
          icon: <FiShoppingBag className="w-5 h-5" />,
          badge: activeOrdersCount > 0 ? `${activeOrdersCount} Active` : null,
          badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30",
        },
      ],
    },
    {
      title: "Catalog Studio",
      items: [
        {
          to: "/admin/show-product",
          label: "Footwear Catalog",
          icon: <FiPackage className="w-5 h-5" />,
          badge: totalShoesCount > 0 ? `${totalShoesCount}` : null,
          badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20",
        },
        {
          to: "/admin/create-product",
          label: "Add New Footwear",
          icon: <FiPlusSquare className="w-5 h-5" />,
          badge: null,
        },
        {
          to: "/admin/categories",
          label: "Category Studio",
          icon: <FiLayers className="w-5 h-5" />,
          badge: totalCategoriesCount > 0 ? `${totalCategoriesCount} Depts` : null,
          badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20",
        },
        {
          to: "/admin/coupon",
          label: "Coupons & Offers",
          icon: <FiTag className="w-5 h-5" />,
          badge: totalCouponsCount > 0 ? `${totalCouponsCount}` : null,
          badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20",
        },
      ],
    },
    {
      title: "System & Roles",
      items: [
        {
          to: "/admin/manage_users",
          label: "Users & Roles",
          icon: <FiUsers className="w-5 h-5" />,
          badge: null,
        },
      ],
    },
  ];

  // Customer Navigation Sections
  const userSections = [
    {
      title: "My Account",
      items: [
        {
          to: "/user/dashboard",
          label: "My Profile",
          icon: <FiGrid className="w-5 h-5" />,
          badge: null,
        },
        {
          to: "/user/my_orders",
          label: "My Order History",
          icon: <FiShoppingBag className="w-5 h-5" />,
          badge: null,
        },
      ],
    },
  ];

  const currentSections = isAdmin ? adminSections : userSections;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 dark:bg-[#0c0f17] text-slate-800 dark:text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
      {/* 1. TOP HEADER (Fixed 64px, never scrolls) */}
      <header className="h-16 flex-shrink-0 z-40 bg-white/95 dark:bg-[#111622]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3.5">
          {/* Mobile hamburger toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Brand Logo & Portal Tag */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              src={logo}
              alt="Trends Shop"
            />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <FiShield className="w-3 h-3" />
              <span>{isAdmin ? "Enterprise Admin" : "Client Portal"}</span>
            </div>
          </Link>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Live Storefront Quick Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-3.5 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 transition-all border border-slate-200/50 dark:border-slate-700/50"
            title="Open customer storefront in current tab"
          >
            <span>Live Store</span>
            <FiExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />
          </Link>

          {/* User Profile Bar & Quick Logout */}
          <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {user?.displayName || (isAdmin ? "Admin Officer" : "Customer")}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                {user?.email || "verified.account"}
              </span>
            </div>

            {/* User Avatar with status dot */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-amber-500/20 ring-2 ring-white dark:ring-slate-900">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#111622] rounded-full" />
            </div>

            {/* Logout button */}
            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition"
              title="Sign Out of Dashboard"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY WORKSPACE (Fixed viewport height, no window scrolling) */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* Mobile Backdrop overlay */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          />
        )}

        {/* 3. ROCK-SOLID LOCKED SIDEBAR */}
        <aside
          className={`
            fixed lg:relative inset-y-0 lg:top-0 lg:bottom-0 left-0 z-50 lg:z-30
            w-64 sm:w-72 flex-shrink-0 h-full flex flex-col justify-between
            bg-white/95 dark:bg-[#111622]/95 backdrop-blur-xl
            border-r border-slate-200/80 dark:border-slate-800/80
            shadow-xl lg:shadow-none
            transition-transform duration-300 ease-in-out select-none
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Top of Sidebar: Header only on Mobile Drawer */}
          <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Navigation Menu</span>
            <button onClick={toggleSidebar} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <FiX size={18} />
            </button>
          </div>

          {/* Navigation Links Area (Internally scrollable if needed, sidebar itself never moves!) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-3.5 py-4 space-y-6">
            {currentSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {/* Section title */}
                <div className="px-3 pb-1.5 text-[10.5px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {section.title}
                </div>

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={closeSidebarOnMobile}
                        className={`relative group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-amber-500/15 via-amber-500/8 to-transparent text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-sm shadow-amber-500/50" />
                        )}

                        <div className="flex items-center gap-3">
                          <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-amber-500" : "text-slate-400 dark:text-slate-500"}`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>

                        {/* Badges */}
                        {item.badge ? (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              item.badgeColor || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <FiChevronRight className={`w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${isActive ? "opacity-100 text-amber-500 translate-x-0" : "text-slate-400"}`} />
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Card: Executive Account & System Info (Pinned at bottom, never shakes) */}
          <div className="flex-shrink-0 p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0e131e]/70">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center border border-slate-200/60 dark:border-slate-700">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#111622] rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.displayName || "Admin User"}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  <FiShield className="w-3 h-3 text-amber-500" />
                  <span>{isAdmin ? "Super Administrator" : "Verified Customer"}</span>
                </div>
              </div>
            </div>

            {/* System Status strip */}
            <div className="mt-2.5 px-2 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Sync Connected
              </span>
              <span className="text-slate-400">v2.5 Pro</span>
            </div>
          </div>
        </aside>

        {/* 4. INDEPENDENT MAIN CONTENT AREA (The ONLY part that scrolls!) */}
        <main className="flex-1 h-full min-w-0 overflow-y-auto overflow-x-hidden bg-slate-50/70 dark:bg-[#0c0f17] custom-scrollbar scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
