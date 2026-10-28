import React from "react";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

const Faqs = () => {
  const data = [
    {
      question: "ঢাকা এবং ঢাকার বাইরে ডেলিভারি কত দ্রুত পাওয়া যাবে?",
      answer: "আমরা ঢাকা সিটির ভেতরে ২ থেকে ৩ কার্যদিবসের মধ্যে এক্সপ্রেস হোম ডেলিভারি দিয়ে থাকি। আর ঢাকার বাইরে বা দেশের যেকোনো জেলায় ৩ থেকে ৫ কার্যদিবসের মধ্যে পণ্য আপনার ঠিকানায় পৌঁছে দেওয়া হয়।",
    },
    {
      question: "পেমেন্ট কোন কোন মাধ্যমে করা যাবে?",
      answer: "আপনি বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket), উপায় (Upay) এবং পণ্য হাতে পেয়ে ক্যাশ অন ডেলিভারি (Cash on Delivery)-এর মাধ্যমে পেমেন্ট করতে পারবেন।",
    },
    {
      question: "ডেলিভারি নেওয়ার সময় কি জুতো খুলে চেক করা যাবে?",
      answer: "হ্যাঁ, ট্রেন্ডস শপে সম্পূর্ণ ওপেন বক্স চেক সুবিধা রয়েছে। ডেলিভারি ম্যানের উপস্থিতিতে বক্স খুলে জুতোর সাইজ, ফিনিশ ও কোয়ালিটি নিশ্চিত করে আপনি ক্যাশ অন ডেলিভারি পরিশোধ করতে পারবেন।",
    },
    {
      question: "সাইজ ছোট বা বড় হলে কি এক্সচেঞ্জ করা যাবে?",
      answer: "অবশ্যই! আমাদের ৭ দিনের সহজ সাইজ এক্সচেঞ্জ পলিসি রয়েছে। জুতো অক্ষত ও অব্যবহৃত অবস্থায় থাকলে আমাদের হেল্পলাইন (+880 1800-TRENDS)-এ জানালে দ্রুত নতুন সাইজ পাঠানো হবে।",
    },
    {
      question: "লেদার ও মেটেরিয়ালের কোয়ালিটি কেমন?",
      answer: "আমাদের প্রতিটি জুতো ১০০% সার্টিফাইড ফুল-গ্রেইন ইতালিয়ান ও প্রিমিয়াম বাফেলো লেদার দিয়ে হস্তনির্মিত। ভেতরে রয়েছে আরামদায়ক মেমোরি ফোম ফুটবেড এবং দীর্ঘস্থায়ী গুডইয়ার-ওয়েল্টেড টেকসই সোল।",
    },
  ];

  return (
    <div className="py-4 space-y-4 text-left">
      <div className="flex items-center gap-2 mb-4">
        <FiHelpCircle className="text-amber-500 text-lg" />
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
          প্রয়োজনীয় তথ্যাবলী ও সাধারণ প্রশ্নোত্তর
        </h3>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <details
            key={index}
            className="group rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs transition-all [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between p-4 sm:p-5 text-slate-900 dark:text-white font-bold text-xs sm:text-sm select-none hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <span className="pr-4">{item.question}</span>
              <FiChevronDown className="text-amber-500 text-base shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Faqs;