import React, { useEffect, useState } from "react";
import { FiSearch, FiTag, FiCopy, FiTrash2, FiPlus, FiCalendar, FiPercent } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons } from "../../Redux/Coupons/couponsSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const AddCoupon = () => {
  const dispatch = useDispatch();
  const { Coupons = [], isLoading } = useSelector((state) => state.Coupons || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setImageUrl("");
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied!`, { duration: 1500 });
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors: formError },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { name, amount, start, end, code } = data;
      const endDate = new Date(end).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const startDate = new Date(start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const mainData = {
        name,
        amount: Number(amount),
        star: startDate,
        end: endDate,
        code: code.trim().toUpperCase(),
        image:
          imageUrl ||
          "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop",
      };

      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/couponCode`,
        mainData
      );

      if (res?.data?.insertedId) {
        toast.success(`Coupon code "${mainData.code}" created successfully!`);
        closeModal();
        dispatch(fetchCoupons());
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error("This coupon code already exists!");
      } else {
        toast.error("An unexpected error occurred while saving the coupon.");
      }
    }
  };

  const getCouponStatus = (coupon) => {
    const currentDate = new Date();
    const startDate = new Date(coupon.star);
    const endDate = new Date(coupon.end);

    const oneDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.round((endDate - currentDate) / oneDay);

    if (currentDate >= startDate && currentDate <= endDate) {
      return { status: "Active", availableDays: Math.max(0, daysRemaining) };
    } else if (currentDate > endDate) {
      return { status: "Expired", availableDays: 0 };
    }
    return {
      status: "Upcoming",
      availableDays: Math.round((startDate - currentDate) / oneDay),
    };
  };

  const handleDelete = (coupon) => {
    Swal.fire({
      title: "Delete Coupon?",
      text: `Are you sure you want to delete promo code "${coupon.code}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_LOCALHOST_KEY}/couponCode/${coupon._id}`
          );
          toast.success("Coupon code deleted.");
          dispatch(fetchCoupons());
        } catch (error) {
          toast.error("Failed to delete coupon.");
        }
      }
    });
  };

  const filteredCoupons = (Coupons || []).filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c?.name?.toLowerCase().includes(q) ||
      c?.code?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <FiTag className="w-3.5 h-3.5" />
              Campaign Management
            </span>
            <span className="text-xs text-slate-400">
              {Coupons?.length || 0} Promotional Codes Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Promotional Coupons & Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure seasonal percentage discounts, validity windows, and special checkout voucher codes.
          </p>
        </div>

        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md shadow-amber-600/20 transition self-start md:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            placeholder="Search coupon name or promo code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredCoupons.length === 0 ? (
          <div className="py-16 text-center">
            <FiTag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No matching coupons found
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Click "Create New Coupon" to publish a seasonal discount code.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Campaign Title</th>
                  <th className="py-3 px-4">Promo Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Campaign Status</th>
                  <th className="py-3 px-4">Valid Duration</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filteredCoupons.map((coupon) => {
                  const { status, availableDays } = getCouponStatus(coupon);
                  return (
                    <tr
                      key={coupon?._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                            src={coupon.image}
                            alt={coupon.name}
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {coupon?.name}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              Campaign ID: {coupon?._id?.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => copyCode(coupon?.code)}
                          className="font-mono font-bold text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition inline-flex items-center gap-1.5"
                          title="Click to copy code"
                        >
                          <FiCopy className="w-3 h-3 text-amber-600" />
                          <span>{coupon?.code}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm">
                        <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                          {coupon?.amount}% OFF
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            status === "Active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                          }`}
                        >
                          {status} ({availableDays}d remaining)
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-slate-400" />
                          <span>{coupon?.star} – {coupon?.end}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(coupon)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          title="Delete coupon"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Drawer Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
            onClick={closeModal}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex z-50">
            <div className="w-screen max-w-md bg-white dark:bg-[#111622] text-slate-800 dark:text-slate-100 shadow-2xl flex flex-col justify-between">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Publish New Coupon
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add promo code & discount percentages for checkout.
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <RxCross2 size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form
                id="coupon-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                {/* Campaign Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. Winter Luxury Gala 15% Off"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  {formError.name && (
                    <span className="text-rose-500 text-[11px] mt-0.5 block">
                      {formError.name.message}
                    </span>
                  )}
                </div>

                {/* Promo Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Voucher Code *
                  </label>
                  <input
                    type="text"
                    {...register("code", { required: "Code is required" })}
                    placeholder="e.g. LUXURY15"
                    className="w-full font-mono uppercase px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  {formError.code && (
                    <span className="text-rose-500 text-[11px] mt-0.5 block">
                      {formError.code.message}
                    </span>
                  )}
                </div>

                {/* Discount Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Discount Percentage (%) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="90"
                      {...register("amount", { required: "Discount is required" })}
                      placeholder="e.g. 15"
                      className="w-full pl-3.5 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <FiPercent className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  </div>
                  {formError.amount && (
                    <span className="text-rose-500 text-[11px] mt-0.5 block">
                      {formError.amount.message}
                    </span>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      {...register("start", { required: true })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      {...register("end", { required: true })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Banner / Graphic Image URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Banner Graphic Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Paste a shoe image or luxury banner URL. A curated photo is used if blank.
                  </p>
                  {imageUrl && (
                    <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </form>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/30">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="coupon-form"
                  className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl shadow-md shadow-amber-600/20 transition"
                >
                  Publish Coupon
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddCoupon;
