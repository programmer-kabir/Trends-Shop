import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../Redux/Shoes/shoesSlice";
import Content from "../../Components/Content/Content";
import Rating from "react-rating";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiHeart, FiPhone } from "react-icons/fi";
import { WishListDataContext } from "../../Components/Context/WishlistData";
import toast from "react-hot-toast";
import useAuth from "../../Components/Hooks/useAuth";
import axios from "axios";
import DeliveryOption from "../../Components/Design/DeliveryOption";
import Faqs from "../Faqs/Faqs";
import Reviews from "../Reviews/Reviews";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);

  useEffect(() => {
    dispatch(fetchShoes());
  }, [dispatch]);

  // Ensure `Shoes` is loaded before trying to find `currentShoe`
  const currentShoe = Shoes?.find((shoe) => shoe._id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("mainImage");
  const [activeSize, setActiveSize] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);

  const { favoriteTShirtCount, setFavoriteTShirtCount } =
    useContext(WishListDataContext);

  // Tabs
  const [activeTab, setActiveTab] = useState("Reviews");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  useEffect(() => {
    // Check if the current product is in favorites when component mounts
    const storedIdsString = localStorage.getItem("favoriteTShirt");
    const storedIds = storedIdsString ? JSON.parse(storedIdsString) : [];
    setIsFavorite(storedIds.includes(currentShoe?._id));
  }, [currentShoe?._id]);

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
  const handleImageChange = (imageProperty) => {
    setSelectedImage(imageProperty);
  };

  const handleSizeClick = (size) => {
    setActiveSize(size);
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // If loading or no shoe data, return a loading spinner or message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentShoe) {
    return <div>Product not found</div>;
  }
  const mainPrice = currentShoe.price;
  let updatePrice;
  const discount = currentShoe?.Discount;

  if (discount) {
    // Calculate the updated price with the discount
    updatePrice = mainPrice - mainPrice * (discount / 100);
  } else {
    updatePrice = mainPrice;
  }
  const handleAddToCart = (id) => {
    if (!activeSize) {
      toast.error("Please Select Your size");
    } else {
      const data = {
        productId: id,
        size: activeSize,
        productName: currentShoe.name,
        price: updatePrice,
        discount: discount,
        quantity: 1,
        email: user.email,
      };
      axios
        .post(`${import.meta.env.VITE_LOCALHOST_KEY}/booked`, data)
        .then((data) => {
          console.log(data.data);
          if (data.data?.updateResult?.acknowledged) {
            toast.success(`${currentShoe.name} quantity updated in the cart`);
          } else if (data.data?.insertedId) {
            toast.success(`${currentShoe.name} added to the cart`);
          } else {
            toast.error("Failed to add to cart");
          }
        });
    }
  };
  const onFinish = (values) => {
    const formData = {
      productId: id,
      ...values,
      rating,
      name: user?.displayName || "Anonymous",
      email: user?.email || "anonymous@example.com",
    };
    if (!formData.rating) {
      toast.error("Give your Star");
      return;
    }
    // console.log("Submitted Data:", formData);
    axios
      .post(`${import.meta.env.VITE_LOCALHOST_KEY}/reviews`, formData)
      .then((response) => {
        const data = response.data;
        if (data.insertedId) {
          toast.success("Thanks For your review");
        }
      });
  };
  return (
    <div>
      <div className="bg-white">
        <Content>
          <section className="w-full">
            <div className="md:flex gap-7">
              <div className="md:w-3/4 w-full">
                <div className="grid md:grid-cols-2">
                  {/* Left Side */}
                  <div>
                    <div className="md:h-[400px] md:flex-none flex items-center justify-center md:justify-start overflow-hidden rounded-lg">
                      <img
                        className="w-2/3 h-full  object-fill"
                        src={currentShoe[selectedImage]}
                        alt=""
                      />
                    </div>

                    <div className="flex gap-1 items-center">
                      {Object.keys(currentShoe).map((key) => {
                        if (key.endsWith("Image")) {
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleImageChange(key)}
                              className={`aspect-square mb-3 h-20 p-1 overflow-hidden rounded-sm border ${
                                key === selectedImage
                                  ? "border-blue-700"
                                  : "border-transparent"
                              } text-center`}
                            >
                              <img
                                className="h-full w-full object-cover"
                                src={currentShoe[key]}
                                alt=""
                              />
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                  {/* Right Side */}
                  <div className="pt-10 space-y-1">
                    <h2 className="text-xl font-semibold">
                      {currentShoe?.name}
                    </h2>
                    <p className="">{currentShoe?.shortDescription}</p>
                    <div className="flex items-center gap-2">
                      <Rating
                        className="mt-1"
                        readonly
                        placeholderRating={currentShoe?.star}
                        emptySymbol={<AiFillStar color="#D6D6D6" size={16} />}
                        placeholderSymbol={
                          <AiFillStar color="#FF9933" size={16} />
                        }
                        fullSymbol={<AiFillStar color="#FF9933" size={16} />}
                      />
                      <span className="text-gray-600">
                        {currentShoe?.reviews?.length} Review(s)
                      </span>
                    </div>
                    <div>
                      <p className="pt-1">
                        Select a size: <span className="text-red-700">*</span>
                      </p>

                      <div className="pt-3">
                        {currentShoe?.size.map((size, index) => (
                          <button
                            key={index}
                            onClick={() => handleSizeClick(size)}
                            className={`mx-2 py-1 px-2 border-2 font-medium ${
                              activeSize === size
                                ? "border-blue-500 text-blue-500"
                                : "border-gray-300 text-gray-700"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-3 w-full pt-5 pb-8">
                        <div className="flex items-center gap-1 border border-gray-500 rounded w-[100px]  md:w-[144px]">
                          <input
                            type="text"
                            id="Quantity"
                            value={quantity}
                            className="h-10 outline-none w-6 md:w-10 md:pl-5 border-gray-200 text-center"
                            readOnly
                          />
                          <button
                            type="button"
                            onClick={handleDecrement}
                            className="w-7 h-7  md:mr-2 mx-1 md:ml-3 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition hover:opacity-75"
                          >
                            &minus;
                          </button>
                          <button
                            type="button"
                            onClick={handleIncrement}
                            className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition hover:opacity-75"
                          >
                            +
                          </button>
                        </div>
                        <button
    onClick={() => handleAddToCart(currentShoe._id)}
    className="uppercase flex items-center gap-2 border hover:bg-white hover:text-[#4096ff] hover:border-[#4096ff] bg-[#f50400] text-white rounded-sm font-semibold px-6 py-2 transform transition-transform duration-200 ease-in-out hover:scale-105"
>
    <MdOutlineShoppingBag size={24} />
    Add to Cart
</button>

                        <button
                          className={` border border-[#398EFA] px-2 py-2 rounded ${
                            isFavorite
                              ? "bg-[#f50400] border-none text-white"
                              : "bg-white"
                          }`}
                          onClick={() => handleAddToFavorite(currentShoe._id)}
                        >
                          <FiHeart size={25} />
                        </button>
                      </div>
                      <div className="py-4 flex hover:text-blue-400 items-center gap-3 border-y">
                        <FiPhone size={33} />
                        <p className="font-semibold text-xl">
                          Call For Order: 09613-800800
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/4">
                <DeliveryOption />
              </div>
            </div>

            <div className="pt-7 md:pt-0">
              {/* Dropdown for small screens */}
              <div className="sm:hidden border border-gray-200 p-2 rounded-md">
                <label htmlFor="Tab" className="sr-only">
                  Tab
                </label>
                <select
                  id="Tab"
                  className="w-full rounded-md border-gray-200"
                  value={activeTab}
                  onChange={(e) => handleTabClick(e.target.value, e)}
                >
                  <option>Reviews</option>
                  <option>FAQ</option>
                </select>
              </div>

              {/* Tabs for larger screens */}
              <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex gap-6">
                    {["Reviews", "FAQ"].map((tab) => (
                      <button
                        key={tab}
                        onClick={(e) => handleTabClick(tab, e)}
                        className={`shrink-0 border  p-3 text-sm font-medium ${
                          activeTab === tab
                            ? "text-sky-600 border-b-white rounded-t-lg border-gray-300"
                            : "text-gray-500 border-transparent hover:text-gray-700"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 md:px-12">
                {activeTab === "Reviews" && (
                  <div className="md:w-3/4 w-full mx-auto ">
                    <Reviews setRating={setRating} onFinish={onFinish} />
                  </div>
                )}
                {activeTab === "FAQ" && (
                  <div>
                    <Faqs />
                  </div>
                )}
              </div>
            </div>
          </section>
        </Content>
      </div>
    </div>
  );
};

export default ProductDetails;
