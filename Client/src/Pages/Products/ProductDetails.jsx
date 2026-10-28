import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../Redux/Shoes/shoesSlice";
import Content from "../../Components/Content/Content";
import Rating from "react-rating";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineShoppingBag, MdElectricBolt } from "react-icons/md";
import { FiHeart, FiPhone, FiCheck, FiChevronRight, FiShield, FiTruck, FiRefreshCw, FiZoomIn } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import toast from "react-hot-toast";
import useAuth from "../../Components/Hooks/useAuth";
import axios from "axios";
import DeliveryOption from "../../Components/Design/DeliveryOption";
import Faqs from "../Faqs/Faqs";
import Reviews from "../Reviews/Reviews";
import { FavoritesContext } from "../../Provider/FavoritesContext";
import LoadingSpinner from "../../Components/Design/LoadingSpinner/LoadingSpinner";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);

  useEffect(() => {
    dispatch(fetchShoes());
  }, [dispatch]);

  const currentShoe = Shoes?.find((shoe) => shoe._id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("mainImage");
  const [activeSize, setActiveSize] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(5);
  const [activeTab, setActiveTab] = useState("Reviews");

  // Mouse hover zoom states
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomPos({ x: 50, y: 50 });
  };

  const { updateFavoriteCount } = useContext(FavoritesContext);

  useEffect(() => {
    if (currentShoe) {
      const storedIdsString = localStorage.getItem("favoriteTShirt");
      const storedIds = storedIdsString ? JSON.parse(storedIdsString) : [];
      setIsFavorite(storedIds.includes(currentShoe._id));
      if (Array.isArray(currentShoe.size) && currentShoe.size.length > 0 && !activeSize) {
        setActiveSize(currentShoe.size[0]);
      }
    }
  }, [currentShoe]);

  const toggleFavorite = () => {
    if (!currentShoe) return;
    const storedIdsString = localStorage.getItem("favoriteTShirt");
    let storedIds = storedIdsString ? JSON.parse(storedIdsString) : [];

    if (storedIds.includes(currentShoe._id)) {
      storedIds = storedIds.filter((itemId) => itemId !== currentShoe._id);
      setIsFavorite(false);
      toast.success("Removed from wishlist");
    } else {
      storedIds.push(currentShoe._id);
      setIsFavorite(true);
      toast.success("Added to wishlist ❤️");
    }
    localStorage.setItem("favoriteTShirt", JSON.stringify(storedIds));
    updateFavoriteCount(storedIds.length);
  };

  const handleImageChange = (imageKey) => {
    setSelectedImage(imageKey);
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B0F19] min-h-[60vh]">
        <LoadingSpinner />
        <p className="text-xs text-slate-400 mt-4 font-semibold uppercase tracking-wider">
          Loading Luxury Footwear Details...
        </p>
      </div>
    );
  }

  if (!currentShoe) {
    return (
      <div className="py-24 text-center bg-slate-50 dark:bg-[#0B0F19] min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Footwear Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          The selected pair may be out of stock or no longer available in this season's catalog.
        </p>
        <Link
          to="/products/ALL"
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
        >
          Back to Footwear Catalog
        </Link>
      </div>
    );
  }

  const mainPrice = Number(currentShoe.price) || 0;
  const discount = Number(currentShoe?.Discount) || 0;
  const finalPrice = discount
    ? Math.round(mainPrice - mainPrice * (discount / 100))
    : mainPrice;

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to your cart");
      return navigate("/login");
    }
    if (!activeSize) {
      return toast.error("Please select a shoe size");
    }
    const data = {
      productId: currentShoe._id,
      size: activeSize,
      productName: currentShoe.name,
      price: finalPrice,
      discount: discount,
      quantity: quantity,
      email: user.email,
    };
    axios
      .post(`${import.meta.env.VITE_LOCALHOST_KEY}/booked`, data)
      .then((res) => {
        if (res.data?.updateResult?.acknowledged) {
          toast.success(`${currentShoe.name} quantity updated in cart`);
        } else if (res.data?.insertedId) {
          toast.success(`${currentShoe.name} added to cart`);
        } else {
          toast.error("Failed to add to cart");
        }
      })
      .catch(() => toast.error("Failed to add to cart"));
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to proceed with instant checkout");
      return navigate("/login");
    }
    navigate(`/CheckOut/${currentShoe._id}`);
  };

  const onFinishReview = (values) => {
    const formData = {
      productId: currentShoe._id,
      ...values,
      rating,
      name: user?.displayName || "Verified Customer",
      email: user?.email || "customer@trendsshop.com",
    };
    if (!formData.rating) {
      toast.error("Please select a star rating");
      return;
    }
    axios
      .post(`${import.meta.env.VITE_LOCALHOST_KEY}/reviews`, formData)
      .then((res) => {
        if (res.data.insertedId) {
          toast.success("Thank you for your verified review!");
        }
      });
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 min-h-screen py-6 md:py-10 transition-colors  mt-5">
      <Content>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
          <FiChevronRight className="text-slate-400" />
          <Link to="/products/ALL" className="hover:text-amber-500 transition-colors">Footwear</Link>
          <FiChevronRight className="text-slate-400" />
          <Link to={`/products/${currentShoe.category.replace(/ /g, "-")}`} className="hover:text-amber-500 transition-colors">
            {currentShoe.category}
          </Link>
          <FiChevronRight className="text-slate-400" />
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
            {currentShoe.name}
          </span>
        </nav>

        {/* Main Product Showcase Card */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Image Gallery Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div 
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-800/60 overflow-hidden border border-slate-200 dark:border-white/10 flex items-center justify-center group shadow-inner cursor-zoom-in"
              >
                {discount > 0 && (
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-extrabold uppercase rounded-lg bg-amber-500 text-slate-950 shadow-md pointer-events-none">
                    -{discount}% OFF
                  </span>
                )}

                {/* Interactive Zoom Indicator Pill */}
                <div className={`absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-300 pointer-events-none ${isZoomed ? "opacity-0 translate-y-1" : "opacity-90"}`}>
                  <FiZoomIn size={13} className="text-amber-400" />
                  <span>Hover to Zoom</span>
                </div>

                <img
                  src={currentShoe[selectedImage] || currentShoe.mainImage}
                  alt={currentShoe.name}
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZoomed ? "scale(2.2)" : "scale(1)",
                  }}
                  className="w-full h-full object-cover transition-transform duration-200 ease-out pointer-events-none select-none"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {["mainImage", "firstImage", "secondImage", "thirdImage"].map((key, idx) => {
                  const imgUrl = currentShoe[key];
                  if (!imgUrl) return null;
                  const isCurrent = selectedImage === key;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleImageChange(key)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        isCurrent
                          ? "border-amber-500 shadow-md scale-105"
                          : "border-slate-200 dark:border-white/10 hover:border-amber-400 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle Product Info Column (4 cols) */}
            <div className="lg:col-span-4 space-y-5 text-left">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
                  <span>{currentShoe.Brand || "Trends Signature"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{currentShoe.category}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentShoe.name}
                </h1>
                
                {/* Rating & Reviews */}
                <div className="flex items-center gap-2.5 mt-2">
                  <Rating
                    readonly
                    initialRating={currentShoe.star || 5}
                    emptySymbol={<AiFillStar className="text-slate-300 dark:text-slate-600 text-base" />}
                    fullSymbol={<AiFillStar className="text-amber-500 text-base" />}
                  />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    ({currentShoe.star || 5}.0) • {currentShoe.selling || 12} Sold
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  ৳{finalPrice.toLocaleString()}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      ৳{mainPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-extrabold bg-amber-500 text-slate-950">
                      Save ৳{(mainPrice - finalPrice).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentShoe.shortDescription}
              </p>

              {/* Size Selector */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Select Size (EU):
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold cursor-pointer hover:underline">
                    Fit Advisor Guide
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(currentShoe.size) ? currentShoe.size : [currentShoe.size]).map((sz, idx) => {
                    const isSelected = activeSize === sz;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveSize(sz)}
                        className={`w-11 h-11 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/25 scale-105"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-amber-400"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-1">
                    <button
                      onClick={handleDecrement}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-extrabold text-sm text-slate-800 dark:text-slate-100">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors border border-white/10"
                  >
                    <MdOutlineShoppingBag size={18} />
                    <span>Add to Bag</span>
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={toggleFavorite}
                    className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
                    title="Wishlist"
                  >
                    {isFavorite ? (
                      <FaHeart className="text-red-500 text-lg" />
                    ) : (
                      <FiHeart className="text-lg" />
                    )}
                  </button>
                </div>

                {/* Instant Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
                >
                  <MdElectricBolt size={18} />
                  <span>Instant Checkout / Buy Now</span>
                </button>
              </div>

              {/* Call Hotline */}
              <div className="py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 flex items-center gap-3">
                <FiPhone className="text-amber-500 text-lg" />
                <div>
                  <p className="text-[11px] text-slate-400">Order by Phone / Helpline</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    +880 1800-TRENDS (09613-800800)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Delivery & Trust Column (3 cols) */}
            <div className="lg:col-span-3">
              <DeliveryOption />
            </div>
          </div>
        </div>

        {/* Reviews and FAQ Tabs */}
        <div className="mt-12 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex border-b border-slate-200 dark:border-white/10 mb-6">
            {["Reviews", "FAQ"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {tab === "Reviews" ? `Customer Reviews (${currentShoe.reviews?.length || 0})` : "Footwear FAQs"}
              </button>
            ))}
          </div>

          <div>
            {activeTab === "Reviews" && (
              <div className="max-w-3xl mx-auto">
                <Reviews setRating={setRating} onFinish={onFinishReview} />
              </div>
            )}
            {activeTab === "FAQ" && (
              <div>
                <Faqs />
              </div>
            )}
          </div>
        </div>
      </Content>
    </div>
  );
};

export default ProductDetails;
