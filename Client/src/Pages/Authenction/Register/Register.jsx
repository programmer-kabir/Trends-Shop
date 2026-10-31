import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/LOGO/LOGO.png";
import useAuth from "../../../Components/Hooks/useAuth";
import toast from "../../../Components/Toast/LuxuryToast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const Register = () => {
  const { RegisterUser, updateUserProfile, setLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.warning("Please complete all required fields.", {
        title: "Incomplete Form ⚠️",
      });
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters.", {
        title: "Weak Password ⚠️",
      });
      return;
    }

    if (!agreeTerms) {
      toast.warning("Please accept the Atelier terms and privacy policy.", {
        title: "Terms Required ⚠️",
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const result = await RegisterUser(email.trim(), password);
      const user = result.user;

      await updateUserProfile(name.trim());

      const currentUser = {
        name: name.trim(),
        email: user?.email,
      };

      const apiBase = import.meta.env.VITE_LOCALHOST_KEY || "http://localhost:5000";
      const res = await fetch(`${apiBase}/users`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(currentUser),
      });

      await res.json();

      toast.success(`Welcome to Trends Shop Atelier, ${name.trim()}!`, {
        title: "Registration Successful 🎉",
        badge: "New VIP Member",
      });

      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to create account.", {
        title: "Registration Failed ✕",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 md:py-16 px-4 flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] transition-colors relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.7)] bg-white/90 dark:bg-[#111827]/90 backdrop-blur-2xl relative z-10">
        
        {/* Left Column: Brand & Atelier Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#0E1526] to-[#0B0F19] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <RiSparklingFill className="text-sm" />
              <span>Trends Atelier VIP Club</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-luxury text-slate-100">
                Begin Your <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  Bespoke Journey.
                </span>
              </h2>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Join our exclusive circle of discerning leather footwear enthusiasts. Experience handcrafted excellence, tailored fits, and nationwide express doorstep delivery.
              </p>
            </div>

            {/* Privilege points */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <FiCheck className="stroke-[3]" />
                </div>
                <span>Welcome VIP Gift: 10% Off First Acquisition</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <FiCheck className="stroke-[3]" />
                </div>
                <span>Priority Access to Limited-Run Collections</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <FiCheck className="stroke-[3]" />
                </div>
                <span>24/7 Dedicated Footwear Concierge Support</span>
              </div>
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="relative z-10 pt-8 mt-8 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors group"
            >
              <span>Sign In to Existing Account</span>
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Column: Luxury Register Form */}
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
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Fill in your details below to activate your VIP membership.
              </p>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiUser className="text-base" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Address Input */}
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiLock className="text-base" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
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

              {/* Terms Checkbox */}
              <div className="pt-1 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500/40 cursor-pointer accent-amber-500"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
                  I agree to the Trends Shop{" "}
                  <span className="text-amber-600 dark:text-amber-400 font-semibold underline">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-amber-600 dark:text-amber-400 font-semibold underline">
                    Privacy Policy
                  </span>
                  .
                </label>
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
                    <span>Creating Atelier Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register Account</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Alternative Link */}
            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
