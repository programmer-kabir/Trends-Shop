import React, { useEffect, useState } from "react";
import useBooked from "../../../Components/Hooks/useBooked";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";
import Content from "../../../Components/Content/Content";
import { FaPlus } from "react-icons/fa6";
import { Form, Input, Radio } from "antd";
import { TbCurrencyTaka } from "react-icons/tb";
import { GoFileDirectoryFill } from "react-icons/go";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../Redux/Users/userSlice";
import useAuth from "../../../Components/Hooks/useAuth";
import { useForm } from "react-hook-form";
const CheckOut = () => {
  const [booked, loading] = useBooked();
  const [shippingCost, setShippingCost] = useState(0);
  const [showCoupon, setShowCoupon] = useState(false);
  const { user } = useAuth();
  const { isLoading, Users, error } = useSelector((state) => state.Users);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, []);
  const matchingUsers = Users.filter(
    (userData) => userData.email === user?.email
  );
  console.log(matchingUsers[0]?.number);

  const subTotal = booked.reduce(
    (total, data) => total + data.price * data.quantity,
    0
  );
  const totalCost = subTotal + shippingCost;
  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm();
  const onFinish = (data) => {
    console.log(data);
  };
  return (
    <Content>
      <div className="pt-5 px-3">
        {loading ? (
          <section>
            <div className="flex gap-5 items-center justify-between">
              <div className="w-1/2">
                <h1 className="text-[#f50400] text-xl font-bold text-center">
                  Billing Details
                </h1>

                <form  className="space-y-5">
                  
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="text-red-600">* </span>Name
                    </p>

                    <input
                      type="text"
                      name="name"
                      value={matchingUsers[0]?.name}
                      className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full text-xl px-3 py-2 rounded-md "
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
                      value={matchingUsers[0]?.number}
                      className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full text-xl px-3 py-2 rounded-md "
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
                      value={`${matchingUsers[0]?.village}, ${matchingUsers[0]?.upZillah}, ${matchingUsers[0]?.district}, ${matchingUsers[0]?.divison} ${matchingUsers[0]?.postCode}`}
                      className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full text-xl px-3 py-2 rounded-md "
                      placeholder="Enter Your Address (divison, district, up-zella, Village name, post code )"
                      id=""
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      AdditionalData
                    </p>

                    <textarea
                    rows={7}
                    cols={7}
                      type="text"
                      name="additionalData"
                      className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full text-xl px-3 py-2 rounded-md "
                      placeholder="Enter Your additional Data"
                      id=""
                    />
                  </div>

                  <button className="bg-[#f50963] hover:bg-[#080921] px-6 w-full text-white transition-all duration-500 ease-in-out py-3 flex items-center justify-center gap-1 rounded-sm text-xl">
                    {" "}
                    <IoPlaySkipBackSharp size={18} /> Place order
                  </button>
                </form>
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
                      className="text-xl w-full px-3 py-4 rounded-sm outline-none bg-[#f5f5f8]"
                      placeholder="Coupon Code"
                    />
                    <div className="flex justify-end">
                      <button className="bg-[#f50963] hover:bg-[#080921] px-6 text-white transition-all duration-500 ease-in-out py-4 rounded-sm text-xl">
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
                    <h2>Total</h2>
                    <h2>{totalCost}৳</h2>
                  </div>
                </div>
              </div>
            </div>
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
