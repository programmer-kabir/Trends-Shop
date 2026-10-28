import React from "react";
import SocialIcons from "./SocialIcons";
import { Link } from "react-router-dom";
import SubscribeInput from "./SubscripeInput";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-100 dark:bg-[#070b12] text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <h5 className="font-bold text-slate-900 dark:text-white text-sm tracking-wider uppercase pb-2 border-b-2 border-amber-500 inline-block">
            About Trends Shop
          </h5>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Trends Shop is Bangladesh's premier destination for 100% handcrafted full-grain leather footwear. Built with heritage Goodyear welt craftsmanship for enduring elegance and bespoke comfort.
          </p>
          <div className="pt-2">
            <SubscribeInput />
          </div>
        </div>

        {/* Column 2: Policies */}
        <div className="space-y-4">
          <h5 className="font-bold text-slate-900 dark:text-white text-sm tracking-wider uppercase pb-2 border-b-2 border-amber-500 inline-block">
            Customer Care & Policies
          </h5>
          <div className="flex flex-col space-y-2.5 text-sm">
            <Link
              to="/complain"
              className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Exchange & 30-Day Fit Guarantee
            </Link>
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Privacy & Data Policy
            </Link>
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
          <div className="pt-3">
            <img
              src="https://voguesultana.com/images/payments.png"
              height={45}
              width={320}
              alt="Supported Payment Methods"
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Column 3: Connect & Social */}
        <div className="space-y-4">
          <h5 className="font-bold text-slate-900 dark:text-white text-sm tracking-wider uppercase pb-2 border-b-2 border-amber-500 inline-block">
            Connect With Us
          </h5>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Join our VIP Club for private sales, artisan previews, and member-only leather care guides.
          </p>
          <div className="pt-1">
            <SocialIcons />
          </div>
        </div>
      </div>

      <div className="bg-slate-200/90 dark:bg-[#03060a] border-t border-slate-300/80 dark:border-white/5 py-5 text-center text-xs text-slate-600 dark:text-slate-500">
        <p>Copyright © {new Date().getFullYear()} Trends Shop Lifestyle. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;