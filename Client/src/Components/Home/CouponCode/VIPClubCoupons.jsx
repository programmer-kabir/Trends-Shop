import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons } from "../../../Pages/Redux/Coupons/couponsSlice";
import { FiCopy, FiCheck, FiMail, FiGift, FiTag } from "react-icons/fi";
import toast from "react-hot-toast";
import Content from "../../Content/Content";

const defaultCoupons = [
  { code: "TRENDS10", discount: 10, minSpend: 2500, expiry: "Valid All Month" },
  { code: "ROYAL20", discount: 20, minSpend: 5000, expiry: "VIP Members Only" },
  { code: "FREESHIP", discount: 100, isShipping: true, minSpend: 3000, expiry: "Nationwide" },
];

const VIPClubCoupons = () => {
  const { Coupons } = useSelector((state) => state.Coupons);
  const dispatch = useDispatch();
  const [copiedCode, setCopiedCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const activeCoupons = (Coupons && Coupons.length > 0) ? Coupons : defaultCoupons;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon "${code}" copied to clipboard! 🎉`);
    setTimeout(() => setCopiedCode(""), 3000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Welcome to the Trends Shop VIP Circle! Check your email for your private discount.");
    setEmail("");
  };

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors border-t border-slate-200/60 dark:border-white/5">
      <Content>
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
            <FiTag />
            Exclusive Rewards
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Active Coupon Vouchers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Click to copy any coupon code and paste it on checkout for instant savings.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {activeCoupons.slice(0, 3).map((item, idx) => {
            const isCopied = copiedCode === item.code;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-white dark:bg-[#111827] border border-dashed border-amber-500/40 dark:border-amber-500/30 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all group"
              >
                {/* Decorative Side Notches */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 dark:bg-[#0E1320] border-r border-amber-500/30"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 dark:bg-[#0E1320] border-l border-amber-500/30"></div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Promo Voucher
                    </span>
                    <FiGift className="text-amber-500 text-lg" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {item.isShipping ? "FREE SHIPPING" : `${item.discount}% OFF`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Min. spend ৳{item.minSpend || 2500} • {item.expiry || "Limited Time"}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="font-mono text-sm font-bold tracking-wider text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                    {item.code}
                  </div>
                  <button
                    onClick={() => handleCopy(item.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isCopied
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <FiCheck />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIP Circle Subscription Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 rounded-full border border-amber-500/20">
              Trends Shop VIP Club
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Unlock Private Seasonal Drops & First Access
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join 15,000+ members and receive a 15% discount code directly to your inbox, plus invitations to limited-edition leather batch releases.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-white/10 text-white placeholder:text-slate-400 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/30 transition-all"
              >
                Join VIP Club
              </button>
            </form>
          </div>
        </div>
      </Content>
    </section>
  );
};

export default VIPClubCoupons;
