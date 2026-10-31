import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import useAuth from "../../../Components/Hooks/useAuth";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "../../../Components/Toast/LuxuryToast";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";
import InvoiceModal from "../../../Components/Invoice/InvoiceModal";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiShoppingBag,
  FiCopy,
  FiExternalLink,
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiAlertCircle,
  FiCreditCard,
  FiArrowRight,
  FiTrash2,
  FiPrinter,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const MyOrders = () => {
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

  // Only show blocking loader if initial data hasn't arrived yet
  const isInitialLoading =
    (isShoesLoading && Shoes.length === 0) ||
    (isBookedLoading && Booked.length === 0 && Boolean(user?.email));

  // Combine Booked & RequestPayment items for active / in-progress orders
  const activeOrders = useMemo(() => {
    // Collect from Booked
    const list = Booked.map((item) => {
      const matchingShoe = Shoes.find((s) => s._id === item.productId);
      const matchingPayment = RequestPayment.find((p) => {
        if (p.bookedId === item._id || p._id === item._id) return true;
        if (p.invoiceId && item.invoiceId && p.invoiceId === item.invoiceId) return true;
        if (
          Array.isArray(p.items) &&
          p.items.some(
            (it) => it.bookedId === item._id || it.productId === item.productId
          )
        ) {
          return true;
        }
        return false;
      });

      const isCartItem = !matchingPayment;

      return {
        _id: item._id,
        productId: item.productId,
        name: matchingShoe?.name || item.productName || "Luxury Handcrafted Footwear",
        image: matchingShoe?.mainImage || matchingShoe?.image || "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
        category: matchingShoe?.category || "Footwear",
        size: item.size,
        quantity: item.quantity || 1,
        price: item.price || matchingShoe?.price || 0,
        discount: item.discount || matchingShoe?.Discount || 0,
        isCartItem,
        status: matchingPayment?.status || (isCartItem ? "In Bag (Checkout Pending)" : item.status || "Pending"),
        invoiceId: matchingPayment?.invoiceId || (isCartItem ? "BAG-ITEM" : item.invoiceId || `INV-${item._id?.slice(-6).toUpperCase()}`),
        transactionID: matchingPayment?.transactionID || null,
        orderDate: matchingPayment?.orderDate || "Added to Bag",
        deliveryDate: matchingPayment?.deliveryDate || (isCartItem ? "Pending Checkout" : "Calculating dispatch..."),
        shippingCost: matchingPayment?.shippingCost || 0,
        address: matchingPayment?.address || "Atelier Doorstep",
        paymentRecord: matchingPayment || null,
      };
    }).filter((order) => order.status !== "Completed Order");

    return list;
  }, [Booked, RequestPayment, Shoes]);

  const filteredOrders = activeOrders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.invoiceId.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });

  const cartItems = activeOrders.filter((o) => o.isCartItem);
  const cartSubtotal = cartItems.reduce(
    (acc, curr) => acc + (Number(curr.price) || 0) * (Number(curr.quantity) || 1),
    0
  );

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`, {
      title: "Copied 📋",
      badge: label,
      duration: 2500,
    });
  };

  const handleCancelBooking = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_LOCALHOST_KEY}/book/${id}`
      );
      if (res.data?.deletedCount) {
        toast.success("Order item was removed from your active queue.", {
          title: "Order Cancelled 🗑️",
        });
        if (user?.email) {
          dispatch(fetchBooked(user.email));
          dispatch(fetchRequestPayment(user.email));
        }
      }
    } catch (_err) {
      toast.error("Could not cancel order. Please contact concierge support.");
    }
  };

  // Status badge styling
  const getStatusBadge = (order) => {
    if (order.isCartItem) {
      return {
        label: "In Bag • Checkout Pending",
        color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        step: 0,
      };
    }
    switch (order.status) {
      case "Awaiting Check Payment":
        return {
          label: "Awaiting Verification",
          color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
          step: 1,
        };
      case "Receive Payment":
        return {
          label: "Payment Confirmed",
          color: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
          step: 2,
        };
      case "Delivery":
        return {
          label: "Dispatched & In Transit",
          color: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
          step: 3,
        };
      default:
        return {
          label: order.status || "Order Placed",
          color: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
          step: 1,
        };
    }
  };

  if (isInitialLoading) {
    return (
      <LoadingSpinner
        message="Loading Active Orders..."
        subMessage="Retrieving live artisan crafting and dispatch updates"
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">
            <FiClock />
            <span>Active Shipments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Active Orders & Deliveries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor real-time artisan crafting status, payment confirmations, and scheduled deliveries.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by shoe or invoice..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Shopping Bag Checkout Alert (If items in bag) */}
      {cartItems.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              <FiShoppingBag />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                <span>You have {cartItems.length} footwear {cartItems.length > 1 ? "articles" : "article"} in your Bag</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400">
                  Single Flat Delivery Charge
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Order all {cartItems.length} items together now and pay delivery charge only once (৳60 Dhaka / ৳120 Outside Dhaka).
              </p>
            </div>
          </div>
          <Link
            to="/checkout"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Checkout All ({cartItems.length} Items • ৳{cartSubtotal.toLocaleString()})</span>
            <FiArrowRight />
          </Link>
        </div>
      )}

      {/* 2. Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl p-12 text-center bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <FiShoppingBag className="text-3xl" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Active Orders Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              You currently have no pending shipments in transit. Explore our signature handcrafted calfskin collections to acquire your next pair.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>Explore Footwear Atelier</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order);
            const totalItemCost = order.price * order.quantity;

            return (
              <div
                key={order._id}
                className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Top Strip */}
                <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      {order.invoiceId}
                    </span>
                    {!order.isCartItem && (
                      <button
                        type="button"
                        onClick={() => handleCopy(order.invoiceId, "Invoice ID")}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition"
                        title="Copy Invoice ID"
                      >
                        <FiCopy className="text-xs" />
                      </button>
                    )}
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <FiCalendar className="text-amber-500" />
                      <span>{order.isCartItem ? "Added:" : "Ordered:"} {order.orderDate}</span>
                    </span>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.color}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Main Card Content */}
                <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left: Product Showcase */}
                  <div className="md:col-span-6 flex items-center gap-4">
                    <img
                      src={order.image}
                      alt={order.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {order.category}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {order.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                          Size {order.size || "Standard"}
                        </span>
                        <span>•</span>
                        <span>Qty: {order.quantity}</span>
                        <span>•</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ৳ {totalItemCost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Delivery & Address Info */}
                  <div className="md:col-span-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-l border-slate-100 dark:border-slate-800/80 md:pl-5">
                    <p className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <FiTruck className="text-amber-500" />
                      <span>{order.isCartItem ? "Checkout Status" : "Estimated Delivery"}</span>
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {order.deliveryDate}
                    </p>
                    <p className="truncate text-slate-400 flex items-center gap-1">
                      <FiMapPin className="shrink-0 text-slate-500" />
                      <span className="truncate">{order.address}</span>
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="md:col-span-3 flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2 justify-center">
                    <Link
                      to={`/product-details/${order.productId}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>View Footwear</span>
                      <FiExternalLink />
                    </Link>

                    {order.isCartItem ? (
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <Link
                          to={`/CheckOut/${order.productId}`}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5 text-center"
                        >
                          <FiShoppingBag />
                          <span>Complete Checkout</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(order._id)}
                          className="px-4 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center justify-center gap-1.5"
                        >
                          <FiTrash2 />
                          <span>Remove from Bag</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedInvoice(order.paymentRecord || order)
                          }
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <FiPrinter className="text-sm" />
                          <span>View Invoice</span>
                        </button>

                        {order.status === "Awaiting Check Payment" ? (
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(order._id)}
                            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center justify-center gap-1.5"
                          >
                            <FiTrash2 />
                            <span>Cancel Order</span>
                          </button>
                        ) : (
                          <div className="px-3 py-1 rounded-lg text-[10.5px] font-bold text-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {order.status}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Step Timeline */}
                <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80">
                  {order.isCartItem ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2.5 px-3.5 rounded-xl border border-amber-500/20">
                      <span className="flex items-center gap-2">
                        <FiShoppingBag className="text-amber-500 text-sm" />
                        <span>Item saved in your shopping bag. Provide delivery details & payment to place order.</span>
                      </span>
                      <Link
                        to={`/CheckOut/${order.productId}`}
                        className="font-bold underline hover:text-amber-500 shrink-0"
                      >
                        Checkout Now →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
                      <div className={`flex items-center justify-center gap-1.5 ${badge.step >= 1 ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`}>
                        <FiCheckCircle className="text-xs" />
                        <span>1. Order Placed</span>
                      </div>
                      <div className={`flex items-center justify-center gap-1.5 ${badge.step >= 2 ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
                        <FiCheckCircle className="text-xs" />
                        <span>2. Payment Verified</span>
                      </div>
                      <div className={`flex items-center justify-center gap-1.5 ${badge.step >= 3 ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}`}>
                        <FiTruck className="text-xs" />
                        <span>3. Out for Delivery</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Luxury Printable Invoice Modal */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        order={selectedInvoice}
        shoes={Shoes}
      />

    </div>
  );
};

export default MyOrders;
