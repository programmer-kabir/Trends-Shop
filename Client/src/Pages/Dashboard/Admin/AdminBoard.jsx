import React, { useEffect } from "react";
import useAuth from "../../../Components/Hooks/useAuth";
import MonthlySells from "./MonthlySells";
import TypeSells from "./TypeSells";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
} from "react-icons/fi";

const AdminBoard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { RequestPayment = [] } = useSelector((state) => state.RequestPayment || {});
  const { Shoes = [] } = useSelector((state) => state.Shoes || {});

  useEffect(() => {
    dispatch(fetchRequestPayment());
    dispatch(fetchShoes());
  }, [dispatch]);

  // Date filters
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const month = today.getMonth();
  const year = today.getFullYear();

  const todayDate = today.toISOString().split("T")[0];
  const yesterdayDate = yesterday.toISOString().split("T")[0];
  const startOfMonth = new Date(year, month, 1);

  // Filter orders
  const todayOrders = RequestPayment.filter((o) => o?.orderDate === todayDate);
  const yesterdayOrders = RequestPayment.filter((o) => o?.orderDate === yesterdayDate);
  const monthOrders = RequestPayment.filter(
    (o) => o?.orderDate && new Date(o.orderDate) >= startOfMonth
  );

  // Calculate Revenues
  const calcRevenue = (orders) =>
    orders.reduce((acc, curr) => acc + (Number(curr?.price) || 0) + (Number(curr?.shippingCost) || 0), 0);

  const todayRevenue = calcRevenue(todayOrders);
  const yesterdayRevenue = calcRevenue(yesterdayOrders);
  const monthRevenue = calcRevenue(monthOrders);

  // Status breakdown
  const pendingOrders = RequestPayment.filter((o) => o?.status === "Pending");
  const receivedOrders = RequestPayment.filter((o) => o?.status === "Receive Payment");
  const deliveryOrders = RequestPayment.filter((o) => o?.status === "Delivery");
  const completedOrders = RequestPayment.filter((o) => o?.status === "Completed Order");

  // Recent 5 orders sorted by date descending
  const recentOrders = [...RequestPayment]
    .sort((a, b) => new Date(b?.orderDate || 0) - new Date(a?.orderDate || 0))
    .slice(0, 5);

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6  mx-auto">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations Feed
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <FiCalendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Trends Shop Executive Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time sales, order logistics, and footwear inventory overview for{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {user?.displayName || "Administrator"}
            </span>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/request_Payment"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md shadow-amber-600/20 transition-all duration-200"
          >
            <span>Process Orders</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Orders */}
        <div className="bg-white dark:bg-[#111622] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              ৳{todayRevenue.toLocaleString()}
            </h2>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <FiCheckCircle className="w-3.5 h-3.5" />
                {todayOrders.length} New Orders
              </span>
              <span className="text-slate-400 dark:text-slate-500">Today</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80" />
        </div>

        {/* Card 2: Yesterday's Orders */}
        <div className="bg-white dark:bg-[#111622] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Yesterday's Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              ৳{yesterdayRevenue.toLocaleString()}
            </h2>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {yesterdayOrders.length} Orders Settled
              </span>
              <span className="text-slate-400 dark:text-slate-500">Yesterday</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-400 opacity-80" />
        </div>

        {/* Card 3: Monthly Revenue */}
        <div className="bg-white dark:bg-[#111622] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              This Month's Sales
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FiDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              ৳{monthRevenue.toLocaleString()}
            </h2>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {monthOrders.length} Monthly Orders
              </span>
              <span className="text-slate-400 dark:text-slate-500">October 2026</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-80" />
        </div>

        {/* Card 4: Catalog Stock */}
        <div className="bg-white dark:bg-[#111622] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Footwear In Stock
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FiPackage className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {Shoes.length} Handcrafted Pairs
            </h2>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                100% Active in Store
              </span>
              <span className="text-slate-400 dark:text-slate-500">Catalog</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-80" />
        </div>
      </div>

      {/* Operational Order Funnel Bar */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-1">
          Logistics & Fulfillment Pipeline
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/request_Payment"
            className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 hover:bg-amber-100/70 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <FiClock className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Pending Approval
              </span>
            </div>
            <span className="text-base font-bold text-amber-700 dark:text-amber-400">
              {pendingOrders.length}
            </span>
          </Link>

          <Link
            to="/admin/request_Payment"
            className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/40 hover:bg-blue-100/70 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <FiDollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Payment Received
              </span>
            </div>
            <span className="text-base font-bold text-blue-700 dark:text-blue-400">
              {receivedOrders.length}
            </span>
          </Link>

          <Link
            to="/admin/request_Payment"
            className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-800/40 hover:bg-purple-100/70 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                <FiTruck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Out for Delivery
              </span>
            </div>
            <span className="text-base font-bold text-purple-700 dark:text-purple-400">
              {deliveryOrders.length}
            </span>
          </Link>

          <Link
            to="/admin/request_Payment"
            className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 hover:bg-emerald-100/70 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Completed
              </span>
            </div>
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
              {completedOrders.length}
            </span>
          </Link>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlySells />
        </div>
        <div className="lg:col-span-1">
          <TypeSells />
        </div>
      </div>

      {/* Recent Live Orders Feed */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest transactions placed across Dhaka and other districts
            </p>
          </div>
          <Link
            to="/admin/request_Payment"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({RequestPayment.length})</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {recentOrders.map((order) => {
                const shoe = Shoes.find((s) => s?._id === order?.products);
                const isPaid = order?.status === "Receive Payment" || order?.status === "Completed Order";
                const isDelivery = order?.status === "Delivery";

                // Method badge
                const method = order?.paymentMethod || (order?.transactionID?.includes("COD") ? "COD" : "Online");
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

                return (
                  <tr
                    key={order?._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                      {order?.invoiceId || `#${order?._id?.slice(-6)}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {order?.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {order?.address}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {shoe?.mainImage && (
                          <img
                            src={shoe.mainImage}
                            alt={shoe.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                        )}
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                            {shoe?.name || "Handcrafted Footwear"}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            Size {order?.size || 42}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${methodBadgeClass}`}>
                        {method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      ৳{(Number(order?.price) + Number(order?.shippingCost || 0)).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          order?.status === "Completed Order"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : isDelivery
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                            : isPaid
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}
                      >
                        {order?.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/admin/request_Payment"
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBoard;
