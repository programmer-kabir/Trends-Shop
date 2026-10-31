import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/LOGO/LOGO.png";
import toast from "../../../Components/Toast/LuxuryToast";
import useAuth from "../../../Components/Hooks/useAuth";
import {
  FiMail,
  FiLock,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiStar,
  FiEye,
  FiEyeOff,
  FiCopy,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const Login = () => {
  const { SingInUser, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const destination = from === "/login" ? "/" : from;

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate(destination, { replace: true });
    }
  }, [user, loading, navigate, destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please fill in both email and password.", {
        title: "Required Fields ⚠️",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await SingInUser(email, password);
      const loggedUser = result?.user;
      toast.success("Welcome back to Trends Shop Luxury Atelier!", {
        title: "Welcome Back 👋",
        badge: loggedUser?.email || "VIP Member",
      });
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(error.message || "Invalid credentials provided.", {
        title: "Authentication Failed 🔒",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click Quick Fill Demo Accounts
  const fillDemo = (demoEmail, demoPassword, roleName) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast.success(`${roleName} credentials loaded into form!`, {
      title: "Demo Auto-Filled ✨",
      badge: roleName,
      duration: 2500,
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 md:py-16 px-4 flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] transition-colors relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.7)] bg-white/90 dark:bg-[#111827]/90 backdrop-blur-2xl relative z-10">
        
        {/* Left Column: Brand & Atelier Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#0E1526] to-[#0B0F19] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <RiSparklingFill className="text-sm" />
              <span>Trends Atelier Member</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-luxury text-slate-100">
                Crafted For <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  Timeless Distinction.
                </span>
              </h2>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Sign in to your private atelier account to access personalized curations, tailored size recommendations, and real-time delivery concierge.
              </p>
            </div>

            {/* Privilege points */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <FiCheck className="stroke-[3]" />
                </div>
                <span>Private Access to VIP Seasonal Vault</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <FiCheck className="stroke-[3]" />
                </div>
                <span>Swift 1-Click Checkout & Saved Addresses</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <FiCheck className="stroke-[3]" />
                </div>
                <span>Complimentary 30-Day Hassle-Free Exchange</span>
              </div>
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="relative z-10 pt-8 mt-8 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Not yet registered with Trends Shop?
            </p>
            <Link
              to="/register"
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors group"
            >
              <span>Create Your Atelier Account</span>
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Column: Luxury Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Form Header */}
            <div className="text-center sm:text-left">
              <img
                src={logo}
                alt="Trends Shop Logo"
                className="h-10 mx-auto sm:mx-0 object-contain mb-3 drop-shadow-sm"
              />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials below to access your account.
              </p>
            </div>

            {/* Quick Demo Fill Buttons (1-Click) */}
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FiShield className="text-amber-500" />
                  Quick Demo Accounts
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">1-Click Auto Fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo("admin@gmail.com", "admin123@#", "Admin")}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>👑 Admin Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("user@gmail.com", "user123@#", "Customer")}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>👤 Customer Demo</span>
                </button>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiMail className="text-base" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/forget-password"
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiLock className="text-base" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Atelier</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Alternative Link */}
            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              New to Trends Shop?{" "}
              <Link
                to="/register"
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
