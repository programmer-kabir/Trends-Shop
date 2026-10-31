import React, { useEffect, useState, useMemo } from "react";
import Content from "../../../Components/Content/Content";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Radio } from "antd";
import { TbCurrencyTaka } from "react-icons/tb";
import { GoFileDirectoryFill } from "react-icons/go";
import { FiShoppingBag, FiTruck, FiShield, FiTag, FiCheckCircle, FiTrash2, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../Redux/Users/userSlice";
import useAuth from "../../../Components/Hooks/useAuth";
import { useForm } from "react-hook-form";
import { fetchCoupons } from "../../Redux/Coupons/couponsSlice";
import toast from "../../../Components/Toast/LuxuryToast";
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";

const CheckOut = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { Booked = [], isLoading: isBookedLoading } = useSelector((state) => state.Booked || {});
  const { Shoes = [], isLoading: isShoesLoading } = useSelector((state) => state.Shoes || {});
  const { Users = [] } = useSelector((state) => state.Users || {});
  const { Coupons = [] } = useSelector((state) => state.Coupons || {});

  useEffect(() => {
    dispatch(fetchShoes());
    dispatch(fetchCoupons());
    if (user?.email) {
      dispatch(fetchUser(user.email));
      dispatch(fetchBooked(user.email));
    }
  }, [dispatch, user?.email]);

  // Determine items to checkout
  const checkoutItems = useMemo(() => {
    // Case 1: Specific product checkout via /CheckOut/:id
    if (id) {
      const existingBooked = Booked.find((b) => b.productId === id);
      if (existingBooked) {
        const shoe = Shoes.find((s) => s._id === existingBooked.productId);
        return [
          {
            ...existingBooked,
            productName: shoe?.name || existingBooked.productName,
            image: shoe?.mainImage || shoe?.image || existingBooked.image,
            price: Number(existingBooked.price) || Number(shoe?.price) || 0,
            quantity: Number(existingBooked.quantity) || 1,
            size: existingBooked.size || "Standard",
          },
        ];
      }

      // If not yet in Booked, construct from Shoes catalog
      const shoe = Shoes.find((s) => s._id === id);
      if (shoe) {
        const disc = Number(shoe?.Discount) || 0;
        const finalP = disc > 0 ? Math.round(shoe.price - shoe.price * (disc / 100)) : shoe.price;
        return [
          {
            _id: shoe._id,
            productId: shoe._id,
            productName: shoe.name,
            image: shoe.mainImage || shoe.image,
            price: finalP,
            quantity: 1,
            size: "Standard",
          },
        ];
      }
      return [];
    }

    // Case 2: Unified Cart Checkout (all unpaid items in user's shopping bag)
    const unpaidItems = Booked.filter(
      (b) => b.status !== "Completed Order" && b.status !== "Awaiting Check Payment"
    );

    return (unpaidItems.length > 0 ? unpaidItems : Booked).map((b) => {
      const shoe = Shoes.find((s) => s._id === b.productId);
      return {
        ...b,
        productName: shoe?.name || b.productName || "Footwear Article",
        image: shoe?.mainImage || shoe?.image || b.image || "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=400&auto=format&fit=crop",
        price: Number(b.price) || Number(shoe?.price) || 0,
        quantity: Number(b.quantity) || 1,
        size: b.size || "Standard",
      };
    });
  }, [id, Booked, Shoes]);

  const [shippingCost, setShippingCost] = useState(60); // Default to Inside Dhaka (60)
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInput = () => setIsOpen(!isOpen);

  // User profile matching
  const matchingUsers = useMemo(() => {
    return Users.filter((u) => u?.email === user?.email);
  }, [Users, user?.email]);

  const currentUserData = matchingUsers[0] || {};

  const matchUserAddress = currentUserData.village
    ? `${currentUserData.village}, ${currentUserData.upZillah || ""}, ${currentUserData.district || ""}, ${currentUserData.divison || ""} ${currentUserData.postCode || ""}`.trim()
    : "";

  const { handleSubmit, register, formState: { errors } } = useForm();

  // Pricing calculations
  const subTotal = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
  }, [checkoutItems]);

  const discountAmount = discountPercent > 0 ? Math.round(subTotal * (discountPercent / 100)) : 0;
  const totalCostAfterDiscount = Math.max(0, subTotal + shippingCost - discountAmount);

  // Apply Coupon Code
  const handleCouponCode = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const foundCoupon = Coupons.find(
      (c) => c.code?.trim().toUpperCase() === couponCode.trim().toUpperCase()
    );

    if (foundCoupon) {
      setDiscountPercent(Number(foundCoupon.amount) || 0);
      toast.success(`You saved ${foundCoupon.amount}% on this unified order!`, {
        title: "Coupon Applied 🏷️",
        badge: foundCoupon.code,
        amount: `-${foundCoupon.amount}%`,
      });
    } else {
      toast.error("The coupon code entered is invalid or expired.", {
        title: "Invalid Voucher 🏷️",
      });
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    if (checkoutItems.length === 0) {
      toast.warning("Your shopping bag is empty. Please add items to checkout.", {
        title: "Bag Empty 🛍️",
      });
      return;
    }

    if (!data?.transactionID && paymentMethod !== "COD") {
      toast.warning("Please provide your payment transaction ID before proceeding.", {
        title: "Transaction ID Required 💳",
      });
      return;
    }

    if (shippingCost === 0) {
      toast.warning("Please select a shipping location option.", {
        title: "Shipping Option Required 🚚",
      });
      return;
    }

    setIsSubmitting(true);

    const orderDate = new Date().toISOString().split("T")[0];

    const orderPayload = {
      items: checkoutItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        bookedId: item._id,
      })),
      subTotal,
      price: subTotal, // backward compatibility
      shippingCost,
      discount: discountAmount,
      totalAmount: totalCostAfterDiscount,
      name: currentUserData.name || data.name || user?.displayName || "Trends Customer",
      email: user?.email,
      number: currentUserData.number || data.number || "",
      address: currentUserData.village ? matchUserAddress : data.address || "",
      additionalData: data.additionalData || "",
      transactionID: data.transactionID || (paymentMethod === "COD" ? "COD-DIRECT" : "PENDING-VERIFY"),
      paymentMethod,
      couponCode: discountPercent > 0 ? couponCode : null,
      orderDate,
      status: "Awaiting Check Payment",
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/requestPayment`,
        orderPayload
      );

      if (res.data?.paymentResult?.acknowledged || res.data?.paymentResult?.insertedId) {
        toast.success(
          `Order placed successfully! Invoice ${res.data.invoiceId || ""} is awaiting verification.`,
          {
            title: "Order Placed 🎉",
            badge: res.data.invoiceId || "Confirmed",
            amount: `৳ ${totalCostAfterDiscount.toLocaleString()}`,
          }
        );

        if (user?.email) {
          dispatch(fetchBooked(user.email));
          dispatch(fetchRequestPayment(user.email));
        }

        navigate("/user/my_orders");
      } else {
        toast.error("Failed to record order. Please try again or contact concierge.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInitialLoading =
    (isShoesLoading && Shoes.length === 0) ||
    (isBookedLoading && Booked.length === 0 && Boolean(user?.email));

  if (isInitialLoading) {
    return (
      <LoadingSpinner
        message="Preparing Unified Checkout..."
        subMessage="Calculating single delivery fee & packaging summary"
      />
    );
  }

  return (
    <Content>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <FiShoppingBag />
            <span>Unified Checkout Atelier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Review Order & Payment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Flat single delivery charge for all items in your order. Free concierge packaging included.
          </p>
        </div>

        {checkoutItems.length === 0 ? (
          <div className="rounded-3xl p-12 text-center bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <FiShoppingBag className="text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Items to Checkout
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You currently have no footwear pending checkout in your shopping bag.
            </p>
            <div className="pt-2">
              <Link
                to="/products/ALL"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all"
              >
                Explore Footwear Catalog
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Billing & Delivery Details (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer & Delivery Address Card */}
              <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiMapPin className="text-amber-500" />
                    <span>Delivery & Billing Details</span>
                  </h2>
                  <Link
                    to="/user/dashboard"
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Edit Profile Address
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={currentUserData.name || user?.displayName || ""}
                      {...register("name", { required: true })}
                      placeholder="Your Full Name"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={currentUserData.number || ""}
                      {...register("number", { required: true })}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={matchUserAddress || ""}
                    {...register("address", { required: true })}
                    placeholder="House/Road, Village/Area, Upazilla, District, Postal Code"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                {/* Additional Delivery Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Order / Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("additionalData")}
                    placeholder="e.g. Call before arrival, gift packaging request..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              {/* Payment Methods & Instructions Card */}
              <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiShield className="text-amber-500" />
                    <span>Payment Method</span>
                  </h2>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Verified Merchant
                  </span>
                </div>

                {/* Channel Selectors */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "bKash", name: "bKash", bg: "hover:border-pink-500 text-pink-600" },
                    { id: "Nagad", name: "Nagad", bg: "hover:border-orange-500 text-orange-600" },
                    { id: "Rocket", name: "Rocket", bg: "hover:border-purple-500 text-purple-600" },
                    { id: "COD", name: "Cash on Delivery", bg: "hover:border-emerald-500 text-emerald-600" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === m.id
                          ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-sm"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400"
                      } ${m.bg}`}
                    >
                      <span>{m.name}</span>
                      {paymentMethod === m.id && <span className="text-[10px] font-semibold text-amber-600">✓ Selected</span>}
                    </button>
                  ))}
                </div>

                {/* Instructions Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {paymentMethod === "COD" ? (
                      "Cash on Delivery Instructions:"
                    ) : (
                      `Official ${paymentMethod} Payment Instructions:`
                    )}
                  </p>
                  {paymentMethod === "COD" ? (
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      Pay the courier upon inspecting your leather shoes. A token verification call will be placed before dispatch.
                    </p>
                  ) : (
                    <div className="text-slate-500 dark:text-slate-400 space-y-1">
                      <p>
                        1. Please Send Money / Make Payment of <strong>৳ {totalCostAfterDiscount.toLocaleString()}</strong> to Merchant Account:
                      </p>
                      <p className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                        01711-234567 (Trends Atelier)
                      </p>
                      <p>2. Enter your payment Transaction ID below to initiate dispatch verification.</p>
                    </div>
                  )}
                </div>

                {/* Transaction ID Input */}
                {paymentMethod !== "COD" && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Payment Transaction ID (TrxID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("transactionID", { required: paymentMethod !== "COD" })}
                      placeholder="e.g. 9J87X6QW2M"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono uppercase tracking-wider rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Unified Invoice Breakdown (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiShoppingBag className="text-amber-500" />
                    <span>Order Summary</span>
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    {checkoutItems.length} {checkoutItems.length === 1 ? "Item" : "Items"} in Bag
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {checkoutItems.map((item, idx) => {
                    const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                    return (
                      <div
                        key={item._id || idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
                      >
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.productName}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              Size {item.size}
                            </span>
                            <span>•</span>
                            <span>Qty {item.quantity}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                            ৳ {itemTotal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowCoupon(!showCoupon)}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5"
                    >
                      <FiTag />
                      <span>{showCoupon ? "Close Voucher Form" : "Have a Promo Voucher?"}</span>
                    </button>
                    {discountPercent > 0 && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        -{discountPercent}% Applied
                      </span>
                    )}
                  </div>

                  {showCoupon && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter Promo Code"
                        className="flex-1 px-3 py-2 text-xs uppercase font-mono rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleCouponCode}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Shipping Location Selector (Single charge for entire order) */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <FiTruck className="text-amber-500" />
                      <span>Delivery Location (1 Flat Charge)</span>
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      Combined Delivery
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <label
                      onClick={() => setShippingCost(60)}
                      className={`cursor-pointer p-3 rounded-xl border text-xs flex flex-col items-center justify-center gap-0.5 transition ${
                        shippingCost === 60
                          ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span>Inside Dhaka</span>
                      <span className="font-mono text-xs">৳ 60</span>
                    </label>

                    <label
                      onClick={() => setShippingCost(120)}
                      className={`cursor-pointer p-3 rounded-xl border text-xs flex flex-col items-center justify-center gap-0.5 transition ${
                        shippingCost === 120
                          ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span>Outside Dhaka</span>
                      <span className="font-mono text-xs">৳ 120</span>
                    </label>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Footwear Subtotal ({checkoutItems.length} items)</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ৳ {subTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Unified Courier Dispatch Fee</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ৳ {shippingCost}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Voucher Discount (-{discountPercent}%)</span>
                      <span>-৳ {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <span>Total Amount Payable</span>
                    <span className="text-amber-600 dark:text-amber-400 text-lg">
                      ৳ {totalCostAfterDiscount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 text-sm active:scale-98 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Placing Order..." : "Confirm & Place Order"}</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Official Trends Concierge • Immediate Dispatch Verification
                  </p>
                </div>

              </div>

            </div>

          </form>
        )}

      </div>
    </Content>
  );
};

export default CheckOut;
