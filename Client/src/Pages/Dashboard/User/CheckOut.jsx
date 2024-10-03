import React, { useEffect, useState } from "react";
import useBooked from "../../../Components/Hooks/useBooked";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";
import Content from "../../../Components/Content/Content";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Radio } from "antd";
import { TbCurrencyTaka } from "react-icons/tb";
import { GoFileDirectoryFill } from "react-icons/go";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../Redux/Users/userSlice";
import useAuth from "../../../Components/Hooks/useAuth";
import { useForm } from "react-hook-form";
import { fetchCoupons } from "../../Redux/Coupons/couponsSlice";
import { toast } from "react-hot-toast";
const CheckOut = () => {
  const [booked, loading] = useBooked();
  const [shippingCost, setShippingCost] = useState(0);
  const [showCoupon, setShowCoupon] = useState(false);
  const { user } = useAuth();
  const { isLoading, Users, error } = useSelector((state) => state.Users);
  const {
    isLoading: isCouponLoading,
    Coupons,
    error: isCouponError,
  } = useSelector((state) => state.Coupons);
  const [name, setName] = useState();
  const [number, setNumber] = useState();
  const [address, setAddress] = useState();
  const isFormValid = name && number && address && shippingCost > 0;
  const [discount, setDiscount] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchCoupons());
  }, []);
  const matchingUsers = Users.filter(
    (userData) => userData.email === user?.email
  );
  useEffect(() => {
    if (matchingUsers.length > 0) {
      setName(matchingUsers[0]?.name || "");
      setNumber(matchingUsers[0]?.number || "");
      setAddress(
        matchingUsers[0]?.village
          ? `${matchingUsers[0]?.village}, ${matchingUsers[0]?.upZillah}, ${matchingUsers[0]?.district}, ${matchingUsers[0]?.divison} ${matchingUsers[0]?.postCode}`
          : ""
      );
    }
  }, [matchingUsers]);
  const subTotal = booked.reduce(
    (total, data) => total + data.price * data.quantity,
    0
  );
  const totalCostBeforeDiscount = subTotal + shippingCost;

  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm();
  const [couponCode, setCouponCode] = useState("");

  const handleCouponCode = () => {
    const foundCoupon = Coupons.find((coupon) => coupon.code === couponCode);
    if (foundCoupon) {
      setDiscount(foundCoupon.amount);
      toast.success(`Coupon applied! You got ${foundCoupon.amount}% off.`);
    } else {
      toast.error("Invalid coupon code. Please try again.");
    }
  };
  const totalCostAfterDiscount =
    totalCostBeforeDiscount - totalCostBeforeDiscount * (discount / 100);

    // Tran
    const [isOpen, setIsOpen] = useState(false);
    const toggleInput = () => {
      setIsOpen(!isOpen);
    };
  return (
    <Content>
      <div className="pt-5 px-3">
        {loading ? (
          <section>
            <form onSubmit={handleSubmit(onsubmit)} className="flex gap-5 items-center justify-between">
              <div className="w-1/2">
                <h1 className="text-[#f50400] text-xl font-bold text-center">
                  Billing Details
                </h1>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="text-red-600">* </span>Name
                    </p>

                    <input
                      type="text"
                      name="name"
                      value={matchingUsers[0]?.name}
                      className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full px-3 py-2 rounded-md "
                      placeholder="Enter Your Name"
                      id=""
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="text-red-600">* </span>Number
                    </p>

                    <input
                      type="number"
                      name="number"
                      onChange={(e) => setNumber(e.target.value)}
                      value={
                        matchingUsers[0]?.number !== undefined
                          ? matchingUsers[0].number
                          : undefined
                      }
                      className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full  px-3 py-2 rounded-md "
                      placeholder="Enter Your Number"
                      id=""
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="text-red-600">* </span>Address
                    </p>

                    <input
                      type="text"
                      name="address"
                      value={
                        matchingUsers[0]?.village !== undefined
                          ? `${matchingUsers[0]?.village}, ${matchingUsers[0]?.upZillah}, ${matchingUsers[0]?.district}, ${matchingUsers[0]?.divison} ${matchingUsers[0]?.postCode}`
                          : undefined
                      }
                      onChange={(e) => setAddress(e.target.value)}
                      className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full  px-3 py-2 rounded-md "
                      placeholder="Enter Your Address (divison, district, up-zella, Village name, post code )"
                      id=""
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">AdditionalData</p>

                    <textarea
                      rows={7}
                      cols={7}
                      type="text"
                      name="additionalData"
                      className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full px-3 py-2 rounded-md "
                      placeholder="Enter Your additional Data"
                      id=""
                    />
                  </div>

                  <button
                    className={`${
                      isFormValid
                        ? "bg-[#f50963] hover:bg-[#080921]"
                        : "bg-gray-300 cursor-not-allowed"
                    } px-6 w-full text-white transition-all duration-500 ease-in-out py-3 flex items-center justify-center gap-1 rounded-sm text-xl`}
                    disabled={!isFormValid}
                  >
                    {" "}
                    <IoPlaySkipBackSharp size={18} /> Place order
                  </button>
                </div>
              </div>
              {/* right Sdie */}
              <div className="border-2 rounded-md p-5 border-[#f50400] w-1/2">
                <h1 className="text-[#f50400] text-xl font-bold text-center">
                  YOUR'S ORDER
                </h1>
                <div className="flex items-center gap-5 text-[#4D4F53] border-t-[3px] rounded-sm pt-2 mt-4 border-[#f50963]">
                  <span>
                    <GoFileDirectoryFill size={20} color="#4D4F53" />
                  </span>
                  <p>
                    {" "}
                    Have a coupon?{" "}
                    <button
                      onClick={() => setShowCoupon(!showCoupon)}
                      className="font-bold hover:text-[#f50963]"
                    >
                      Click here to enter your code
                    </button>
                  </p>
                </div>
                {showCoupon && (
                  <div className="py-5 space-y-5">
                    <input
                      type="text"
                      name="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className=" w-full px-3 py-4 rounded-sm outline-none bg-[#f5f5f8]"
                      placeholder="Coupon Code"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleCouponCode}
                        className={`${
                          isFormValid
                            ? "bg-[#f50963] hover:bg-[#080921]"
                            : "bg-gray-300 cursor-not-allowed"
                        } px-6 text-white transition-all duration-500 ease-in-out py-3 rounded-sm text-xl`}
                        disabled={!isFormValid}
                      >
                        Apply Coupon
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex items-center mt-5 justify-between border-b-2 border-gray-200">
                  <h5 className="text-[18px] uppercase font-bold">Product</h5>
                  <h5 className="text-[18px] uppercase font-bold">Sub Total</h5>
                </div>
                {booked.map((data) => (
                  <div key={data._id}>
                    <div className="flex items-center pt-5 justify-between border-b-2 border-gray-200">
                      <h5 className="text-gray-900 flex items-center gap-1">
                        {data?.productName}{" "}
                        <FaPlus
                          size={12}
                          className="rotate-45"
                          color="#111827"
                        />{" "}
                        {data.quantity}
                      </h5>
                      <h5 className="uppercase font-bold">
                        {data?.price * data.quantity}৳
                      </h5>
                    </div>
                  </div>
                ))}

                <div className="flex items-center pt-2 justify-between">
                  <h5 className="text-[17px] uppercase font-bold">sub Total</h5>
                  <h5 className="text-[17px] uppercase font-bold">
                    {subTotal}৳
                  </h5>
                </div>
                {/* Shipping */}
                <div className="pt-4 w-full">
                  <span className="flex items-center">
                    <span className="h-[2px] flex-1 bg-gray-200"></span>
                    <span className="shrink-0 px-6  font-semibold">
                      Shipping
                    </span>
                    <span className="h-[2px] flex-1 bg-gray-200"></span>
                  </span>

                  {/* cost inside sylhet*/}
                  <div className="bg-neutral-200 ">
                    <Radio
                      className="flex gap-1 text-[16px] items-center w-full p-2 rounded-sm"
                      value={60}
                      checked={shippingCost === 60} // Check if selected
                      onChange={() => setShippingCost(60)} // Update shipping cost
                    >
                      <span>Inside Dhaka City: </span>
                      <span className="font-semibold inline-flex gap-0 items-center">
                        60
                        <span>
                          <TbCurrencyTaka size={20} />
                        </span>
                      </span>
                    </Radio>
                  </div>
                  <div className="bg-neutral-200 mt-2">
                    <Radio
                      className="flex gap-1 text-[16px] items-center w-full p-2 rounded-sm"
                      value={120}
                      checked={shippingCost === 120} // Check if selected
                      onChange={() => setShippingCost(120)} // Update shipping cost
                    >
                      <span>Outside Dhaka City: </span>
                      <span className="font-semibold inline-flex gap-0 items-center">
                        120
                        <span>
                          <TbCurrencyTaka size={20} />
                        </span>
                      </span>
                    </Radio>
                  </div>
                  <div className="bg-neutral-200 mt-2 p-2 px-2 flex justify-between items-start font-bold uppercase text-[16px]">
                    <h2>Discount</h2>
                    <h2>{discount}৳</h2>
                  </div>
                  <div className="bg-neutral-200 mt-2 p-2 px-2 flex justify-between items-start font-bold uppercase text-[16px]">
                    <h2>Total</h2>
                    <h2>{totalCostAfterDiscount}৳</h2>
                  </div>
                </div>
                {/* transition id */}
                <div className="pt-5">
      <div className="flex pb-5 items-center justify-between px-7">
        <h2 className="font-medium text-[17px] list-item">Transaction Id</h2>
        <button onClick={toggleInput} color="#f50400">
          {isOpen ? <FaMinus color="#f50400"/> : <FaPlus color="#f50400"/>}
        </button>
      </div>

      {/* Smooth transition container */}
      <div
        className={`transition-all duration-700 ease-in overflow-hidden ${isOpen ? 'max-h-40' : 'max-h-0'}`}
      >
        {isOpen && (
          <input
            type="text"
            name="address"
            className="bg-gray-200 outline-none w-full px-3 py-2"
            placeholder="Enter Transaction ID"
          />
        )}
      </div>
    </div>
              </div>
            </form>
          </section>
        ) : (
          <>
            <LoadingSpinner />
          </>
        )}
      </div>
    </Content>
  );
};

export default CheckOut;
