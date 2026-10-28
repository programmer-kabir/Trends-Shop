import React from "react";
import { FiTruck, FiShield, FiGift, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";

const AnnouncementBar = () => {
  return (
    <div className="bg-slate-900 dark:bg-black text-slate-200 text-xs py-2 px-4 border-b border-amber-500/20 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Free delivery badge */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <FiTruck className="text-amber-400 animate-bounce" />
            Free Express Shipping
          </span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-slate-300 hidden md:inline">Across Bangladesh on all orders over ৳3,000</span>
        </div>

        {/* Center: Highlights */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <FiShield className="text-amber-400" /> 100% Full-Grain Calfskin
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <FiRefreshCw className="text-amber-400" /> 30-Day Hassle-Free Exchange
          </span>
        </div>

        {/* Right: Coupon Callout */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 text-slate-300">
            <FiGift className="text-amber-400" />
            Use Code:
          </span>
          <span className="font-mono font-bold text-slate-950 bg-amber-400 px-2 py-0.5 rounded text-[10px] tracking-wider shadow-sm">
            TRENDS10
          </span>
          <span className="text-amber-400 font-semibold">for 10% OFF</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
