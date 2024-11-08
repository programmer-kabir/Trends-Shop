import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar, AiOutlineExclamationCircle } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCartPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { fetchShoes } from "../Redux/Shoes/shoesSlice";
import Rating from "react-rating";
import { FavoritesContext } from "../../Provider/FavoritesContext";
import { IoIosUndo } from "react-icons/io";
import useAuth from "../../Components/Hooks/useAuth";
import Swal from "sweetalert2";
import axios from "axios";
import { fetchBooked } from "../Redux/Booked/bookedSlice";
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import 'sweetalert2/src/sweetalert2.scss'
const Wishlist = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading: isBookedLoading, Booked } = useSelector(
    (state) => state.Booked
  );
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchShoes());
    dispatch(fetchBooked(user?.email));
  }, [dispatch]);
// console.log(Booked);
  const [favorites, setFavorites] = useState([]);
  const [updateNewPrice, setUpdateNewPrice] = useState(0);
  const { updateFavoriteCount } = useContext(FavoritesContext);

  const FavoriteDataRaw = localStorage.getItem("favoriteTShirt");
  const FavoriteData = FavoriteDataRaw ? JSON.parse(FavoriteDataRaw) : [];
  const favoriteShoes = Shoes.filter((shirt) =>
    FavoriteData.includes(shirt._id)
  );
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
    updateFavoriteCount();
    window.dispatchEvent(new Event("storage"));
    toast.success("Successfully deleted!");
  };
  const [activeSize, setActiveSize] = useState(null);
  const handleSizeClick = (size) => {
    setActiveSize(size);
  };

  const handleAddToCart = (id) => {
    const currentShoe = favoriteShoes.find((shoe) => shoe._id === id);
    const mainPrice = currentShoe.price;
    let updatePrice;
    const discount = currentShoe?.Discount;

    if (discount) {
      // Calculate the updated price with the discount
      updatePrice = mainPrice - mainPrice * (discount / 100);
      setUpdateNewPrice(updatePrice);
    } else {
      updatePrice = mainPrice;
      setUpdateNewPrice(updatePrice);
    }
    if (!user) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Login Now?",
          text: "You Cart is Loading Please Login!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "Your imaginary file is safe :)",
              icon: "error",
            });
          }
        });
    }

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
      const findData = Booked.find((book) => book.productId === id);
      if (findData) {
        toast.error(`${currentShoe.name} is already in your cart`);
        return;
      }
      
      axios
        .post(`${import.meta.env.VITE_LOCALHOST_KEY}/booked`, data)
        .then((data) => {
          console.log(data.data);
          if (data.data?.updateResult?.acknowledged) {
            toast.success(`${currentShoe.name} Your Data has been already Added`);
          }
          else if (data.data?.insertedId) {
            toast.success(`${currentShoe.name} added to the cart`);
            handleDelete(id)
          } else {
            toast.error("Failed to add to cart");
          }
        });
    }
  };
  return (
    <section className="pt-2 w-11/12 mx-auto">
      <div className="h-[306px] bg-[#f1f1f1] flex flex-col items-center justify-center">
        <h2 className="text-7xl font-semibold pb-2">My WishList</h2>
        {/* <Breadcrumb name={"wishlist"} /> */}
      </div>
      {/*  */}
      {/* <Content> */}
      <Link to="/shop">
        <div className="flex hover:text-[#F62977] items-center gap-3 bg-[#f1f1f1] px-7 py-4 mt-10">
          <p className="text-base">Continue Shopping </p>
          <IoIosUndo size={25} />
        </div>
      </Link>
      {/* </Content> */}
      {/* section */}
      <div className="md:w-2/3 mx-auto">
        <div className="p-6  sm:p-10 primaryColor">
          {favoriteShoes.length === 0 && (
            <div className="flex mx-auto gap-2 items-center border border-teal-100 md:w-1/2 px-5 text-center py-5 rounded-xl">
              <AiOutlineExclamationCircle />{" "}
              <span>You did not book any Shoes yet!</span>
            </div>
          )}
          {favoriteShoes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">
                Your Favorite List : {favoriteShoes.length}
              </h2>
             {favoriteShoes.map((tShirt) => {
  // Calculate the discounted price upfront
  const mainPrice = tShirt.price;
  const discount = tShirt?.Discount;
  const updatePrice = discount
    ? mainPrice - mainPrice * (discount / 100)
    : mainPrice;

  return (
    <div key={tShirt._id}>
      <div className="flex flex-col space-y-4 ">
        <ul className="flex flex-col border-b">
          <li className="flex flex-col py-4 sm:flex-row sm:justify-between">
            <div className="flex w-full space-x-2 sm:space-x-4">
              <img
                className="flex-shrink-0 object-cover w-20 h-20 dark:border-transparent rounded outline-none sm:w-32 sm:h-32 dark:bg-gray-500"
                src={tShirt?.mainImage}
                alt="Product"
              />
              <div className="flex flex-col justify-start items-start w-full pb-4">
                <div className="flex justify-between w-full pb-2 space-x-2">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold sm:pr-8">
                      {tShirt?.name}
                    </h3>
                    <p className="text-sm font-medium">
                      Product Code: {tShirt?.Description?.Item_code}
                    </p>
                    <div className="flex gap-2 text-sm divide-x p-2 pt-5">
                      <button
                        onClick={() => handleDelete(tShirt._id)}
                        type="button"
                        className="flex border rounded items-center px-2 py-1 pl-0 space-x-1"
                      >
                        <RiDeleteBin6Line className="w-4 pl-1 h-4 fill-current" />
                        <span>Remove</span>
                      </button>
                      <button
                        onClick={() => handleAddToCart(tShirt._id)}
                        type="button"
                        className="flex border rounded gap-1 items-center px-2 py-1 pl-2"
                      >
                        <FaCartPlus className="w-4 pl-1 h-4 fill-current" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* Display the updated price here */}
                    <p className="text-lg font-semibold">TK {updatePrice}</p>
                    <div className="mt-1">
                      <Rating
                        className="mt-1"
                        readonly
                        placeholderRating={tShirt?.star}
                        emptySymbol={<AiFillStar color="#D6D6D6" size={16} />}
                        placeholderSymbol={<AiFillStar color="#FF9933" size={16} />}
                        fullSymbol={<AiFillStar color="#FF9933" size={16} />}
                      />
                    </div>
                    <div className="">
                      <h2 className="font-medium pb-1">Select Your Size:</h2>
                      {tShirt?.size.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => handleSizeClick(size)}
                          className={`mx-1 py-1 text-sm px-1 border-2 font-medium ${
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
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
})}

            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
