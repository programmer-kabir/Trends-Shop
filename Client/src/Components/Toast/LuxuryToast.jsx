import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  IoCheckmark,
  IoClose,
  IoAlert,
  IoInformation,
  IoWarningOutline,
} from "react-icons/io5";

// Lightweight pub/sub store for luxury toasts
const listeners = new Set();
let toasts = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

// Smart title inference if only a string message is provided
const inferTitle = (type, message = "") => {
  const lower = typeof message === "string" ? message.toLowerCase() : "";

  if (type === "success") {
    if (lower.includes("cart")) return "Cart Updated 🛍️";
    if (lower.includes("wishlist") || lower.includes("favorite")) return "Wishlist Updated ❤️";
    if (lower.includes("login") || lower.includes("log in")) return "Welcome Back 👋";
    if (lower.includes("regist")) return "Account Created 🎉";
    if (lower.includes("coupon") || lower.includes("discount")) return "Coupon Applied 🏷️";
    if (lower.includes("copi")) return "Copied to Clipboard 📋";
    if (lower.includes("delet") || lower.includes("remov")) return "Item Removed 🗑️";
    if (lower.includes("order") || lower.includes("payment")) return "Order Confirmed 💳";
    if (lower.includes("review")) return "Feedback Received ⭐";
    if (lower.includes("update") || lower.includes("save")) return "Saved Successfully ✨";
    return "Operation Successful 🎉";
  }

  if (type === "error") {
    if (lower.includes("size")) return "Size Selection Required ⚠️";
    if (lower.includes("login") || lower.includes("auth")) return "Authentication Required 🔒";
    if (lower.includes("stock") || lower.includes("available")) return "Out of Stock 📦";
    if (lower.includes("coupon")) return "Invalid Coupon 🏷️";
    if (lower.includes("email")) return "Invalid Email ✉️";
    if (lower.includes("cart")) return "Cart Error 🛍️";
    if (lower.includes("network") || lower.includes("failed")) return "Action Failed ✕";
    return "Something Went Wrong ✕";
  }

  if (type === "warning") {
    return "Attention Required ⚠️";
  }

  if (type === "info") {
    return "Notice ℹ️";
  }

  if (type === "loading") {
    return "Processing Request ⏳";
  }

  return "Notification 🔔";
};

// Play subtle modern audio chime (Web Audio API - zero external files)
const playChime = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "success") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "error") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // AudioContext might be blocked until user gesture, safely ignore
  }
};

const createToast = (type, message, options = {}) => {
  const id = options.id || Math.random().toString(36).substring(2, 9);
  const duration = options.duration !== undefined ? options.duration : 4200;

  let title = options.title;
  let description = options.description;

  if (typeof message === "object" && message !== null) {
    title = message.title || title;
    description = message.description || message.message || description;
  } else if (typeof message === "string") {
    if (!description && !title) {
      // Auto assign smart title & use message as description
      title = inferTitle(type, message);
      description = message;
    } else if (!description && title) {
      description = message;
    }
  }

  // Remove duplicate if id already exists
  toasts = toasts.filter((t) => t.id !== id);

  const newToast = {
    id,
    type,
    title: title || inferTitle(type, description),
    description: description || "",
    badge: options.badge || null,
    amount: options.amount || null,
    action: options.action || null,
    duration,
    createdAt: Date.now(),
    icon: options.icon || null,
  };

  toasts = [newToast, ...toasts].slice(0, 5); // keep max 5 on screen
  notifyListeners();
  playChime(type);

  return id;
};

// Luxury Toast API
export const toast = (message, options) => createToast("info", message, options);

toast.success = (message, options) => createToast("success", message, options);
toast.error = (message, options) => createToast("error", message, options);
toast.warning = (message, options) => createToast("warning", message, options);
toast.info = (message, options) => createToast("info", message, options);
toast.loading = (message, options) => createToast("loading", message, { ...options, duration: 0 });

toast.dismiss = (id) => {
  if (id) {
    toasts = toasts.filter((t) => t.id !== id);
  } else {
    toasts = [];
  }
  notifyListeners();
};

toast.custom = (jsxOrFn, options = {}) => {
  const id = options.id || Math.random().toString(36).substring(2, 9);
  const customToast = {
    id,
    type: "custom",
    customRender: jsxOrFn,
    duration: options.duration || 4500,
    createdAt: Date.now(),
  };
  toasts = [customToast, ...toasts].slice(0, 5);
  notifyListeners();
  return id;
};

// Toast Card Component with exact luxury dark/light aesthetics from reference image
const LuxuryToastCard = ({ toastItem, onDismiss }) => {
  const { id, type, title, description, badge, amount, action, duration } = toastItem;
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 280);
  }, [id, onDismiss]);

  useEffect(() => {
    if (!duration || duration <= 0) return;
    if (isPaused) return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, isPaused, handleClose]);

  // Color schemes matching the luxury screenshot
  const typeConfig = {
    success: {
      accentBorder: "border-emerald-500/20 dark:border-emerald-500/30",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      bottomGlow: "from-emerald-400 via-teal-400 to-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.7)]",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
      icon: <IoCheckmark className="text-xl stroke-[12]" />,
    },
    error: {
      accentBorder: "border-rose-500/20 dark:border-rose-500/30",
      iconBg: "bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400",
      bottomGlow: "from-rose-500 via-pink-500 to-rose-600 shadow-[0_0_14px_rgba(244,63,94,0.7)]",
      badgeBg: "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300",
      icon: <IoClose className="text-xl stroke-[12]" />,
    },
    warning: {
      accentBorder: "border-amber-500/20 dark:border-amber-500/30",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400",
      bottomGlow: "from-amber-400 via-orange-400 to-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.7)]",
      badgeBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300",
      icon: <IoWarningOutline className="text-xl" />,
    },
    info: {
      accentBorder: "border-sky-500/20 dark:border-sky-500/30",
      iconBg: "bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/30 text-sky-600 dark:text-sky-400",
      bottomGlow: "from-sky-400 via-indigo-400 to-sky-500 shadow-[0_0_14px_rgba(14,165,233,0.7)]",
      badgeBg: "bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300",
      icon: <IoInformation className="text-xl" />,
    },
    loading: {
      accentBorder: "border-amber-500/20 dark:border-amber-500/30",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400",
      bottomGlow: "from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.7)]",
      badgeBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300",
      icon: (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ),
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  if (toastItem.customRender) {
    return (
      <div className="pointer-events-auto">
        {typeof toastItem.customRender === "function"
          ? toastItem.customRender({ id, dismiss: handleClose })
          : toastItem.customRender}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      className={`
        pointer-events-auto relative overflow-hidden w-full max-w-[420px] select-none
        transition-all duration-300 ease-out transform
        ${isExiting ? "opacity-0 translate-x-8 scale-95" : "animate-luxury-toast opacity-100 translate-x-0 scale-100"}
        rounded-2xl p-4
        /* Dark mode luxury glassmorphic card */
        dark:bg-[#090E1A]/95 dark:border dark:border-slate-800/80 dark:shadow-[0_20px_45px_rgba(0,0,0,0.7)]
        /* Light mode luxury ivory glassmorphic card */
        bg-white/95 border border-slate-200/90 shadow-[0_20px_40px_rgba(15,23,42,0.12)]
        backdrop-blur-xl
        group
      `}
      style={{
        boxShadow: "0 16px 36px -8px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Top Main Section */}
      <div className="flex items-start gap-3.5">
        {/* Left Icon Badge (rounded square matching the screenshot) */}
        <div
          className={`
            shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105
            ${config.iconBg}
          `}
        >
          {toastItem.icon || config.icon}
        </div>

        {/* Content Section: Title & Message */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-[14px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight line-clamp-1">
              {title}
            </h4>
          </div>

          {description && (
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300 font-normal line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Close Button (top-right X) */}
        <button
          onClick={handleClose}
          aria-label="Close notification"
          className="shrink-0 -mt-1 -mr-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <IoClose className="text-lg" />
        </button>
      </div>

      {/* Optional Metadata Row / Pills (like in screenshot: brand badge + price/amount) */}
      {(badge || amount || action) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between gap-2">
          {badge ? (
            <div className="text-[11.5px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 truncate max-w-[200px]">
              {badge}
            </div>
          ) : (
            <div />
          )}

          {amount ? (
            <div
              className={`
                text-[12px] font-semibold px-2.5 py-1 rounded-lg border tracking-wide
                ${config.badgeBg}
              `}
            >
              {amount}
            </div>
          ) : action ? (
            <button
              onClick={() => {
                if (action.onClick) action.onClick();
                handleClose();
              }}
              className="text-[11.5px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
            >
              {action.label || "View"}
            </button>
          ) : null}
        </div>
      )}

      {/* Neon glowing progress bar at the bottom (exact visual match to the glowing accent in the screenshot) */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100/30 dark:bg-slate-800/40 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${config.bottomGlow}`}
            style={{
              animation: `luxuryProgress ${duration}ms linear forwards`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          />
        </div>
      )}
    </div>
  );
};

// LuxuryToaster Container Component
export const LuxuryToaster = () => {
  const [currentToasts, setCurrentToasts] = useState(toasts);

  useEffect(() => {
    listeners.add(setCurrentToasts);
    return () => listeners.delete(setCurrentToasts);
  }, []);

  const handleDismiss = useCallback((id) => {
    toast.dismiss(id);
  }, []);

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-none max-w-full w-[420px] px-3 sm:px-0"
    >
      {currentToasts.map((item) => (
        <LuxuryToastCard
          key={item.id}
          toastItem={item}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

if (typeof window !== "undefined") {
  window.luxuryToast = toast;
}

export const Toaster = LuxuryToaster;
export default toast;
