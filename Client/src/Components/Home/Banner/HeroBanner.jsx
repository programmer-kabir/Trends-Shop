import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShield, FiStar } from "react-icons/fi";
import { GiLeatherBoot } from "react-icons/gi";
import Content from "../../Content/Content";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-6 pb-16 md:pt-12 md:pb-24 border-b border-white/5">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 h-72 md:h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <Content>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Autumn / Winter 2026 Collection
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Handcrafted <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 font-serif-luxury italic">Luxury</span> <br />
              In Every Step.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Experience the unmatched distinction of 100% full-grain calfskin leather, bespoke craftsmanship, and ergonomic all-day comfort.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products/MAN'S-FORMAL"
                className="px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 flex items-center gap-2 group"
              >
                <span>Explore Collection</span>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#bestselling"
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                View Best Sellers
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-bold text-amber-400">100%</span>
                <span className="text-xs text-slate-400">Full-Grain Leather</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-white/10 px-2">
                <span className="text-xl sm:text-2xl font-bold text-amber-400">15K+</span>
                <span className="text-xs text-slate-400">Happy Customers</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center text-amber-400 text-sm">
                  <FiStar className="fill-amber-400" />
                  <span className="ml-1 text-xl sm:text-2xl font-bold text-white">4.9</span>
                </div>
                <span className="text-xs text-slate-400">Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center items-center z-10">
            {/* Concentric Glow Rings */}
            <div className="w-72 sm:w-80 h-72 sm:h-80 md:w-96 md:h-96 rounded-full border border-amber-500/20 absolute -z-10 animate-pulse"></div>
            <div className="w-60 sm:w-72 h-60 sm:h-72 md:w-80 md:h-80 rounded-full border border-amber-500/10 absolute -z-10"></div>

            {/* Main Product Feature Card */}
            <div className="relative group">
              <div className="relative z-10 rounded-3xl p-3 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/60 transition-transform duration-500 group-hover:scale-[1.02]">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop"
                  alt="Premium Handcrafted Leather Oxford"
                  className="w-[320px] sm:w-[380px] h-[340px] sm:h-[400px] object-cover rounded-2xl shadow-inner"
                />

                {/* Floating Pill: Leather Stamp */}
                <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                  <GiLeatherBoot className="text-amber-400 text-lg" />
                  <span className="text-xs font-semibold tracking-wide text-white">Bespoke Italian Leather</span>
                </div>

                {/* Floating Bottom Card: Pricing & Stock */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3.5 rounded-xl shadow-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">Special Edition</p>
                    <p className="text-sm font-bold text-white">Artisan Oxford Brogue</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs line-through text-slate-400">৳ 4,500</p>
                    <p className="text-base font-extrabold text-amber-400">৳ 3,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </section>
  );
};

export default HeroBanner;
