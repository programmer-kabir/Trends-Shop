import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar, AiOutlineExclamationCircle } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCartPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { fetchShoes } from "../Redux/Shoes/shoesSlice";
import Rating from "react-rating";
const Wishlist = () => {
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchShoes());
  }, [dispatch]);
  const [favorites, setFavorites] = useState([]);

  const FavoriteDataRaw = localStorage.getItem("favoriteTShirt");
  const FavoriteData = FavoriteDataRaw ? JSON.parse(FavoriteDataRaw) : [];
  const favoriteTShirts = Shoes.filter((shirt) =>
    FavoriteData.includes(shirt._id)
  );
  console.log(favoriteTShirts);
  useEffect(() => {
    const rawData = localStorage.getItem("favoriteTShirt");
    if (rawData) {
      setFavorites(JSON.parse(rawData));
    }
  }, []);
const handleDelete = (id) => {
  const updatedArray = favorites.filter((storedId) => storedId !== id);
  setFavorites(updatedArray);
  localStorage.setItem("favoriteTShirt", JSON.stringify(updatedArray));
  // Trigger the storage event manually
  window.dispatchEvent(new Event("storage"));
  toast.success("Successfully deleted!");
};

  return (
    <section className="pt-2">
      <div className="h-[306px] bg-[#f1f1f1] flex flex-col items-center justify-center">
        <h2 className="text-7xl font-semibold pb-2">My WishList</h2>
        {/* <Breadcrumb name={"wishlist"} /> */}
      </div>
      {/*  */}
      {/* <Content> */}
      <Link to="/shop">
        <div className="flex hover:text-[#F62977] items-center gap-3 bg-[#f1f1f1] px-7 py-4 mt-10">
          <p className="text-base">Continue Shopping </p>
          {/* <IoIosUndo size={25} /> */}
        </div>
      </Link>
      {/* </Content> */}
      {/* section */}
      <div className="md:w-2/3 mx-auto">
        <div className="p-6  sm:p-10 primaryColor">
          {favoriteTShirts.length === 0 && (
            <div className="flex mx-auto gap-2 items-center border border-teal-100 md:w-1/2 px-5 text-center py-5 rounded-xl">
              <AiOutlineExclamationCircle />{" "}
              <span>You did not book any T Shirt yet!</span>
            </div>
          )}
          {favoriteTShirts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">
                Your Favorite List : {favoriteTShirts.length}
              </h2>
              {favoriteTShirts.map((tShirt) => (
                <div key={tShirt._id}>
                  <div className="flex flex-col space-y-4 ">
                    <ul className="flex flex-col border-b">
                      <li className="flex flex-col py-4 sm:flex-row sm:justify-between">
                        <div className="flex w-full space-x-2 sm:space-x-4">
                          <img
                            className="flex-shrink-0 object-cover w-20 h-20 dark:border-transparent rounded outline-none sm:w-32 sm:h-32 dark:bg-gray-500"
                            src={tShirt?.mainImage}
                            alt="Polaroid camera"
                          />
                          <div className="flex flex-col justify-between w-full pb-4">
                            <div className="flex justify-between w-full pb-2 space-x-2">
                              <div className="space-y-1">
                                <h3 className="text-lg font-semibold  sm:pr-8">
                                  {tShirt?.name}
                                </h3>
                                <p className="text-sm font-medium">
                                  Product Code: {tShirt?.Description?.Item_code}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold">
                                  TK {tShirt?.price}
                                </p>
                                <div className="mt-1">
                                  <Rating
                                    className="mt-1"
                                    readonly
                                    placeholderRating={tShirt?.star}
                                    emptySymbol={
                                      <AiFillStar color="#D6D6D6" size={16} />
                                    }
                                    placeholderSymbol={
                                      <AiFillStar color="#FF9933" size={16} />
                                    }
                                    fullSymbol={
                                      <AiFillStar color="#FF9933" size={16} />
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex text-sm divide-x">
                              <button
                                onClick={() => handleDelete(tShirt._id)}
                                type="button"
                                className="flex items-center px-2 py-1 pl-0 space-x-1"
                              >
                                <RiDeleteBin6Line className="w-4 h-4 fill-current" />
                                <span>Remove</span>
                              </button>
                              <button
                                onClick={() => handleAddToCart(tShirt._id)}
                                type="button"
                                // disabled={isClassBooked(tShirt._id)}
                                className="flex gap-1 items-center px-2 py-1 pl-2"
                              >
                                <FaCartPlus className="w-4 h-4 fill-current" />
                                <span>Add to Cart</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
