import React from "react";
import { FiCheckCircle, FiLayers, FiFeather, FiShield } from "react-icons/fi";
import Content from "../../Content/Content";

const pillars = [
  {
    icon: FiLayers,
    title: "1. Full-Grain Crust Calfskin",
    desc: "We exclusively select the top tier of raw hides with natural grain intact. No synthetic films or corrected grain.",
  },
  {
    icon: FiShield,
    title: "2. Goodyear Welt Construction",
    desc: "A century-old shoemaking technique stitching upper, insole, and welt. Completely waterproof and resolable for decades.",
  },
  {
    icon: FiFeather,
    title: "3. Dual-Density Orthotic Bed",
    desc: "Breathable cork layer paired with anatomical memory foam that conforms to your individual foot contour over time.",
  },
  {
    icon: FiCheckCircle,
    title: "4. Hand-Burnished Patina",
    desc: "Each shoe is hand-buffed with Italian natural waxes and dyes, ensuring no two pairs have the exact same gradient.",
  },
];

const CraftsmanshipStory = () => {
  return (
    <section className="py-16 bg-slate-100/70 dark:bg-slate-950 transition-colors">
      <Content>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Craftsmanship Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop"
                alt="Master Shoemaker Crafting Full Grain Leather"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 mb-2 inline-block">
                  Artisanal Heritage
                </span>
                <h4 className="text-xl font-bold">140+ Steps of Pure Passion</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Over 3 weeks of handcrafting go into each individual pair of Trends Shop shoes.
                </p>
              </div>
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-5 -right-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-amber-500/30 p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3">
              <div className="text-3xl font-extrabold text-amber-500">10+</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-tight">
                Years of Leather<br />Craftsmanship
              </div>
            </div>
          </div>

          {/* Right Column: Pillars of Quality */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
                <span className="w-6 h-[2px] bg-amber-500"></span>
                The Standard of Excellence
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Why Discerning Gentlemen Choose Trends Shop
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                In an era of mass-produced fast fashion, we build footwear meant to be cherished, resoled, and handed down through generations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 shadow-sm space-y-2 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Content>
    </section>
  );
};

export default CraftsmanshipStory;
