import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiZap, FiArrowRight } from "react-icons/fi";
import Content from "../../Content/Content";

const FlashDeal = () => {
  // Set a countdown target 36 hours ahead
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-amber-950/20 via-slate-900 to-amber-950/30 border-y border-amber-500/20 my-6 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <Content>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Visual Banner */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 p-2 bg-gradient-to-b from-amber-500/20 to-transparent shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=700&auto=format&fit=crop"
                alt="Flash Sale Signature Oxford"
                className="w-full h-72 sm:h-80 object-cover rounded-2xl"
              />
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <FiZap className="fill-slate-950" />
                <span>LIMITED FLASH DEAL</span>
              </div>
            </div>
          </div>

          {/* Right Details & Timer */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full">
              <FiClock />
              Offer Ends In
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Artisan Monk Strap <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">Edition</span>
            </h2>

            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              Meticulously burnished full-grain Italian calfskin with double-buckle brass hardware. Unrivaled luxury at an exclusive weekly promotional price.
            </p>

            {/* Price Highlight */}
            <div className="flex items-baseline justify-center lg:justify-start gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                ৳ 3,250
              </span>
              <span className="text-lg line-through text-slate-500">
                ৳ 5,500
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Save 41%
              </span>
            </div>

            {/* Countdown Flip Cards */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-2xl font-mono font-extrabold text-white shadow-inner">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Hours</span>
              </div>
              <span className="text-2xl font-bold text-amber-500 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-2xl font-mono font-extrabold text-white shadow-inner">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Minutes</span>
              </div>
              <span className="text-2xl font-bold text-amber-500 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-2xl font-mono font-extrabold text-amber-400 shadow-inner animate-pulse">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Seconds</span>
              </div>
            </div>

            {/* Stock Progress Bar */}
            <div className="max-w-md mx-auto lg:mx-0 space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Stock Status</span>
                <span className="font-bold text-amber-400">Only 7 Pairs Left</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[78%] rounded-full"></div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                to="/products/MAN'S-FORMAL"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 group"
              >
                <span>Claim This Offer</span>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Content>
    </section>
  );
};

export default FlashDeal;
