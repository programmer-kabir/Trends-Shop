import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Content from "../../Content/Content";

const silhouettes = [
  {
    id: "oxford",
    name: "The Classic Oxford",
    formality: "Peak Formal / Boardroom",
    formalityLevel: 5,
    tag: "Signature Formal",
    desc: "Characterized by its sleek closed-lacing system and clean toe cap. The ultimate footwear for tailored suits, weddings, and executive meetings.",
    bestPairedWith: ["Two-Piece Bespoke Suits", "Tuxedos", "Crisp Formal Trousers"],
    link: "/products/MAN'S-FORMAL",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=700&auto=format&fit=crop",
    leather: "Full-Grain Box Calfskin",
  },
  {
    id: "monk",
    name: "Double Monk Strap",
    formality: "Business Formal to Smart Casual",
    formalityLevel: 4,
    tag: "Italian Heritage",
    desc: "Replaces traditional laces with gleaming dual brass buckles. Effortlessly bridges high-stakes boardroom authority with weekend dinner flair.",
    bestPairedWith: ["Slim-Cut Wool Suits", "Tailored Chinos & Blazers", "Dark Selvedge Denim"],
    link: "/products/MAN'S-FORMAL",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=700&auto=format&fit=crop",
    leather: "Hand-Burnished Crust Leather",
  },
  {
    id: "loafer",
    name: "Penny & Tassel Loafers",
    formality: "Smart Casual & Business Travel",
    formalityLevel: 3,
    tag: "Effortless Slip-On",
    desc: "A timeless laceless design with handcrafted saddle strap and beefroll stitching. Designed for all-day comfort without compromising sophisticated elegance.",
    bestPairedWith: ["Linen Trousers", "Ankle-Crop Chinos", "Smart Blazers"],
    link: "/products/MAN'S-CASUAL",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=700&auto=format&fit=crop",
    leather: "Supple Nappa Calfskin",
  },
  {
    id: "derby",
    name: "Artisan Derby & Blucher",
    formality: "Smart Business & Everyday Elegance",
    formalityLevel: 4,
    tag: "Open-Lace Comfort",
    desc: "Featuring open-lacing facings that accommodate wider feet and higher insteps with ease. Perfect balance of structured discipline and relaxed charm.",
    bestPairedWith: ["Flannel Trousers", "Tweed Jackets", "Dress Chinos"],
    link: "/products/MAN'S-FORMAL",
    image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=700&auto=format&fit=crop",
    leather: "Pebble Grain Full Leather",
  },
  {
    id: "boot",
    name: "Artisanal Chelsea Boot",
    formality: "Casual Luxe to Evening Attire",
    formalityLevel: 3,
    tag: "Ankle Heritage",
    desc: "Streamlined single-piece leather upper with elastic side gussets. Effortless slip-on versatility that commands respect in any climate or season.",
    bestPairedWith: ["Tapered Denim", "Overcoats & Cashmere", "Modern Tailoring"],
    link: "/products/MAN'S-CASUAL",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=700&auto=format&fit=crop",
    leather: "Waxed Italian Calf Suede",
  },
  {
    id: "sneaker",
    name: "Minimalist Leather Sneaker",
    formality: "Urban Active & Contemporary Luxe",
    formalityLevel: 2,
    tag: "Modern Essential",
    desc: "Low-profile silhouette crafted with glove-soft leather linings and stitched rubber cup soles. Redefining modern luxury footwear for the fast-paced city life.",
    bestPairedWith: ["Drawstring Trousers", "Smart Casual Joggers", "Weekend Denim"],
    link: "/products/MAN'S-SPORT",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=700&auto=format&fit=crop",
    leather: "Smooth Full-Grain Vachetta",
  },
];

const ShoeSilhouetteGuide = () => {
  const [selectedId, setSelectedId] = useState("oxford");
  const activeSilhouette = silhouettes.find((s) => s.id === selectedId) || silhouettes[0];

  return (
    <section className="py-16 bg-white dark:bg-[#0B0F19] transition-colors border-y border-slate-200/80 dark:border-white/5">
      <Content>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              <span className="w-6 h-[2px] bg-amber-500"></span>
              Footwear Silhouette Guide
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Mastering the Classic Shoe Silhouettes
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              Choose the exact shoe architecture for your occasion, dress code, and personal style.
            </p>
          </div>

          <Link
            to="/products/MAN'S-FORMAL"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors uppercase tracking-wider group"
          >
            <span>Browse All Silhouettes</span>
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Silhouette Selection Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-8">
          {silhouettes.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/25 scale-[1.02]"
                    : "bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-amber-500/50"
                }`}
              >
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Showcase Grid */}
        <div className="rounded-3xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 p-6 md:p-10 shadow-lg transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Photo Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl group">
                <img
                  src={activeSilhouette.image}
                  alt={activeSilhouette.name}
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-400 shadow-md">
                  {activeSilhouette.tag}
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl text-white text-xs flex justify-between items-center shadow-lg">
                  <span className="text-slate-300">Material Standard:</span>
                  <span className="font-bold text-amber-400">{activeSilhouette.leather}</span>
                </div>
              </div>
            </div>

            {/* Detailed Explanation */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600 dark:text-amber-400">
                  Silhouette Profile
                </span>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {activeSilhouette.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {activeSilhouette.desc}
                </p>
              </div>

              {/* Formality Scale Indicator */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 dark:text-slate-400">Formality Level:</span>
                  <span className="text-amber-600 dark:text-amber-400">{activeSilhouette.formality}</span>
                </div>
                <div className="flex gap-1.5 h-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`flex-1 rounded-full ${
                        lvl <= activeSilhouette.formalityLevel
                          ? "bg-amber-500"
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Pairing Recommendations */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Recommended Wardrobe Pairings:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeSilhouette.bestPairedWith.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2 shadow-sm"
                    >
                      <FiCheckCircle className="text-amber-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-2">
                <Link
                  to={activeSilhouette.link}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all group"
                >
                  <span>Explore {activeSilhouette.name} Collection</span>
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </section>
  );
};

export default ShoeSilhouetteGuide;
