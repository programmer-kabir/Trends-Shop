import React from "react";
import { FiAward, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import Content from "../../Content/Content";

const features = [
  {
    icon: FiAward,
    title: "100% Full-Grain Leather",
    desc: "Ethically sourced artisan calfskin, built to patina gracefully with age.",
  },
  {
    icon: FiTruck,
    title: "Free Express Shipping",
    desc: "Swift 48-72h doorstep delivery across Bangladesh on orders over ৳3,000.",
  },
  {
    icon: FiRefreshCw,
    title: "30-Day Hassle-Free Exchange",
    desc: "Size mismatch? Exchange easily with our 100% perfect fit guarantee.",
  },
  {
    icon: FiShield,
    title: "Secure COD & Digital Pay",
    desc: "Pay securely with Cash on Delivery, bKash, Nagad or cards with verified invoice.",
  },
];

const TrustFeatures = () => {
  return (
    <section className="py-8 bg-white dark:bg-[#0B0F19] border-b border-slate-100 dark:border-white/5 transition-colors">
      <Content>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Content>
    </section>
  );
};

export default TrustFeatures;
