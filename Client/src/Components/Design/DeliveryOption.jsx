import React from "react";
import { 
  FiTruck, 
  FiClock, 
  FiMapPin, 
  FiRefreshCw, 
  FiShield, 
  FiPackage, 
  FiCheckCircle 
} from "react-icons/fi";
import { TbCashBanknote } from "react-icons/tb";
import { MdOutlineVerified } from "react-icons/md";

const DeliveryOption = () => {
  return (
    <div className="space-y-4">
      {/* 1. Fast Delivery Timeline Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <FiTruck className="text-amber-500 text-lg" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              ডেলিভারি সময় ও এরিয়া
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
            Express
          </span>
        </div>

        {/* Coverage */}
        <div className="flex items-start gap-2.5">
          <FiMapPin className="text-amber-500 text-base mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              সারা বাংলাদেশ হোম ডেলিভারি
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ৬৪ জেলার প্রতিটি থানা ও সদর উপজেলায়
            </p>
          </div>
        </div>

        {/* Dhaka vs Outside Dhaka Timeline */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
              ⚡ ঢাকা সিটির ভেতরে
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white block">
              ২ - ৩ দিন
            </span>
            <span className="text-[10px] text-slate-400">সরাসরি হোম ডেলিভারি</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-center">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-0.5">
              🚚 বাকি সকল জেলা
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white block">
              ৩ - ৫ দিন
            </span>
            <span className="text-[10px] text-slate-400">ডোরস্টেপ এক্সপ্রেস</span>
          </div>
        </div>

        {/* Free Shipping Note */}
        <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <FiCheckCircle className="flex-shrink-0 text-sm" />
          <span>৳৩,০০০ টাকার অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি!</span>
        </div>
      </div>

      {/* 2. Accepted Payment Methods Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm space-y-3.5 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <TbCashBanknote className="text-amber-500 text-xl" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              নিরাপদ পেমেন্ট মেথড
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">100% Secure</span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          বিকাশ, নগদ, রকেট, উপায় অথবা পণ্য হাতে পেয়ে ক্যাশ অন ডেলিভারিতে পেমেন্ট করুন:
        </p>

        {/* Clean Official Payment Badges */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* bKash */}
          <div className="p-2.5 rounded-xl border border-[#E2136E]/30 bg-[#E2136E]/5 dark:bg-[#E2136E]/10 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-black text-xs shadow-xs">
              bK
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#E2136E]">bKash</p>
              <p className="text-[10px] text-slate-400">বিকাশ পেমেন্ট</p>
            </div>
          </div>

          {/* Nagad */}
          <div className="p-2.5 rounded-xl border border-[#EA1D25]/30 bg-[#EA1D25]/5 dark:bg-[#EA1D25]/10 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F7931E] to-[#EA1D25] text-white flex items-center justify-center font-black text-xs shadow-xs">
              ন
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#EA1D25]">Nagad</p>
              <p className="text-[10px] text-slate-400">নগদ পেমেন্ট</p>
            </div>
          </div>

          {/* Rocket */}
          <div className="p-2.5 rounded-xl border border-[#8C3494]/30 bg-[#8C3494]/5 dark:bg-[#8C3494]/10 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#8C3494] text-white flex items-center justify-center font-black text-xs shadow-xs">
              🚀
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#8C3494]">Rocket</p>
              <p className="text-[10px] text-slate-400">রকেট ওয়ালেট</p>
            </div>
          </div>

          {/* Upay */}
          <div className="p-2.5 rounded-xl border border-[#00529B]/30 bg-[#00529B]/5 dark:bg-[#00529B]/10 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#00529B] text-white flex items-center justify-center font-black text-xs shadow-xs">
              U
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#00529B] dark:text-[#5B9BD5]">Upay</p>
              <p className="text-[10px] text-slate-400">উপায় পেমেন্ট</p>
            </div>
          </div>
        </div>

        {/* Cash on Delivery Highlight */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-base flex-shrink-0">
            💵
          </div>
          <div>
            <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
              Cash on Delivery (COD) Available
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              জুতো হাতে পেয়ে সাইজ ও কোয়ালিটি দেখে মূল্য পরিশোধের সুবিধা
            </p>
          </div>
        </div>
      </div>

      {/* 3. Luxury Guarantees & Returns */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm space-y-3.5 text-left">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3 flex items-center gap-2">
          <MdOutlineVerified className="text-amber-500 text-base" />
          <span>ট্রেন্ডস শপ গ্যারান্টি</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <FiRefreshCw className="text-amber-500 text-base mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                ৭ দিনের সহজ সাইজ এক্সচেঞ্জ
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                সাইজ ছোট বা বড় হলে বিনা ঝামেলায় সাইজ পরিবর্তনের নিশ্চয়তা
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <FiShield className="text-amber-500 text-base mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                ১০০% জেনুইন লেদার ওয়্যারেন্টি
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                হাতে তৈরি ফুল-গ্রেইন ইতালিয়ান ও প্রিমিয়াম বাফেলো লেদার
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <FiPackage className="text-amber-500 text-base mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                ওপেন বক্স চেক সুবিধা
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ডেলিভারি ম্যানের সামনে প্যাকেট খুলে জুতো দেখে নেওয়ার সুযোগ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOption;
