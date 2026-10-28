import React from "react";
import { FiStar, FiCheckCircle } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa6";
import Content from "../../Content/Content";

const reviews = [
  {
    name: "Tanvir Ahmed",
    role: "Corporate Executive, Dhaka",
    rating: 5,
    comment:
      "The Oxford Brogues in cognac brown exceeded every expectation. The leather quality is equivalent to international luxury brands costing three times more. Very comfortable on long boardroom days.",
    product: "Artisan Oxford Brogue",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Farhan Hossain",
    role: "Software Architect, Gulshan",
    rating: 5,
    comment:
      "Ordered the Penny Loafers and received them within 48 hours. The packaging, wooden shoe trees, and scent of pure full-grain leather were breathtaking. 10/10 service!",
    product: "Handcrafted Penny Loafer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Dr. Mahfuzur Rahman",
    role: "Cardiologist, Chittagong",
    rating: 5,
    comment:
      "Being on my feet during rounds was always painful with stiff dress shoes. Trends Shop's memory foam footbed and supple calfskin are a revelation. No break-in pain whatsoever.",
    product: "Derby Wingtip Comfort Sole",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
];

const Testimonials = () => {
  return (
    <section className="py-14 bg-white dark:bg-[#0B0F19] transition-colors">
      <Content>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
            <span className="w-6 h-[2px] bg-amber-500"></span>
            Real Customer Stories
            <span className="w-6 h-[2px] bg-amber-500"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Over 15,000+ Gentlemen Trust Us
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Read what corporate leaders, creative founders, and footwear connoisseurs say about our handcrafted shoes.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div>
                {/* Rating & Quote */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500 gap-1 text-sm">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FiStar key={i} className="fill-amber-500" />
                    ))}
                  </div>
                  <FaQuoteLeft className="text-slate-300 dark:text-slate-700 text-lg" />
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {rev.name}
                      <FiCheckCircle className="text-emerald-500 text-xs" title="Verified Buyer" />
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {rev.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Content>
    </section>
  );
};

export default Testimonials;
