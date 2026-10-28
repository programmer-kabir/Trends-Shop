import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../../Components/Hooks/useAuth";
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiCheck,
  FiCopy,
  FiShoppingBag,
  FiDollarSign,
  FiFilter,
} from "react-icons/fi";

const RequestPayment = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { RequestPayment = [], isLoading } = useSelector(
    (state) => state.RequestPayment || {}
  );
  const { Shoes = [] } = useSelector((state) => state.Shoes || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState("ALL");
  const [editingDateId, setEditingDateId] = useState(null);
  const [tempDate, setTempDate] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(fetchRequestPayment());
    dispatch(fetchShoes());
  }, [dispatch]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, { duration: 1500 });
  };

  const handleStatusChange = async (payment, newStatus) => {
    setStatusUpdatingId(payment._id);
    try {
      const data = {
        deliveryDate: payment.deliveryDate,
        newStatus,
        paymentId: payment._id,
        bookedId: payment.bookedId,
        productId: payment.products,
      };

      const res = await axios.patch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/requestPayment`,
        data
      );
      toast.success(res?.data?.message || `Order status updated to ${newStatus}`);
      dispatch(fetchRequestPayment());
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleSaveDeliveryDate = async (payment) => {
    if (!tempDate) {
      setEditingDateId(null);
      return;
    }
    try {
      const data = {
        deliveryDate: tempDate,
        newStatus: payment.status || "Receive Payment",
        paymentId: payment._id,
        bookedId: payment.bookedId,
        productId: payment.products,
      };

      await axios.patch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/requestPayment`,
        data
      );
      toast.success(`Delivery date scheduled: ${tempDate}`);
      setEditingDateId(null);
      dispatch(fetchRequestPayment());
    } catch (err) {
      toast.error("Failed to update delivery date");
    }
  };

  // Filter payments
  const filteredPayments = RequestPayment.filter((payment) => {
    const matchesSearch =
      payment?.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment?.number?.includes(searchTerm) ||
      payment?.transactionID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment?.address?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedStatusTab === "ALL") return true;
    if (selectedStatusTab === "PENDING") return payment.status === "Pending";
    if (selectedStatusTab === "RECEIVED") return payment.status === "Receive Payment";
    if (selectedStatusTab === "DELIVERY") return payment.status === "Delivery";
    if (selectedStatusTab === "COMPLETED") return payment.status === "Completed Order";
    return true;
  });

  // Calculate Summary metrics
  const totalInvoiced = RequestPayment.reduce(
    (acc, curr) => acc + (Number(curr?.price) || 0) + (Number(curr?.shippingCost) || 0),
    0
  );
  const pendingCount = RequestPayment.filter((o) => o?.status === "Pending").length;
  const transitCount = RequestPayment.filter((o) => o?.status === "Delivery").length;
  const completedCount = RequestPayment.filter((o) => o?.status === "Completed Order").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6  mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <FiShoppingBag className="w-3.5 h-3.5" />
              Order Management
            </span>
            <span className="text-xs text-slate-400">
              {RequestPayment.length} Total Invoices Recorded
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Customer Orders & Payments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track bKash, Nagad, Rocket and COD settlements, schedule courier dispatches, and manage fulfillment.
          </p>
        </div>
      </div>

      {/* Mini Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111622] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Invoiced</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              ৳{totalInvoiced.toLocaleString()}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <FiDollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111622] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
            <h3 className="text-xl font-bold text-amber-600 mt-1">
              {pendingCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <FiClock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111622] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Out for Delivery</p>
            <h3 className="text-xl font-bold text-purple-600 mt-1">
              {transitCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <FiTruck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111622] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Delivered / Completed</p>
            <h3 className="text-xl font-bold text-emerald-600 mt-1">
              {completedCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            placeholder="Search by Invoice, Customer, Phone, or Trx ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: `All (${RequestPayment.length})` },
            { id: "PENDING", label: `Pending (${pendingCount})` },
            { id: "RECEIVED", label: `Paid (${RequestPayment.filter((o) => o?.status === "Receive Payment").length})` },
            { id: "DELIVERY", label: `In Delivery (${transitCount})` },
            { id: "COMPLETED", label: `Completed (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedStatusTab === tab.id
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="py-16 text-center">
            <FiShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No matching orders found
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or clearing filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice & Date</th>
                  <th className="py-3 px-4">Customer & Location</th>
                  <th className="py-3 px-4">Ordered Shoe</th>
                  <th className="py-3 px-4">Channel & Trx</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Delivery Schedule</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filteredPayments.map((payment) => {
                  const shoe = Shoes.find((s) => s?._id === payment?.products);
                  const isEditingThisDate = editingDateId === payment._id;

                  // Method badge
                  const method =
                    payment?.paymentMethod ||
                    (payment?.transactionID?.includes("COD") ? "COD" : "Online");
                  let methodBadgeClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
                  if (method.toLowerCase().includes("bkash")) {
                    methodBadgeClass = "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300";
                  } else if (method.toLowerCase().includes("nagad")) {
                    methodBadgeClass = "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
                  } else if (method.toLowerCase().includes("rocket")) {
                    methodBadgeClass = "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300";
                  } else if (method.toLowerCase().includes("cash") || method.toLowerCase().includes("cod")) {
                    methodBadgeClass = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
                  }

                  const totalOrderCost =
                    (Number(payment?.price) || 0) + (Number(payment?.shippingCost) || 0);

                  return (
                    <tr
                      key={payment._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Invoice & Date */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                            {payment?.invoiceId || `#${payment._id.slice(-6)}`}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                payment?.invoiceId || payment._id,
                                "Invoice ID"
                              )
                            }
                            title="Copy Invoice ID"
                            className="p-1 text-slate-400 hover:text-amber-600 transition"
                          >
                            <FiCopy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                          <FiCalendar className="w-3 h-3" />
                          <span>{payment?.orderDate || "Recent"}</span>
                        </div>
                      </td>

                      {/* Customer & Location */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {payment?.name}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <FiPhone className="w-3 h-3 text-emerald-500" />
                          <a
                            href={`tel:${payment?.number}`}
                            className="hover:text-amber-600 transition"
                          >
                            {payment?.number}
                          </a>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 max-w-[180px] truncate" title={payment?.address}>
                          <FiMapPin className="w-3 h-3 shrink-0 text-slate-400" />
                          <span className="truncate">{payment?.address}</span>
                        </div>
                      </td>

                      {/* Ordered Shoe */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-2.5">
                          {shoe?.mainImage ? (
                            <img
                              src={shoe.mainImage}
                              alt={shoe.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              <FiShoppingBag className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <Link
                              to={shoe ? `/product-details/${shoe._id}` : "#"}
                              className="font-medium text-slate-900 dark:text-white hover:text-amber-600 transition line-clamp-1 max-w-[170px]"
                              title={shoe?.name}
                            >
                              {shoe?.name || "Footwear Article"}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                                Size {payment?.size || 42}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase">
                                {shoe?.category || "Men's Formal"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Channel & Trx */}
                      <td className="py-4 px-4 align-top">
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${methodBadgeClass}`}
                          >
                            {method}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-1.5 flex items-center gap-1">
                          <span>{payment?.transactionID || "COD-DIRECT"}</span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                payment?.transactionID || "COD",
                                "Transaction ID"
                              )
                            }
                            className="text-slate-400 hover:text-amber-600"
                          >
                            <FiCopy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          ৳{totalOrderCost.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ৳{payment?.price} + ৳{payment?.shippingCost || 0} ship
                        </div>
                      </td>

                      {/* Delivery Schedule */}
                      <td className="py-4 px-4 align-top">
                        {isEditingThisDate ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="date"
                              className="text-xs p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                              value={tempDate}
                              onChange={(e) => setTempDate(e.target.value)}
                            />
                            <button
                              onClick={() => handleSaveDeliveryDate(payment)}
                              className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                            >
                              <FiCheck className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                              {payment?.deliveryDate || "Not Set"}
                            </span>
                            <button
                              onClick={() => {
                                setEditingDateId(payment._id);
                                setTempDate(payment.deliveryDate || "");
                              }}
                              className="p-1 text-slate-400 hover:text-amber-600"
                              title="Edit Delivery Date"
                            >
                              <FiEdit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {payment?.deliveryDate ? "Courier Scheduled" : "Pending Schedule"}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4 align-top">
                        <select
                          value={payment?.status || "Pending"}
                          disabled={statusUpdatingId === payment._id}
                          onChange={(e) =>
                            handleStatusChange(payment, e.target.value)
                          }
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-all cursor-pointer ${
                            payment?.status === "Completed Order"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                              : payment?.status === "Delivery"
                              ? "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800"
                              : payment?.status === "Receive Payment"
                              ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
                              : payment?.status === "Transition ID Error"
                              ? "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                              : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Receive Payment">Receive Payment</option>
                          <option value="Delivery">Out for Delivery</option>
                          <option value="Completed Order">Completed Order</option>
                          <option value="Transition ID Error">Transition ID Error</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPayment;
