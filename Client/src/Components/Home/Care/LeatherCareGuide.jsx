import React, { useState } from "react";
import { FiFeather, FiSun, FiShield, FiHeart, FiCheck, FiArrowRight } from "react-icons/fi";
import { FaBrush } from "react-icons/fa6";
import Content from "../../Content/Content";
import { Link } from "react-router-dom";

const careSteps = [
  {
    step: "01",
    title: "Gentle Brushing & Dust Removal",
    tool: "100% Horsehair Bristle Brush",
    desc: "After every wear, gently brush away street dust, dirt, and microscopic grit from the seams and welt using soft horsehair bristles to prevent micro-scratches.",
    frequency: "Daily after wear",
    tip: "Use light, flicking motions rather than aggressive back-and-forth scrubbing.",
  },
  {
    step: "02",
    title: "Deep Conditioning & Hydration",
    tool: "All-Natural Lanolin & Beeswax Balm",
    desc: "Full-grain calfskin is living skin that dries out. Apply a dime-sized amount of nourishing conditioner every 3-4 weeks to restore elasticity and prevent leather cracking.",
    frequency: "Every 15-20 wears",
    tip: "Let the leather absorb the nutrients for 15 minutes before wiping excess off with a cotton chamois.",
  },
  {
    step: "03",
    title: "Hand-Burnishing & Mirror Polish",
    tool: "Carnauba Wax & Cotton Polishing Cloth",
    desc: "Apply premium carnauba wax polish to the stiffened toe cap and heel counter. Buff in small circles with a drop of cold water to achieve a museum-grade mirror reflection.",
    frequency: "Monthly / Before Formal Events",
    tip: "Keep wax off the flex creases of the vamp to prevent dry white wax residue.",
  },
  {
    step: "04",
    title: "Aromatic Cedar Shoe Trees",
    tool: "Solid Red Cedar Shoe Tree",
    desc: "Immediately insert solid cedar shoe trees upon taking shoes off. Cedar naturally wicks away 99% of internal sweat and foot moisture while holding the original last shape forever.",
    frequency: "Continuous when not wearing",
    tip: "Never store luxury shoes next to direct heating vents or damp enclosed bags.",
  },
];

const LeatherCareGuide = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#070b12] transition-colors border-b border-slate-200/80 dark:border-white/5">
      <Content>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
            <span className="w-6 h-[2px] bg-amber-500"></span>
            Heritage Maintenance
            <span className="w-6 h-[2px] bg-amber-500"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Bespoke Leather Care Ritual
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            A properly cared-for pair of Trends Shop Goodyear-welted shoes can easily last 15 to 20 years, developing a rich, personalized patina with age.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {careSteps.map((item, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                  isCurrent
                    ? "bg-white dark:bg-[#111827] border-amber-500 shadow-xl shadow-amber-500/10 -translate-y-1"
                    : "bg-white/60 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 hover:border-amber-500/40"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-mono font-extrabold text-amber-500">
                      {item.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                      {item.frequency}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                  <FaBrush className="text-base" />
                  <span>{item.tool}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Focus Pro Tip Banner */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              💡
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Master Cobbler Advice: <span className="text-amber-600 dark:text-amber-400">{careSteps[activeStep].title}</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {careSteps[activeStep].tip}
              </p>
            </div>
          </div>

          <Link
            to="/products/MAN'S-FORMAL"
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-500 dark:hover:bg-amber-400 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Explore Handcrafted Shoes</span>
            <FiArrowRight />
          </Link>
        </div>
      </Content>
    </section>
  );
};

export default LeatherCareGuide;
