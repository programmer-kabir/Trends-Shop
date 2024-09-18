// import React from "react";
// import Rating from "react-rating";
// import { FaRegStar, FaStar } from "react-icons/fa6";
// const ProductCard = ({ shoes }) => {
//   console.log(shoes);
//   return (
//     <div className="border">
//       <div>
//         <img src={shoes.mainImage} alt="" />
//       </div>
//       <div>
//         <p>{shoes.name}</p>
//         <Rating
//           placeholderRating={3.2}
//           emptySymbol={<FaStar size={19} color="#D6D6D6" />}
//           placeholderSymbol={<FaStar size={19} color="#FF9933" />}
//           fullSymbol={<FaStar size={19} color="#FF9933" />}
//         />
//         <p></p>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, Space } from "antd";
import { FaCartPlus, FaRegHeart } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import "./ss.css";
// import { WishListDataContext } from "../Context/WishlistData";
const ProductCard = ({ shoes }) => {
  // const {setFavoriteTShirtCount} = useContext(WishListDataContext)
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    // Check if the current product is in favorites when component mounts
    const storedIdsString = localStorage.getItem("favoriteTShirt");
    const storedIds = storedIdsString ? JSON.parse(storedIdsString) : [];
    setIsFavorite(storedIds.includes(shoes._id));
  }, [shoes._id]);

  const [storedIds, setId] = useState("");
  const handleAddToFavorite = (id) => {
    const storedIdsString = localStorage.getItem("favoriteTShirt");
    const storedIds = storedIdsString ? JSON.parse(storedIdsString) : [];
    setId(storedIds);

    if (!storedIds.includes(id)) {
      storedIds.push(id);
      localStorage.setItem("favoriteTShirt", JSON.stringify(storedIds));
      setIsFavorite(true);
      setFavoriteTShirtCount((pre) => pre + 1);
      toast.success("Item is added");
    } else {
      toast.error("Item is already a favorite");
    }
  };
  const [isHoveredHeart, setIsHoveredHeart] = useState(false);
  const [isHoveredEye, setIsHoveredEye] = useState(false);
  const [isHoveredCompare, setIsHoveredCompare] = useState(false);
  //
  const mainPrice = shoes.price;
  let updatePrice;
  const discount = shoes?.discount;

  if (discount) {
    // Calculate the updated price with the discount
    updatePrice = mainPrice - mainPrice * (discount / 100);
  } else {
    updatePrice = mainPrice;
  }
  console.log(updatePrice);
  return (
    <div>
      <div className="bg-gray-100 pb-1 rounded-md">
        <div className="relative ">
          <div className="group relative block">
            <Link to={`../product-details/${shoes._id}`}>
              <div className="relative">
                <div className="absolute  z-50 overflow-visible">
                  {shoes?.discount ? (
                    <>
                      {" "}
                      <Badge.Ribbon placement="start" color="#f50400"
                        text={`Discount ${shoes.discount}%`}
                      ></Badge.Ribbon>
                    </>
                  ) : (
                    <></>
                  )}{" "}
                </div>
                {/* Fixed height for the image container */}
                <div className="overflow-hidden rounded-md hover:rounded-md">
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
                <Link to="/checkout">
                  <button className="primaryButton flex items-center justify-center  w-full uppercase font-black">
                    <FiPlus />
                    order
                  </button>
                </Link>
              </div>
            </div>

            {/* Additional content */}
            <div className="right-2 cursor-pointer absolute top-10">
              <div className="translate-x-8 duration-500  space-y-3 transform opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                <a
                  data-tooltip-id="favorite"
                  data-tooltip-content="Add To Wishlist"
                  data-tooltip-place="left"
                >
                  <Tooltip id="favorite" />

                  <div
                    onClick={() => handleAddToFavorite(TShirt._id)}
                    className={` hover:bg-[#f50400] p-2 ${
                      isFavorite ? "bg-[#f50400] text-white" : "bg-white"
                    }`}
                    style={{
                      boxShadow:
                        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                      transition: "background-color 0.3s",
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

                <div
                  data-tooltip-id="favorite"
                  data-tooltip-content="Quick View"
                  data-tooltip-place="left"
                  className="bg-white hover:bg-[#f50400] p-2 shadow-lg"
                  style={{
                    boxShadow:
                      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={() => setIsHoveredEye(true)}
                  onMouseLeave={() => setIsHoveredEye(false)}
                >
                  <Tooltip id="favorite" />
                  <FaRegEye size={20} color={isHoveredEye ? "white" : "#000"} />
                </div>
                <div
                  data-tooltip-id="favorite"
                  data-tooltip-content="Add To Cart"
                  data-tooltip-place="left"
                  className="bg-white  hover:bg-[#f50400] p-2 shadow-lg"
                  style={{
                    boxShadow:
                      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={() => setIsHoveredCompare(true)}
                  onMouseLeave={() => setIsHoveredCompare(false)}
                >
                  <Tooltip id="favorite" />
                  <FaCartPlus
                    size={20}
                    color={isHoveredCompare ? "white" : "#000 "}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-2 px-2">
          <p className="text-base font-medium">{shoes.name}</p>
          <div className="flex gap-2 pt-2">
            {shoes?.discount ? (
              <div>
                <p className="line-through flex text-[#4D4F53] text-xl">
                  {shoes.price}৳
                </p>
              </div>
            ) : (
              <p className="text-[#4D4F53] text-xl">{shoes.price}৳</p>
            )}
            <p></p>
            {shoes?.discount ? (
              <p className="text-[#f50400] font-semibold text-xl">
                {updatePrice}৳
              </p>
            ) : (
              <></>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
