import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../Redux/Users/userSlice";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import useAuth from "../../../Components/Hooks/useAuth";
import District from "../../../Components/Apis/Distric";
import Division from "../../../Components/Apis/Division";
import useUpZillah from "../../../Components/Apis/upZillah";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";
import { getStoredFavorites } from "../../../Provider/FavoritesContext";
import axios from "axios";
import toast from "../../../Components/Toast/LuxuryToast";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit3,
  FiCheck,
  FiShield,
  FiShoppingBag,
  FiPackage,
  FiHeart,
  FiStar,
  FiAward,
  FiSave,
  FiX,
  FiCompass,
} from "react-icons/fi";
import { RiSparklingFill, RiVipCrownLine } from "react-icons/ri";

const MyProfile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isLoading: isUserLoading, Users = [] } = useSelector(
    (state) => state.Users || {}
  );
  const { RequestPayment = [] } = useSelector(
    (state) => state.RequestPayment || {}
  );
  const { Booked = [] } = useSelector((state) => state.Booked || {});

  const [divisionList] = Division();
  const [districtList] = District();
  const [upZillahList] = useUpZillah();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Current matched profile memoized to prevent infinite re-renders
  const currentUserData = React.useMemo(() => {
    return (
      Users.find((u) => u.email === user?.email) || {
        name: user?.displayName || "Trends Member",
        email: user?.email || "",
      }
    );
  }, [Users, user]);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    gender: "Men",
    number: "",
    divison: "",
    district: "",
    upZillah: "",
    village: "",
    postCode: "",
  });

  // Keep form data in sync with currentUserData
  useEffect(() => {
    if (currentUserData) {
      setFormData({
        name: currentUserData.name || user?.displayName || "",
        gender: currentUserData.gender || "Men",
        number: currentUserData.number || "",
        divison: currentUserData.divison || "",
        district: currentUserData.district || "",
        upZillah: currentUserData.upZillah || "",
        village: currentUserData.village || "",
        postCode: currentUserData.postCode || "",
      });
    }
  }, [currentUserData, user]);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUser(user.email));
      dispatch(fetchRequestPayment(user.email));
      dispatch(fetchBooked(user.email));
    }
  }, [dispatch, user?.email]);

  // Wishlist count from localStorage
  const wishlistCount = getStoredFavorites().length;

  // Active vs completed orders
  const activeOrdersCount = RequestPayment.filter(
    (p) => p.status !== "Completed Order"
  ).length;
  const completedOrdersCount = RequestPayment.filter(
    (p) => p.status === "Completed Order"
  ).length;

  // Cascading dropdown filters
  const selectedDivObj = divisionList.find(
    (d) => d.name === formData.divison
  );
  const filteredDistricts = selectedDivObj
    ? districtList.filter((d) => d.division_id === selectedDivObj.id)
    : [];

  const selectedDistObj = districtList.find(
    (d) => d.name === formData.district
  );
  const filteredUpzillahs = selectedDistObj
    ? upZillahList.filter((u) => u.district_id === selectedDistObj.id)
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Reset dependent selections if division changes
      if (name === "divison") {
        updated.district = "";
        updated.upZillah = "";
      } else if (name === "district") {
        updated.upZillah = "";
      }
      return updated;
    });
  };

  // Profile completeness calculation
  const calculateCompleteness = () => {
    let score = 20; // baseline for created account
    if (formData.name) score += 15;
    if (formData.number) score += 15;
    if (formData.gender) score += 10;
    if (formData.divison) score += 10;
    if (formData.district) score += 10;
    if (formData.village) score += 10;
    if (formData.postCode) score += 10;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        email: user?.email,
        ...formData,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_LOCALHOST_KEY}/users`,
        payload
      );

      if (res.data) {
        toast.success("Your personal details and address were updated.", {
          title: "Profile Saved ✨",
          badge: "VIP Atelier",
        });
        setIsEditing(false);
        if (user?.email) {
          dispatch(fetchUser(user.email));
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile.", {
        title: "Save Failed ✕",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading && !currentUserData.email) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. HERO MEMBERSHIP BANNER */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#111827] to-slate-900 dark:from-[#0B0F19] dark:via-[#111827] dark:to-[#0B0F19] text-white border border-slate-800 shadow-xl">
        {/* Ambient gold glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* User Avatar with Golden Ring */}
            <div className="relative">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-slate-950 font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20">
                {currentUserData?.name
                  ? currentUserData.name.charAt(0).toUpperCase()
                  : "M"}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <FiCheck className="text-white text-[10px] stroke-[4]" />
              </span>
            </div>

            {/* Title & Email */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {currentUserData?.name || "Trends VIP Client"}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <RiVipCrownLine />
                  <span>Atelier Member</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {user?.email}
              </p>
              <p className="text-[11.5px] text-amber-500/90 font-medium">
                Verified Customer Tier • 100% Genuine Leather Guarantee
              </p>
            </div>
          </div>

          {/* Completeness Meter */}
          <div className="flex items-center gap-4 bg-slate-800/60 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/5">
            <div className="text-right">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Profile Completeness
              </p>
              <p className="text-lg font-extrabold text-amber-400">
                {completeness}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              <FiShield className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE ATELIER METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Orders
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activeOrdersCount}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <FiPackage className="text-xl" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed Orders
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {completedOrdersCount}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <FiCheck className="text-xl stroke-[3]" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Saved Wishlist
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {wishlistCount}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <FiHeart className="text-xl" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              VIP Tier Perks
            </p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">
              Free Express Ship
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <FiAward className="text-xl" />
          </div>
        </div>
      </div>

      {/* 3. PROFILE & ADDRESS FORM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personal Information */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <FiUser className="text-base" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Personal Information
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300"
              >
                {isEditing ? (
                  <>
                    <FiX />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <FiEdit3 />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>

            {/* View / Edit Mode Form */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 py-1">
                    {currentUserData.name || "Not provided"}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {user?.email}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <FiCheck />
                    <span>Verified</span>
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 py-1">
                    {currentUserData.number || "Not provided"}
                  </p>
                )}
              </div>

              {/* Gender Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Preferred Department
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  >
                    <option value="Men">Men's Luxury Footwear</option>
                    <option value="Women">Women's Luxury Footwear</option>
                    <option value="Kids">Kids Footwear</option>
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 py-1">
                    {currentUserData.gender || "Men's Luxury Footwear"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Concierge Info Box */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <FiShield className="text-amber-500 text-lg shrink-0" />
            <span>All personal information is protected with end-to-end 256-bit encryption.</span>
          </div>
        </div>

        {/* Right Column: Artisanal Delivery & Shipping Address */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <FiMapPin className="text-base" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Primary Delivery Address
                </h2>
              </div>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <FiCompass />
                <span>Nationwide Express Doorstep</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Division Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Division
                </label>
                <select
                  name="divison"
                  value={formData.divison}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">Select Division</option>
                  {divisionList.map((div) => (
                    <option key={div.id} value={div.name}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  District
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  disabled={!isEditing || !formData.divison}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">Select District</option>
                  {filteredDistricts.map((dist) => (
                    <option key={dist.id} value={dist.name}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila / Police Station Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Upazila / Thana
                </label>
                <select
                  name="upZillah"
                  value={formData.upZillah}
                  onChange={handleInputChange}
                  disabled={!isEditing || !formData.district}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">Select Upazila</option>
                  {filteredUpzillahs.map((upz) => (
                    <option key={upz.id} value={upz.name}>
                      {upz.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g. 1205"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
                />
              </div>

              {/* Street Address / Village */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Street / Area / House / Village
                </label>
                <textarea
                  name="village"
                  rows={2}
                  value={formData.village}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter house, road, apartment, or landmark details"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all resize-none"
                />
              </div>
            </div>

            {/* Save Buttons (Shown only when editing) */}
            {isEditing && (
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSaving ? (
                    <span>Saving Changes...</span>
                  ) : (
                    <>
                      <FiSave />
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Current Address Preview summary */}
          {!isEditing && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
              <FiMapPin className="text-amber-500 text-lg shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-slate-900 dark:text-white">
                  Active Dispatch Destination
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {formData.village
                    ? `${formData.village}, ${formData.upZillah || ""}, ${formData.district || ""}, ${formData.divison || ""} - ${formData.postCode || ""}`
                    : "No primary delivery address set. Click 'Edit Profile' to add your dispatch location."}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default MyProfile;
