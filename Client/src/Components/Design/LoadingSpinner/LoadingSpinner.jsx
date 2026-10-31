import React, { useState, useEffect } from "react";
import { RiSparklingFill } from "react-icons/ri";
import { FiRefreshCw } from "react-icons/fi";

const LoadingSpinner = ({
  message = "Loading Luxury Footwear...",
  subMessage = "Trends Shop • Handcrafted Leather Atelier",
  fullScreen = false,
  size = "md",
}) => {
  const [showRefresh, setShowRefresh] = useState(false);

  // Watchdog timer: If loading takes more than 6.5s, provide a safety refresh button so user is never stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRefresh(true);
    }, 6500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-[#0B0F19]/90 backdrop-blur-md text-slate-900 dark:text-slate-100"
    : "w-full py-16 sm:py-24 flex flex-col items-center justify-center text-slate-900 dark:text-slate-100";

  return (
    <div className={containerClasses}>
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center animate-fadeIn">
        
        {/* Orbital Luxury Ring Spinner */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Ambient Glow */}
          <div className="absolute w-28 h-28 bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-transparent rounded-full blur-xl animate-pulse" />

          {/* Outer Rotating Ring */}
          <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-amber-500 border-r-amber-400 dark:border-t-amber-400 dark:border-r-amber-300 animate-spin" />

          {/* Inner Counter-Rotating Ring */}
          <div
            className="absolute w-14 h-14 rounded-full border-2 border-transparent border-b-amber-600 border-l-amber-500 dark:border-b-amber-500 dark:border-l-amber-400 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
          />

          {/* Center Monogram Badge */}
          <div className="absolute w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 text-xs tracking-tighter">
            TS
          </div>
        </div>

        {/* Branding & Status Message */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <RiSparklingFill className="text-amber-500 animate-pulse" />
            <span>{message}</span>
          </div>

          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white pt-1">
            Trends Shop Atelier
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {subMessage}
          </p>
        </div>

        {/* Subtle Shimmering Progress Bar */}
        <div className="w-36 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-5">
          <div className="w-full h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 rounded-full animate-shimmer" />
        </div>

        {/* Safety Timeout Fallback (Only shows if network or query hangs > 6.5s) */}
        {showRefresh && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 animate-fadeIn space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Taking longer than usual?
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
            >
              <FiRefreshCw className="text-xs" />
              <span>Refresh Page</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoadingSpinner;
