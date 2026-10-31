import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { fetchCoupons } from "../../Redux/Coupons/couponsSlice";
import { fetchUser } from "../../Redux/Users/userSlice";
import useAxiosSecure from "../../../Components/Hooks/useAxiosSecure";
import toast from "../../../Components/Toast/LuxuryToast";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiTag,
  FiSend,
  FiSearch,
  FiCopy,
  FiMail,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiDollarSign,
  FiExternalLink,
  FiGift,
  FiPercent,
  FiCalendar,
  FiRefreshCw,
  FiLayers,
  FiAward,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";
import axios from "axios";

const AbandonedCarts = () => {
  const dispatch = useDispatch();
  const [axiosSecure] = useAxiosSecure();

  const { Shoes = [], isLoading: isShoesLoading } = useSelector(
    (state) => state.Shoes || {}
  );
  const { Coupons = [], isLoading: isCouponsLoading } = useSelector(
    (state) => state.Coupons || {}
  );
  const { Users = [] } = useSelector((state) => state.Users || {});

  const [bookedData, setBookedData] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const [isLoadingBooked, setIsLoadingBooked] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'abandoned', 'pending', 'fulfilled'
  const [activeTab, setActiveTab] = useState("carts"); // 'carts' or 'history'

  // Modal State for Making an Offer
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [offerDiscount, setOfferDiscount] = useState(15);
  const [offerCode, setOfferCode] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerExpiryDays, setOfferExpiryDays] = useState(7);
  const [useExistingCoupon, setUseExistingCoupon] = useState(false);
  const [selectedExistingCode, setSelectedExistingCode] = useState("");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // Fetch all booked items, shoes, coupons, and cart offers
  const fetchAllData = async () => {
    setIsLoadingBooked(true);
    try {
      const bookedRes = await axios.get(
        `${import.meta.env.VITE_LOCALHOST_KEY}/userBookedData`
      );
      setBookedData(bookedRes.data || []);

      const offersRes = await axiosSecure.get("/cartOffers").catch(() => ({ data: [] }));
      setSentOffers(offersRes.data || []);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      toast.error("Failed to load customer cart records");
    } finally {
      setIsLoadingBooked(false);
    }
  };

  useEffect(() => {
    dispatch(fetchShoes());
    dispatch(fetchCoupons());
    dispatch(fetchUser());
    fetchAllData();
  }, [dispatch]);

  // Enrich cart items with matching shoe, user details, and computed status
  const enrichedCartItems = useMemo(() => {
    return bookedData.map((item) => {
      const matchingShoe = Shoes.find((s) => s._id === item.productId);
      const matchingUser = Users.find(
        (u) => u.email?.toLowerCase() === item.email?.toLowerCase()
      );

      // Determine cart status
      // If status is empty, or "Awaiting Check Payment" / "Transition ID Error", it's abandoned/pending checkout
      let normalizedStatus = "In Cart (Awaiting Checkout)";
      let statusType = "abandoned"; // abandoned, pending, fulfilled

      if (item.status === "Completed Order") {
        normalizedStatus = "Completed & Delivered";
        statusType = "fulfilled";
      } else if (item.status === "Delivery") {
        normalizedStatus = "Out for Delivery";
        statusType = "fulfilled";
      } else if (item.status === "Receive Payment") {
        normalizedStatus = "Payment Received (Processing)";
        statusType = "pending";
      } else if (item.status === "Awaiting Check Payment") {
        normalizedStatus = "Checkout Attempted (Unpaid)";
        statusType = "abandoned";
      } else if (item.status === "Transition ID Error") {
        normalizedStatus = "Payment Failed (Requires Offer)";
        statusType = "abandoned";
      }

      const unitPrice = Number(item.price) || Number(matchingShoe?.price) || 0;
      const qty = Number(item.quantity) || 1;
      const disc = Number(item.discount) || Number(matchingShoe?.Discount) || 0;
      const finalUnitPrice = disc > 0 ? unitPrice - (unitPrice * disc) / 100 : unitPrice;
      const subtotal = finalUnitPrice * qty;

      // Check if offer was already sent
      const hasOffer = sentOffers.some(
        (o) =>
          o.customerEmail?.toLowerCase() === item.email?.toLowerCase() &&
          (o.productId === item.productId || o.productName === item.productName)
      );

      return {
        ...item,
        shoeDetails: matchingShoe,
        userDetails: matchingUser,
        customerName: matchingUser?.name || item.name || item.email?.split("@")[0] || "Customer",
        customerEmail: item.email || "No email",
        productImage:
          matchingShoe?.mainImage ||
          matchingShoe?.image ||
          "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
        displayCategory: matchingShoe?.category || "Footwear",
        normalizedStatus,
        statusType,
        unitPrice,
        finalUnitPrice,
        qty,
        discount: disc,
        subtotal,
        hasOffer,
      };
    });
  }, [bookedData, Shoes, Users, sentOffers]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const abandonedItems = enrichedCartItems.filter((i) => i.statusType === "abandoned");
    const potentialRevenue = abandonedItems.reduce((acc, i) => acc + i.subtotal, 0);
    const uniqueShoppers = new Set(abandonedItems.map((i) => i.customerEmail.toLowerCase())).size;

    return {
      totalCartItems: bookedData.length,
      abandonedCount: abandonedItems.length,
      potentialRevenue,
      uniqueShoppers,
      offersSentCount: sentOffers.length,
    };
  }, [enrichedCartItems, bookedData, sentOffers]);

  // Filtered List
  const filteredCarts = useMemo(() => {
    return enrichedCartItems.filter((item) => {
      // Status filter
      if (statusFilter !== "all" && item.statusType !== statusFilter) {
        return false;
      }

      // Search query
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        item.customerEmail.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        (item.productName && item.productName.toLowerCase().includes(q)) ||
        (item.invoiceId && item.invoiceId.toLowerCase().includes(q))
      );
    });
  }, [enrichedCartItems, statusFilter, searchTerm]);

  // Open Offer Modal
  const handleOpenOfferModal = (cartItem) => {
    setSelectedCartItem(cartItem);
    const emailPrefix = cartItem.customerEmail.split("@")[0].toUpperCase().slice(0, 5);
    const defaultCode = `VIP${offerDiscount}-${emailPrefix}`;
    setOfferCode(defaultCode);
    setUseExistingCoupon(false);
    setSelectedExistingCode("");

    const previewMsg = `Hello ${cartItem.customerName}, we noticed you have ${
      cartItem.productName || "Luxury Footwear"
    } reserved in your cart at Trends Shop. Here is an exclusive ${offerDiscount}% discount voucher: ${defaultCode} to complete your order today! Valid for ${offerExpiryDays} days.`;
    setOfferMessage(previewMsg);
  };

  // Update offer code & message when discount changes
  const handleDiscountChange = (discountVal) => {
    setOfferDiscount(discountVal);
    if (selectedCartItem) {
      const emailPrefix = selectedCartItem.customerEmail.split("@")[0].toUpperCase().slice(0, 5);
      const newCode = `VIP${discountVal}-${emailPrefix}`;
      setOfferCode(newCode);

      const previewMsg = `Hello ${selectedCartItem.customerName}, we noticed you have ${
        selectedCartItem.productName || "Luxury Footwear"
      } reserved in your cart at Trends Shop. Here is an exclusive ${discountVal}% discount voucher: ${newCode} to complete your order today! Valid for ${offerExpiryDays} days.`;
      setOfferMessage(previewMsg);
    }
  };

  // Dispatch & Record Offer
  const handleSendOffer = async () => {
    if (!selectedCartItem) return;
    setIsSubmittingOffer(true);

    try {
      const finalCode = useExistingCoupon ? selectedExistingCode : offerCode.trim().toUpperCase();

      if (!finalCode) {
        toast.warning("Please specify or select a valid coupon code.");
        setIsSubmittingOffer(false);
        return;
      }

      // If generating new coupon, save to couponCollection first
      if (!useExistingCoupon) {
        const startDate = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Number(offerExpiryDays));
        const endDate = futureDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const newCouponPayload = {
          name: `VIP Cart Recovery: ${selectedCartItem.customerEmail}`,
          amount: Number(offerDiscount),
          start: startDate,
          star: startDate,
          end: endDate,
          code: finalCode,
          image: selectedCartItem.productImage,
        };

        await axiosSecure.post("/couponCode", newCouponPayload).catch((err) => {
          // If coupon already exists, continue so offer is recorded
          console.warn("Coupon may already exist:", err);
        });
      }

      // Save Offer Record
      const offerPayload = {
        customerEmail: selectedCartItem.customerEmail,
        customerName: selectedCartItem.customerName,
        productId: selectedCartItem.productId,
        productName: selectedCartItem.productName,
        productImage: selectedCartItem.productImage,
        couponCode: finalCode,
        discount: useExistingCoupon
          ? Coupons.find((c) => c.code === finalCode)?.amount || offerDiscount
          : offerDiscount,
        message: offerMessage,
        cartSubtotal: selectedCartItem.subtotal,
      };

      await axiosSecure.post("/cartOffers", offerPayload);

      toast.success(
        `Exclusive offer "${finalCode}" successfully activated for ${selectedCartItem.customerEmail}!`,
        {
          title: "Offer Dispatched 🎁",
          badge: finalCode,
          amount: `${offerDiscount}% OFF`,
        }
      );

      setSelectedCartItem(null);
      dispatch(fetchCoupons());
      fetchAllData();
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Could not record targeted offer. Please try again.");
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  // Copy offer message to clipboard
  const handleCopyMessage = () => {
    try {
      navigator.clipboard.writeText(offerMessage);
      toast.success("Personalized offer message copied to clipboard!", {
        title: "Message Copied 📋",
      });
    } catch (e) {
      toast.info(offerMessage);
    }
  };

  // Copy text helper
  const handleCopyText = (text, label) => {
    try {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`, {
        title: "Copied 📋",
        badge: label,
      });
    } catch (e) {
      toast.info(text);
    }
  };

  const isInitialLoading =
    (isLoadingBooked && bookedData.length === 0) ||
    (isShoesLoading && Shoes.length === 0);

  if (isInitialLoading) {
    return (
      <LoadingSpinner
        message="Loading Cart Intelligence..."
        subMessage="Analyzing shopper bag activities & bespoke offer history"
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0c0f17] text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER & SWITCH TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              <span>Admin Management</span>
              <span>/</span>
              <span>Cart Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <FiShoppingCart className="w-6 h-6" />
              </span>
              Customer Carts & Targeted Offers
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              See who has placed luxury footwear in their cart and dispatch exclusive personalized discount coupons to convert abandoned carts into sales.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("carts")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === "carts"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <FiShoppingCart className="w-4 h-4" />
              <span>Live Carts ({filteredCarts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === "history"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <FiAward className="w-4 h-4" />
              <span>Sent Offers History ({sentOffers.length})</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pending / Abandoned Carts
              </span>
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FiAlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.abandonedCount}
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold ml-2">
                Awaiting Checkout
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Potential Cart Revenue
              </span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FiDollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ৳{metrics.potentialRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 ml-2">BDT at Stake</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Shoppers to Re-engage
              </span>
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FiUser className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.uniqueShoppers}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                Unique Customer Accounts
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Exclusive Offers Sent
              </span>
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <FiGift className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.offersSentCount}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold ml-2">
                Coupons Dispatched
              </span>
            </div>
          </div>
        </div>

        {/* TAB 1: LIVE CARTS */}
        {activeTab === "carts" && (
          <div className="space-y-4">
            {/* SEARCH & FILTER CONTROLS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#141824] p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by customer email, name, footwear title, or invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 self-center">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    statusFilter === "all"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All ({enrichedCartItems.length})
                </button>
                <button
                  onClick={() => setStatusFilter("abandoned")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    statusFilter === "abandoned"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500"
                  }`}
                >
                  Pending / In Cart ({metrics.abandonedCount})
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    statusFilter === "pending"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-500"
                  }`}
                >
                  Payment Review
                </button>
                <button
                  onClick={() => setStatusFilter("fulfilled")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    statusFilter === "fulfilled"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500"
                  }`}
                >
                  Fulfilled
                </button>
              </div>
            </div>

            {/* CARTS TABLE / LIST */}
            {filteredCarts.length === 0 ? (
              <div className="bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                  <FiShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No Cart Items Found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {searchTerm
                    ? "No customer cart items match your search keyword."
                    : "There are currently no items in customer shopping carts."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCarts.map((item, index) => {
                  return (
                    <div
                      key={item._id || index}
                      className="group bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                        {/* 1. Shopper Info */}
                        <div className="flex items-center gap-3.5 min-w-[220px]">
                          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-base flex-shrink-0">
                            {item.customerName[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white truncate">
                              {item.customerName}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-mono truncate">{item.customerEmail}</span>
                              <button
                                onClick={() => handleCopyText(item.customerEmail, "Email")}
                                className="text-slate-400 hover:text-amber-500 transition"
                                title="Copy Email"
                              >
                                <FiCopy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 2. Footwear Details */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-[280px]">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex-shrink-0">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop";
                              }}
                            />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {item.displayCategory}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              <Link
                                to={`/product-details/${item.productId}`}
                                className="hover:text-amber-500 transition"
                              >
                                {item.productName || "Luxury Footwear"}
                              </Link>
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                              <span>
                                Size:{" "}
                                <strong className="text-slate-700 dark:text-slate-200">
                                  {Array.isArray(item.size) ? item.size.join(", ") : item.size || "EU 42"}
                                </strong>
                              </span>
                              <span>•</span>
                              <span>
                                Qty: <strong className="text-slate-700 dark:text-slate-200">{item.qty}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Subtotal & Status */}
                        <div className="min-w-[150px] lg:text-right">
                          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                            Cart Value
                          </div>
                          <div className="text-lg font-black text-slate-900 dark:text-white">
                            ৳{item.subtotal.toLocaleString()}
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                item.statusType === "abandoned"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse"
                                  : item.statusType === "pending"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{item.normalizedStatus}</span>
                            </span>
                          </div>
                        </div>

                        {/* 4. Action: Make Special Offer */}
                        <div className="flex items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                          {item.hasOffer && (
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                              <FiGift className="w-3 h-3" />
                              <span>Offer Sent</span>
                            </span>
                          )}

                          <button
                            onClick={() => handleOpenOfferModal(item)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm shadow-amber-500/20 transition flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <FiGift className="w-3.5 h-3.5" />
                            <span>{item.hasOffer ? "Send Another Offer" : "Make Exclusive Offer"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SENT OFFERS HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {sentOffers.length === 0 ? (
              <div className="bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/10 text-purple-500 dark:text-purple-400 flex items-center justify-center">
                  <FiGift className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No Targeted Offers Sent Yet
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Click on "Make Exclusive Offer" next to any customer cart item to generate a personalized discount voucher.
                </p>
                <button
                  onClick={() => setActiveTab("carts")}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition"
                >
                  View Active Customer Carts
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Targeted Footwear</th>
                        <th className="p-4">Coupon Code</th>
                        <th className="p-4">Discount</th>
                        <th className="p-4">Cart Value</th>
                        <th className="p-4">Dispatched At</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {sentOffers.map((offer, idx) => (
                        <tr
                          key={offer._id || idx}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                        >
                          <td className="p-4 font-semibold text-slate-900 dark:text-white">
                            <div>{offer.customerName}</div>
                            <div className="text-slate-400 font-mono text-[11px]">{offer.customerEmail}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                              {offer.productName}
                            </div>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleCopyText(offer.couponCode, "Coupon Code")}
                              className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono font-bold border border-amber-500/20 flex items-center gap-1.5"
                            >
                              <span>{offer.couponCode}</span>
                              <FiCopy className="w-3 h-3 opacity-60" />
                            </button>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                              {offer.discount}% OFF
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-white">
                            ৳{Number(offer.cartSubtotal || 0).toLocaleString()}
                          </td>
                          <td className="p-4 text-slate-500 dark:text-slate-400">
                            {offer.createdAt
                              ? new Date(offer.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Recently"}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleCopyText(offer.message, "Offer Message")}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition"
                              title="Copy Message"
                            >
                              <FiCopy className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MAKE EXCLUSIVE OFFER MODAL */}
        {selectedCartItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#111622] text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-scaleIn max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Personalized Promo Incentive
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    Make Exclusive Offer for {selectedCartItem.customerName}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Customer Email: <strong className="font-mono text-slate-700 dark:text-slate-300">{selectedCartItem.customerEmail}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCartItem(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  ✕
                </button>
              </div>

              {/* Target Footwear Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4">
                <img
                  src={selectedCartItem.productImage}
                  alt={selectedCartItem.productName}
                  className="w-16 h-16 rounded-xl object-cover bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {selectedCartItem.productName}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Size: {Array.isArray(selectedCartItem.size) ? selectedCartItem.size.join(", ") : selectedCartItem.size || "EU 42"} • Qty: {selectedCartItem.qty}
                  </div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 pt-0.5">
                    Current Cart Price: ৳{selectedCartItem.subtotal.toLocaleString()} BDT
                  </div>
                </div>
              </div>

              {/* Offer Creation Mode */}
              <div className="space-y-4 text-xs">
                {/* Choose Mode: Generate New vs Select Existing */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setUseExistingCoupon(false)}
                    className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                      !useExistingCoupon
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500"
                    }`}
                  >
                    Generate Custom Promo Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUseExistingCoupon(true);
                      if (Coupons.length > 0 && !selectedExistingCode) {
                        setSelectedExistingCode(Coupons[0].code);
                      }
                    }}
                    className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                      useExistingCoupon
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500"
                    }`}
                  >
                    Select Active Store Coupon
                  </button>
                </div>

                {!useExistingCoupon ? (
                  <div className="space-y-3">
                    {/* Quick Discount Percent Pills */}
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1.5">
                        Select Incentive Discount:
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[10, 15, 20, 25].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleDiscountChange(pct)}
                            className={`py-2 rounded-xl font-bold transition border ${
                              offerDiscount === pct
                                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-500"
                            }`}
                          >
                            {pct}% OFF
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Promo Code & Expiry Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                          Generated Promo Voucher:
                        </label>
                        <input
                          type="text"
                          value={offerCode}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            setOfferCode(val);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-mono font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                          Valid for (Days):
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={offerExpiryDays}
                          onChange={(e) => setOfferExpiryDays(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1.5">
                      Choose from Active Coupons:
                    </label>
                    <select
                      value={selectedExistingCode}
                      onChange={(e) => {
                        setSelectedExistingCode(e.target.value);
                        const c = Coupons.find((item) => item.code === e.target.value);
                        if (c) {
                          setOfferDiscount(c.amount || 10);
                          setOfferMessage(
                            `Hello ${selectedCartItem.customerName}, we noticed you have ${
                              selectedCartItem.productName || "Luxury Footwear"
                            } in your cart. Use our special code ${c.code} to get ${c.amount}% off your bespoke order at Trends Shop!`
                          );
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-mono focus:outline-none focus:border-amber-500"
                    >
                      {Coupons.map((c) => (
                        <option key={c._id} value={c.code}>
                          {c.code} — {c.amount}% OFF ({c.name})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Offer Message Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-500 dark:text-slate-400 font-semibold">
                      Personalized Customer Message:
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <FiCopy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                {/* Email Direct Trigger */}
                <a
                  href={`mailto:${selectedCartItem.customerEmail}?subject=${encodeURIComponent(
                    `Special Offer: Complete your order for ${selectedCartItem.productName}`
                  )}&body=${encodeURIComponent(offerMessage)}`}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <FiMail className="w-3.5 h-3.5" />
                  <span>Open Email Client</span>
                </a>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedCartItem(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isSubmittingOffer}
                    onClick={handleSendOffer}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <FiSend className="w-3.5 h-3.5" />
                    <span>{isSubmittingOffer ? "Activating..." : "Activate & Record Offer"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbandonedCarts;
