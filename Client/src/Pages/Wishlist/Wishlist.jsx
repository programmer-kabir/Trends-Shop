import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiHeart,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
  FiStar,
  FiCheck,
  FiExternalLink,
  FiPackage,
  FiTag,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";
import toast from "../../Components/Toast/LuxuryToast";
import { fetchShoes } from "../Redux/Shoes/shoesSlice";
import { fetchBooked } from "../Redux/Booked/bookedSlice";
import {
  FavoritesContext,
  getStoredFavorites,
  setStoredFavorites,
} from "../../Provider/FavoritesContext";
import useAuth from "../../Components/Hooks/useAuth";
import axios from "axios";
import LoadingSpinner from "../../Components/Design/LoadingSpinner/LoadingSpinner";

const Wishlist = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading: isBookedLoading, Booked = [] } = useSelector(
    (state) => state.Booked || {}
  );
  const { isLoading: isShoesLoading, Shoes = [] } = useSelector(
    (state) => state.Shoes || {}
  );

  const [favorites, setFavorites] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const { updateFavoriteCount } = useContext(FavoritesContext);

  useEffect(() => {
    dispatch(fetchShoes());
    if (user?.email) {
      dispatch(fetchBooked(user.email));
    }
  }, [dispatch, user?.email]);

  useEffect(() => {
    setFavorites(getStoredFavorites());
  }, []);

  const favoriteShoes = React.useMemo(() => {
    return Shoes.filter((shoe) => favorites.includes(shoe._id));
  }, [Shoes, favorites]);

  // Initialize selected size with shoe's first size if not set
  useEffect(() => {
    const initialSizes = {};
    favoriteShoes.forEach((shoe) => {
      if (shoe.size && shoe.size.length > 0 && !selectedSizes[shoe._id]) {
        initialSizes[shoe._id] = shoe.size[0];
      }
    });
    if (Object.keys(initialSizes).length > 0) {
      setSelectedSizes((prev) => ({ ...prev, ...initialSizes }));
    }
  }, [favoriteShoes, selectedSizes]);

  const handleSelectSize = (shoeId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [shoeId]: size,
    }));
  };

  const handleDelete = (id) => {
    const updatedArray = favorites.filter((storedId) => storedId !== id);
    setFavorites(updatedArray);
    setStoredFavorites(updatedArray);
    updateFavoriteCount();
    window.dispatchEvent(new Event("storage"));
    toast.success("Footwear removed from your wishlist.", {
      title: "Wishlist Updated 🗑️",
      badge: "Removed",
    });
  };

  const handleAddToCart = async (shoe) => {
    if (!user) {
      toast.warning("Please sign in to add footwear to your shopping cart.", {
        title: "Authentication Required 🔒",
      });
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const currentSize = selectedSizes[shoe._id] || (shoe.size && shoe.size[0]);

    if (!currentSize) {
      toast.warning("Please choose your shoe size before adding to cart.", {
        title: "Size Required ⚠️",
      });
      return;
    }

    const mainPrice = Number(shoe.price) || 0;
    const discount = Number(shoe.Discount) || 0;
    const updatePrice = discount > 0 ? mainPrice - (mainPrice * discount) / 100 : mainPrice;

    // Check if already in booked cart
    const alreadyBooked = Booked.find((b) => b.productId === shoe._id);
    if (alreadyBooked) {
      toast.info(`${shoe.name} is already in your active cart.`, {
        title: "Already in Cart 🛍️",
        badge: `Size ${currentSize}`,
      });
      return;
    }

    const bookingPayload = {
      productId: shoe._id,
      size: currentSize,
      productName: shoe.name,
      price: updatePrice,
      discount: discount,
      quantity: 1,
      email: user.email,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/booked`,
        bookingPayload
      );

      if (res.data?.insertedId || res.data?.updateResult?.acknowledged) {
        toast.success(`${shoe.name} moved from wishlist to your cart.`, {
          title: "Added to Cart 🛍️",
          badge: `Size ${currentSize}`,
          amount: `৳ ${updatePrice.toLocaleString()}`,
        });
        handleDelete(shoe._id);
        dispatch(fetchBooked(user.email));
      } else {
        toast.error("Could not add to cart. Please try again.");
      }
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("Something went wrong while booking the footwear.");
    }
  };

  // Calculate total wishlist value
  const totalWishlistValue = favoriteShoes.reduce((sum, shoe) => {
    const price = Number(shoe.price) || 0;
    const disc = Number(shoe.Discount) || 0;
    const finalPrice = disc > 0 ? price - (price * disc) / 100 : price;
    return sum + finalPrice;
  }, 0);

  const isPortal = location.pathname.startsWith("/user");

  const isInitialLoading = isShoesLoading && Shoes.length === 0;

  if (isInitialLoading) {
    return (
      <LoadingSpinner
        message="Loading Private Wishlist..."
        subMessage="Curating your personal collection of handcrafted footwear"
      />
    );
  }

  return (
    <div
      className={`w-full min-h-screen bg-slate-50 dark:bg-[#0c0f17] text-slate-800 dark:text-slate-100 ${
        isPortal ? "p-4 sm:p-6 lg:p-8" : "pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      }`}
    >
      <div className={`${isPortal ? "max-w-7xl mx-auto" : ""} space-y-8`}>
        {/* TOP HEADER & ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              {isPortal ? (
                <>
                  <Link to="/user/dashboard" className="hover:underline">
                    Portal
                  </Link>
                  <span>/</span>
                  <span>Wishlist</span>
                </>
              ) : (
                <>
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                  <span>/</span>
                  <span>Saved Wishlist</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                <FiHeart className="w-6 h-6 fill-current" />
              </span>
              Curated Footwear Wishlist
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your saved luxury handcrafted pairs ready to be added to your bespoke collection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/products"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
            >
              <RiSparklingFill className="w-4 h-4" />
              <span>Explore Atelier</span>
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Saved Footwear
              </span>
              <span className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
                <FiHeart className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {favoriteShoes.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">Pairs Saved</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Estimated Wishlist Value
              </span>
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FiTag className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ৳{totalWishlistValue.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">BDT</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Availability
              </span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FiPackage className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {favoriteShoes.length > 0 ? "Ready for Atelier Crafting" : "Catalog Available"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* WISHLIST LIST / CARDS */}
        {favoriteShoes.length === 0 ? (
          <div className="bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-500/10 text-pink-500 dark:text-pink-400 flex items-center justify-center border border-pink-500/20">
              <FiHeart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Atelier Wishlist is Empty
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You haven't saved any handcrafted luxury footwear to your wishlist yet. Discover our master collection of oxfords, loafers, moccasins, and trainers.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/products"
                className="px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition shadow-md shadow-amber-500/20 flex items-center gap-2"
              >
                <RiSparklingFill className="w-4 h-4" />
                <span>Explore Footwear Collection</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {favoriteShoes.map((shoe) => {
              const mainPrice = Number(shoe.price) || 0;
              const discount = Number(shoe.Discount) || 0;
              const updatePrice = discount > 0 ? mainPrice - (mainPrice * discount) / 100 : mainPrice;
              const currentSize = selectedSizes[shoe._id] || (shoe.size && shoe.size[0]);

              return (
                <div
                  key={shoe._id}
                  className="group bg-white dark:bg-[#141824] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Row: Thumbnail + Details */}
                    <div className="flex gap-4">
                      <Link
                        to={`/product-details/${shoe._id}`}
                        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex-shrink-0"
                      >
                        <img
                          src={shoe.mainImage || shoe.image}
                          alt={shoe.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop";
                          }}
                        />
                        {discount > 0 && (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                            -{discount}%
                          </span>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {shoe.category || "Luxury Footwear"}
                          </span>

                          <button
                            onClick={() => handleDelete(shoe._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                            title="Remove from wishlist"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          <Link
                            to={`/product-details/${shoe._id}`}
                            className="hover:text-amber-500 transition"
                          >
                            {shoe.name}
                          </Link>
                        </h3>

                        {shoe.Description?.Item_code && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            Code: {shoe.Description.Item_code}
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                            ৳{updatePrice.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                              ৳{mainPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Size Selector */}
                    {shoe.size && Array.isArray(shoe.size) && shoe.size.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Select Size:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {currentSize || "Choose a size"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {shoe.size.map((sz, idx) => {
                            const isSelected = currentSize === sz;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectSize(shoe._id, sz)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                                  isSelected
                                    ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                                    : "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-500/50"
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(shoe)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <FiShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>

                    <Link
                      to={`/product-details/${shoe._id}`}
                      className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1"
                    >
                      <span>Details</span>
                      <FiExternalLink className="w-3 h-3 opacity-70" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
