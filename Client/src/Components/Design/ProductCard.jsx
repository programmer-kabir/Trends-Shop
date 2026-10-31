import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Card, Space } from "antd";
import { FaCartPlus, FaRegHeart } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import toast from "../Toast/LuxuryToast";
import { Tooltip } from "react-tooltip";
import useAuth from "../Hooks/useAuth";
import useAdmin from "../Hooks/useAdmin";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchBooked } from "../../Pages/Redux/Booked/bookedSlice";
import {
  FavoritesContext,
  getStoredFavorites,
  setStoredFavorites,
} from "../../Provider/FavoritesContext";

const ProductCard = ({ shoes }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [isAdmin] = useAdmin();

  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSize, setActiveSize] = useState(null);

  useEffect(() => {
    const storedIds = getStoredFavorites();
    setIsFavorite(storedIds.includes(shoes._id));
  }, [shoes._id]);

  const { updateFavoriteCount } = useContext(FavoritesContext);

  const handleAddToFavorite = (id) => {
    const storedIds = getStoredFavorites();

    if (!storedIds.includes(id)) {
      storedIds.push(id);
      setStoredFavorites(storedIds);
      setIsFavorite(true);

      // Update the favorite count using context function
      updateFavoriteCount();

      toast.success(`${shoes.name} added to your favorites.`, {
        title: "Added to Favorites ❤️",
        badge: shoes.category || "Footwear",
        amount: `৳ ${updatePrice}`,
      });
    } else {
      toast.warning(`${shoes.name} is already in your favorites.`, {
        title: "Already Favorited ⭐",
      });
    }
  };
  const [isHoveredHeart, setIsHoveredHeart] = useState(false);
  const [isHoveredCompare, setIsHoveredCompare] = useState(false);
  //
  const mainPrice = shoes.price;
  let updatePrice;
  const discount = shoes?.Discount;

  if (discount) {
    // Calculate the updated price with the discount
    updatePrice = mainPrice - mainPrice * (discount / 100);
  } else {
    updatePrice = mainPrice;
  }
  const handleSizeClick = (size) => {
    setActiveSize(size);
  };
  // Add to Cart
  const handleAddToCart = (id) => {
    if (shoes?.stock === shoes?.selling) {
      toast.error("This item is currently sold out.", {
        title: "Out of Stock 📦",
        badge: shoes.name,
      });
      return; // Prevent adding to the cart if stock is out
    }
    if (!activeSize) {
      toast.warning("Please choose a shoe size before adding to cart.", {
        title: "Size Required ⚠️",
      });
    } else {
      const data = {
        productId: id,
        size: activeSize,
        productName: shoes.name,
        price: updatePrice,
        discount: discount,
        quantity: 1,
        email: user.email,
      };
      axios
        .post(`${import.meta.env.VITE_LOCALHOST_KEY}/booked`, data)
        .then((res) => {
          if (user?.email) {
            dispatch(fetchBooked(user.email));
          }
          if (res.data?.updateResult?.acknowledged) {
            toast.success(`${shoes.name} quantity increased in your bag.`, {
              title: "Bag Updated 🛍️",
              badge: `Size ${activeSize}`,
              amount: `৳ ${updatePrice}`,
            });
          } else if (res.data?.insertedId) {
            toast.success(`${shoes.name} has been added to your shopping bag.`, {
              title: "Added to Bag 🛍️",
              badge: `Size ${activeSize}`,
              amount: `৳ ${updatePrice}`,
            });
          } else {
            toast.error("Failed to add to cart");
          }
        });
    }
  };

  return (
    <div>
      <div className="bg-gray-100 px-1 md:px-0 pb-1 rounded-md">
        <div className="relative ">
          <div className="group relative block">
            <Link to={`../product-details/${shoes._id}`}>
              <div className="relative">
                <div className="absolute  z-10 overflow-visible">
                  {shoes?.Discount ? (
                    <>
                      {" "}
                      <Badge.Ribbon
                        placement="start"
                        color="#f50400"
                        text={`Discount ${shoes.Discount}%`}
                      ></Badge.Ribbon>
                    </>
                  ) : (
                    <></>
                  )}{" "}
                </div>
                {/* Fixed height for the image container */}
                <div className="overflow-hidden rounded-md hover:rounded">
                  <img
                    src={shoes.mainImage}
                    alt=""
                    className="w-full   h-[305px] object-cover transition group-hover:scale-105"
                  />
                </div>
              </div>
            </Link>
            <div className="absolute bottom-0 w-full overflow-hidden">
              <div className="duration-500 translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <button
                  onClick={() => handleAddToCart(shoes._id)}
                  className={`primaryButton hidden md:flex items-center justify-center w-full uppercase font-black ${
                    isAdmin ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isAdmin}
                >
                  <FiPlus />
                  order
                </button>
              </div>
            </div>

            <div className="absolute md:hidden bottom-0 w-full overflow-hidden">
              <div className="duration-500 ">
                <button
                  onClick={() => handleAddToCart(shoes._id)}
                  className={`primaryButton hidden md:flex items-center justify-center w-full uppercase font-black ${
                    isAdmin ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isAdmin}
                >
                  <FiPlus />
                  order
                </button>
              </div>
            </div>

            {/* Additional content */}
            <div className="right-2 cursor-pointer absolute top-10">
              <div className="translate-x-4 duration-500  space-y-3 transform opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                <a
                  data-tooltip-id="favorite"
                  data-tooltip-content="Add To Wishlist"
                  data-tooltip-place="left"
                >
                  <Tooltip id="favorite" />

                  <div
                    onClick={() => {
                      if (!isAdmin) {
                        handleAddToFavorite(shoes._id);
                      }
                    }}
                    className={`hover:bg-[#f50400] p-2 ${
                      isFavorite ? "bg-[#f50400] text-white" : "bg-white"
                    }`}
                    style={{
                      boxShadow:
                        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                      transition: "background-color 0.3s",
                      cursor: isAdmin ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={() => setIsHoveredHeart(true)}
                    onMouseLeave={() => setIsHoveredHeart(false)}
                  >
                    <FaRegHeart
                      size={20}
                      color={isHoveredHeart ? "white" : ""}
                    />
                  </div>
                </a>

                <button
                  onClick={() => {
                    if (!isAdmin) {
                      handleAddToCart(shoes._id);
                    }
                  }}
                  data-tooltip-id="favorite"
                  data-tooltip-content="Add To Cart"
                  data-tooltip-place="left"
                  className={`bg-white hover:bg-[#f50400] p-2 shadow-lg ${
                    isAdmin ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                  }`}
                  style={{
                    boxShadow:
                      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={() => setIsHoveredCompare(true)}
                  onMouseLeave={() => setIsHoveredCompare(false)}
                  disabled={isAdmin} // You can still disable the button if needed
                >
                  <Tooltip id="favorite" />
                  <FaCartPlus
                    size={20}
                    color={isHoveredCompare ? "white" : "#000 "}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-2 px-2">
          <p className="text-base font-medium">{shoes.name}</p>
          <div className="flex gap-2 pt-2">
            {shoes?.Discount ? (
              <div>
                <p className="line-through flex text-[#4D4F53] text-xl">
                  {shoes.price}৳
                </p>
              </div>
            ) : (
              <p className="text-[#4D4F53] text-xl">{shoes.price}৳</p>
            )}
            <p></p>
            {shoes?.Discount ? (
              <p className="text-[#f50400] flex items-center gap-4 font-semibold text-xl">
                {updatePrice}৳
                <span className="text-sm pt-2" >
                  {shoes?.stock === shoes?.selling ? (
                    <p className="text-red-500 font-medium">Stock Out</p>
                  ) : (
                    <p className="text-green-500 font-medium">
                      Available: {shoes?.stock - shoes?.selling}
                    </p>
                  )}
                </span>
              </p>
            ) : (
              <></>
            )}
          </div>
          {/* / */}
          <div className="py-3">
            <h2 className="font-medium pb-1">Select Your Size:</h2>
            {shoes?.size.map((size, index) => (
              <button
                key={index}
                onClick={() => handleSizeClick(size)}
                className={`mx-2 py-1 px-2 border-2 font-medium ${
                  activeSize === size
                    ? "border-[#f50400] bg-[#f50400] text-white"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
