import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import useAuth from "../../../Components/Hooks/useAuth";
import { Link } from "react-router-dom";
import toast from "../../../Components/Toast/LuxuryToast";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";
import {
  FiCheckCircle,
  FiShoppingBag,
  FiCopy,
  FiExternalLink,
  FiSearch,
  FiCalendar,
  FiAward,
  FiStar,
  FiRefreshCw,
  FiFileText,
  FiChevronRight,
  FiArrowRight,
  FiShield,
  FiPrinter,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const CompletedOrders = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const { Shoes = [], isLoading: isShoesLoading } = useSelector(
    (state) => state.Shoes || {}
  );
  const { RequestPayment = [], isLoading: isPaymentLoading } = useSelector(
    (state) => state.RequestPayment || {}
  );
  const { Booked = [], isLoading: isBookedLoading } = useSelector(
    (state) => state.Booked || {}
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    dispatch(fetchShoes());
    if (user?.email) {
      dispatch(fetchRequestPayment(user.email));
      dispatch(fetchBooked(user.email));
    }
  }, [dispatch, user?.email]);

  const isInitialLoading =
    (isShoesLoading && Shoes.length === 0) ||
    (isBookedLoading && Booked.length === 0 && Boolean(user?.email));

  // Combine Booked & RequestPayment items for completed orders
  const completedOrders = useMemo(() => {
    const list = [];
    const seenIds = new Set();

    // 1. Process from Booked items marked Completed
    Booked.forEach((item) => {
      const matchingShoe = Shoes.find((s) => s._id === item.productId);
      const matchingPayment = RequestPayment.find(
        (p) => p.bookedId === item._id || p._id === item._id || (p.productId && p.productId === item.productId)
      );

      const status = matchingPayment?.status || item.status;
      if (status === "Completed Order") {
        seenIds.add(item._id);
        const finalPrice = item.price || matchingShoe?.price || 0;
        const discount = item.discount || matchingShoe?.Discount || 0;
        const paidAmount = discount > 0 ? finalPrice - (finalPrice * discount) / 100 : finalPrice;
        const qty = item.quantity || 1;

        list.push({
          _id: item._id,
          productId: item.productId,
          name: matchingShoe?.name || item.productName || "Luxury Handcrafted Footwear",
          image: matchingShoe?.mainImage || matchingShoe?.image || "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
          category: matchingShoe?.category || "Footwear",
          size: item.size,
          quantity: qty,
          unitPrice: finalPrice,
          paidTotal: paidAmount * qty,
          discount: discount,
          status: "Completed Order",
          invoiceId: matchingPayment?.invoiceId || item.invoiceId || `INV-${item._id?.slice(-6).toUpperCase()}`,
          transactionID: matchingPayment?.transactionID || null,
          orderDate: matchingPayment?.orderDate || "Past Order",
          deliveryDate: matchingPayment?.deliveryDate || "Successfully Delivered",
          shippingCost: matchingPayment?.shippingCost || 0,
          address: matchingPayment?.address || "Atelier Doorstep",
        });
      }
    });

    // 2. Also check any RequestPayment with Completed Order that might not be in Booked
    RequestPayment.forEach((p) => {
      if (p.status === "Completed Order" && !seenIds.has(p._id) && !seenIds.has(p.bookedId)) {
        const matchingShoe = Shoes.find((s) => s._id === p.productId);
        const qty = p.quantity || 1;
        const price = p.price || matchingShoe?.price || 0;

        list.push({
          _id: p._id,
          productId: p.productId,
          name: matchingShoe?.name || p.productName || "Luxury Handcrafted Footwear",
          image: matchingShoe?.mainImage || matchingShoe?.image || "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
          category: matchingShoe?.category || "Footwear",
          size: p.size,
          quantity: qty,
          unitPrice: price,
          paidTotal: price * qty,
          discount: p.discount || matchingShoe?.Discount || 0,
          status: "Completed Order",
          invoiceId: p.invoiceId || `INV-${p._id?.slice(-6).toUpperCase()}`,
          transactionID: p.transactionID || null,
          orderDate: p.orderDate || "Past Order",
          deliveryDate: p.deliveryDate || "Successfully Delivered",
          shippingCost: p.shippingCost || 0,
          address: p.address || "Atelier Doorstep",
        });
      }
    });

    return list;
  }, [Booked, RequestPayment, Shoes]);

  // Aggregate stats
  const totalSpent = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (Number(o.paidTotal) || 0), 0);
  }, [completedOrders]);

  const loyaltyPoints = Math.floor(totalSpent / 100);

  const filteredOrders = completedOrders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.invoiceId.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q)
    );
  });

  const handleCopy = (text, label) => {
    try {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`, {
        title: "Copied 📋",
        badge: label,
        duration: 2500,
      });
    } catch (err) {
      toast.info(`Invoice ID: ${text}`, { title: "Invoice Details" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isInitialLoading) {
    return (
      <LoadingSpinner
        message="Loading Order History..."
        subMessage="Retrieving past bespoke deliveries and invoices"
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0c0f17] text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* TOP BREADCRUMB & HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              <Link to="/user/dashboard" className="hover:underline">
                Portal
              </Link>
              <span>/</span>
              <span>Purchase History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <FiCheckCircle className="w-6 h-6" />
              </span>
              Completed Purchases
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Verified records of your luxury footwear acquisitions, authentic receipts, and reviews.
            </p>
          </div>

          {/* Quick Route Switches */}
          <div className="flex items-center gap-2">
            <Link
              to="/user/my_orders"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-2 shadow-xs"
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>Active Shipments</span>
            </Link>
            <Link
              to="/products"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
            >
              <RiSparklingFill className="w-4 h-4" />
              <span>Explore Atelier</span>
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Delivered Orders
              </span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {completedOrders.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">Pairs Acquired</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Value Invested
              </span>
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FiAward className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ৳{totalSpent.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">BDT</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Atelier Loyalty
              </span>
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <RiSparklingFill className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {loyaltyPoints}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">VIP Points</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Patron Status
              </span>
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FiShield className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {completedOrders.length > 3 ? "Diamond Connoisseur" : completedOrders.length > 0 ? "Gold Patron" : "Verified Client"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#141824] p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by footwear title, invoice ID, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 flex items-center gap-1.5 self-center">
            <span>Showing:</span>
            <span className="text-slate-900 dark:text-white font-bold">{filteredOrders.length}</span>
            <span>of {completedOrders.length} completed</span>
          </div>
        </div>

        {/* ORDERS LIST / CARDS */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
              <FiCheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {completedOrders.length === 0
                ? "No Completed Purchases Yet"
                : "No orders match your search criteria"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {completedOrders.length === 0
                ? "Once an order reaches your doorstep and is marked completed by our delivery team, it will appear here with full invoice access and verified review options."
                : "Try clearing your search term or searching with a different keyword."}
            </p>
            {completedOrders.length === 0 ? (
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  to="/user/my_orders"
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Check Active Shipments
                </Link>
                <Link
                  to="/products"
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-white transition shadow-sm"
                >
                  Shop Footwear Collection
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="group bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex-shrink-0">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                      <span className="absolute bottom-1 right-1 p-1 rounded-md bg-emerald-500 text-white text-[10px] shadow-xs">
                        <FiCheckCircle />
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <FiCheckCircle className="w-3 h-3" />
                          <span>Delivered & Verified</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {order.category}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                        <Link
                          to={`/product-details/${order.productId}`}
                          className="hover:text-amber-500 transition"
                        >
                          {order.name}
                        </Link>
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          Size: <strong className="text-slate-700 dark:text-slate-200">{order.size || "EU 42"}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Qty: <strong className="text-slate-700 dark:text-slate-200">{order.quantity}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-slate-400" />
                          {order.deliveryDate}
                        </span>
                      </div>

                      {/* Invoice & Transaction meta */}
                      <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                        <button
                          onClick={() => handleCopy(order.invoiceId, "Invoice ID")}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px] hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1.5"
                          title="Click to copy invoice ID"
                        >
                          <span>{order.invoiceId}</span>
                          <FiCopy className="w-3 h-3 opacity-60" />
                        </button>

                        {order.transactionID && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            Trx: {order.transactionID}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Price & Savings */}
                  <div className="lg:text-right border-t lg:border-t-0 border-slate-100 dark:border-slate-800/80 pt-3 lg:pt-0 w-full lg:w-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Amount Paid
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      ৳{Number(order.paidTotal).toLocaleString()}
                    </div>
                    {order.discount > 0 && (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Saved {order.discount}% with VIP promo
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col lg:flex-row items-center gap-2 w-full lg:w-auto justify-end">
                    {/* View Invoice Modal trigger */}
                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-1.5"
                    >
                      <FiFileText className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>

                    {/* Write Review Link */}
                    <Link
                      to={`/product-details/${order.productId}#reviews`}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition flex items-center justify-center gap-1.5"
                    >
                      <FiStar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Review</span>
                    </Link>

                    {/* Reorder Footwear */}
                    <Link
                      to={`/product-details/${order.productId}`}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <FiRefreshCw className="w-3.5 h-3.5" />
                      <span>Buy Again</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LUXURY RECEIPT PREVIEW MODAL */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#111622] text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-scaleIn">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      Official Atelier Receipt
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    Trends Shop Invoice
                  </h2>
                  <p className="text-xs font-mono text-slate-400">{selectedInvoice.invoiceId}</p>
                </div>

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  ✕
                </button>
              </div>

              {/* Receipt Body */}
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {user?.displayName || "Valued Client"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Address:</span>
                    <span className="text-slate-700 dark:text-slate-300 text-right max-w-[200px] truncate">
                      {selectedInvoice.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Completed On:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedInvoice.deliveryDate}</span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
                  <div className="p-3 flex items-center justify-between font-semibold bg-slate-50 dark:bg-slate-900/60 text-slate-500">
                    <span>Footwear Item</span>
                    <span>Subtotal</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {selectedInvoice.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Size: {selectedInvoice.size || "EU 42"} × {selectedInvoice.quantity}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      ৳{Number(selectedInvoice.paidTotal).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Standard Express Shipping:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Settled:</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      ৳{Number(selectedInvoice.paidTotal).toLocaleString()} BDT
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
                >
                  <FiPrinter className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;
