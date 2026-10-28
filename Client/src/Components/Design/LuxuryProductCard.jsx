import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiHeart, FiShoppingBag, FiStar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { FavoritesContext } from "../../Provider/FavoritesContext";

const LuxuryProductCard = ({ shoe }) => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { updateFavoriteCount } = useContext(FavoritesContext);

  const mainPrice = shoe.price || 0;
  const discount = shoe?.Discount || 0;
  const discountedPrice = discount
    ? Math.round(mainPrice - mainPrice * (discount / 100))
    : mainPrice;

  // Check wishlist
  const rawFavs = localStorage.getItem("favoriteTShirt");
  const favList = rawFavs ? JSON.parse(rawFavs) : [];
  const isFavorite = favList.includes(shoe._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (isFavorite) {
      updated = favList.filter((id) => id !== shoe._id);
      toast.success("Removed from wishlist");
    } else {
      updated = [...favList, shoe._id];
      toast.success("Added to wishlist ❤️");
    }
    localStorage.setItem("favoriteTShirt", JSON.stringify(updated));
    updateFavoriteCount();
  };

  return (
    <>
      <div className="group relative rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 hover:border-amber-500/50 dark:hover:border-amber-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30">
              -{discount}% OFF
            </span>
          )}
          {shoe?.selling > 10 && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-500/20">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          aria-label="Wishlist"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-transform active:scale-90 shadow-sm"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-base" />
          ) : (
            <FiHeart className="text-base" />
          )}
        </button>

        {/* Product Image */}
        <div className="relative w-full h-[220px] sm:h-[240px] bg-slate-100 dark:bg-slate-800/60 overflow-hidden flex items-center justify-center">
          <img
            src={shoe.mainImage}
            alt={shoe.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Quick Hover Bar */}
          <div className="absolute inset-x-0 bottom-3 px-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={() => setOpenModal(true)}
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-900/90 hover:bg-slate-950 text-white backdrop-blur-md border border-white/10 flex items-center justify-center gap-1.5 shadow-lg transition-colors"
            >
              <FiEye size={14} />
              <span>Quick View</span>
            </button>
            <Link
              to={`/product-details/${shoe._id}`}
              className="py-2 px-3 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1 shadow-lg transition-colors"
              title="View Product"
            >
              <FiShoppingBag size={14} />
            </Link>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col flex-grow justify-between text-left">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
              <span className="uppercase font-semibold tracking-wider text-[11px] text-amber-600 dark:text-amber-400">
                {shoe.category || "Leather Footwear"}
              </span>
              <div className="flex items-center text-amber-500 gap-1 text-xs">
                <FiStar className="fill-amber-500" />
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {shoe.rating || "4.8"}
                </span>
              </div>
            </div>

            <Link
              to={`/product-details/${shoe._id}`}
              className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1 hover:text-amber-500 transition-colors"
              title={shoe.name}
            >
              {shoe.name}
            </Link>
          </div>

          {/* Pricing */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                ৳ {discountedPrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="text-xs line-through text-slate-400 dark:text-slate-500">
                  ৳ {mainPrice.toLocaleString()}
                </span>
              )}
            </div>

            <Link
              to={`/product-details/${shoe._id}`}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 underline underline-offset-4 transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        centered
        width={700}
        className="luxury-modal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 pt-4">
          <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={shoe.mainImage}
              alt={shoe.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                {shoe.category || "Authentic Leather"}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {shoe.name}
              </h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-extrabold text-amber-500">
                  ৳ {discountedPrice.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-sm line-through text-slate-400">
                    ৳ {mainPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                Handcrafted from premium leather, offering maximum durability, refined style, and supreme comfort.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
              <button
                onClick={() => {
                  setOpenModal(false);
                  navigate(`/product-details/${shoe._id}`);
                }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-md"
              >
                Go to Full Product Page
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LuxuryProductCard;
