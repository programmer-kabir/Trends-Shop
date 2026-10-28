import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import Content from "../../Content/Content";

const defaultCategories = [
  {
    title: "Men's Formal Shoes",
    subtitle: "Oxfords, Derbies & Monk Straps",
    link: "/products/MAN'S-FORMAL",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    badge: "Most Popular",
    colSpan: "lg:col-span-6",
  },
  {
    title: "Men's Casual & Loafers",
    subtitle: "Hand-stitched Penny & Tassel Loafers",
    link: "/products/MAN'S-CASUAL",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    badge: "Trending",
    colSpan: "lg:col-span-6",
  },
  {
    title: "Women's Collection",
    subtitle: "Elegance, Comfort & Artisanal Finish",
    link: "/products/WOMEN'S",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    badge: "New Season",
    colSpan: "lg:col-span-4",
  },
  {
    title: "Athletic & Leather Sneakers",
    subtitle: "Luxury Sport Hybrid Soles",
    link: "/products/MAN'S-SPORT",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    badge: "Urban Active",
    colSpan: "lg:col-span-4",
  },
  {
    title: "Kid's Heritage Footwear",
    subtitle: "Durable & Flexible Growing Comfort",
    link: "/products/KID'S",
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop",
    badge: "Junior Line",
    colSpan: "lg:col-span-4",
  },
];

const FeaturedCategories = () => {
  const { Categories = [] } = useSelector((state) => state.Categories || {});

  const categories = useMemo(() => {
    if (!Categories || Categories.length === 0) return defaultCategories;
    return Categories.map((cat, idx) => {
      const colSpan =
        Categories.length <= 2
          ? "lg:col-span-6"
          : idx < 2
          ? "lg:col-span-6"
          : "lg:col-span-4";

      const firstSubRaw = (cat.subcategories || [])[0];
      const firstSub =
        typeof firstSubRaw === "object" && firstSubRaw !== null
          ? firstSubRaw.name || firstSubRaw.title || ""
          : String(firstSubRaw || "");

      const link = firstSub
        ? `/products/${encodeURIComponent(firstSub.replace(/\s+/g, "-"))}`
        : `/products/${encodeURIComponent(cat.department || cat.gender || "ALL")}`;

      const subListStr = (cat.subcategories || [])
        .map((s) => (typeof s === "object" && s !== null ? s.name || "" : String(s || "")))
        .filter(Boolean)
        .slice(0, 3)
        .join(" • ");

      return {
        title: cat.name,
        subtitle: cat.description || subListStr || "Artisanal Footwear",
        link,
        image:
          cat.image ||
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
        badge: cat.department || cat.gender || "Collection",
        colSpan,
      };
    });
  }, [Categories]);
  return (
    <section className="py-12 bg-slate-50 dark:bg-[#0B0F19] transition-colors">
      <Content>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              <span className="w-6 h-[2px] bg-amber-500"></span>
              Curated Collections
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shop By Signature Categories
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Meticulously categorized to fit your corporate boardroom, weekend brunch, or festive celebrations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className={`group relative overflow-hidden rounded-3xl h-[260px] sm:h-[300px] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 ${cat.colSpan}`}
            >
              {/* Image with zoom effect */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity"></div>

              {/* Top Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                  {cat.badge}
                </span>
              </div>

              {/* Top Right Action Arrow */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:rotate-45">
                <FiArrowUpRight size={18} />
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs text-amber-400 font-medium mb-1 tracking-wide">
                  {cat.subtitle}
                </p>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Content>
    </section>
  );
};

export default FeaturedCategories;
