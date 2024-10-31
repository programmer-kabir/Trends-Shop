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
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
const CheckOut = () => {
  // const [booked, loading] = useBooked();
  const {id} = useParams()
  console.log(id);
  // console.log(id);
  const {  Booked } = useSelector((state) => state.Booked);
  const {  Shoes } = useSelector((state) => state.Shoes);

  const dispatch = useDispatch();
const {user} = useAuth()
  const { isLoading, Users, error } = useSelector((state) => state.Users);
  const { isLoading: isCouponLoading, Coupons, error: isCouponError } = useSelector((state) => state.Coupons);
  useEffect(() => {
    dispatch(fetchShoes())
    dispatch(fetchUser());
    dispatch(fetchCoupons());
    dispatch(fetchBooked(user.email));
  }, [dispatch,user]);
  const CurrentProduct = Booked.find((data) => data.productId === id); 

  // console.log(CurrentProduct.size);
    // console.log(CurrentProduct);
  const [shippingCost, setShippingCost] = useState(0);
  const [showCoupon, setShowCoupon] = useState(false);
  const [name, setName] = useState();
  const [number, setNumber] = useState(0);
  const [address, setAddress] = useState();
  const [discount, setDiscount] = useState(0);
  const matchingUsers = Users.filter((userData) => userData.email === user?.email);

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

  const totalCostBeforeDiscount = (CurrentProduct?.price * CurrentProduct?.quantity) + shippingCost;

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();
  
  const [couponCode, setCouponCode] = useState("");

  // Handle coupon code separately
  const handleCouponCode = () => {
    const foundCoupon = Coupons.find((coupon) => coupon.code === couponCode);
    if (foundCoupon) {
      setDiscount(foundCoupon.amount);
      toast.success(`Coupon applied! You got ${foundCoupon.amount}% off.`);
    } else {
      toast.error("Invalid coupon code. Please try again.");
    }
  };

  const totalCostAfterDiscount = totalCostBeforeDiscount - totalCostBeforeDiscount * (discount / 100);
const navigate = useNavigate()
  // Transaction ID toggle
  const [isOpen, setIsOpen] = useState(false);
  const toggleInput = () => setIsOpen(!isOpen);

  const matchUserAddress = `${matchingUsers[0]?.divison}, ${matchingUsers[0]?.district}, ${matchingUsers[0]?.upZillah}, ${matchingUsers[0]?.village}, ${matchingUsers[0]?.postCode}`;

  // Form submission
  const onSubmit = (data) => {
    if (!data?.transactionID) {
      toast.error("Please provide a transaction ID.");
      return;
    }
    let mainData = {
      ...data,
      bookedId:CurrentProduct._id,
      size:CurrentProduct.size,
      products: CurrentProduct.productId,
      shippingCost,
      name: matchingUsers[0]?.name,
      email:user.email,
      status:"Awaiting Check Payment",
    };

    if (matchingUsers[0]?.village) {
      mainData = {
        ...mainData,
        address: matchUserAddress,
        number: matchingUsers[0]?.number,
      };
    }

    if (mainData.shippingCost === 0) {
      toast.error("Please Provide Your Shipping");
      return;
    }
    if (couponCode && discount > 0) {
      mainData = {
        ...mainData,
        couponCode,
      };
    }
    // console.log(mainData);
     axios.post(`${import.meta.env.VITE_LOCALHOST_KEY}/requestPayment`,mainData)
    .then(data =>{
      // console.log(data.data.bookedUpdateResult);
      if(data.data.bookedUpdateResult.acknowledged){
        toast.success('Please Waiting Your Payment Confirmation')
        navigate('/user/my_orders')
      }
    })
      
  };

  

  return (
    <Content>
      <div className="pt-5 px-3">
       
          <section>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-5 items-center justify-between"
            >
              <div className="w-1/2">
                <h1 className="text-[#f50400] text-xl font-bold text-center">
                  Billing Details
                </h1>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="text-red-600">* </span>Name
                    </p>

                    <p className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full  px-3 py-2 rounded-md ">
                      {matchingUsers[0]?.name}
                    </p>
                  </div>
                  {matchingUsers[0]?.village ? (
                    <>
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <p className="flex items-center gap-2">
                            <span className="text-red-600">* </span>Number
                          </p>

                          <p className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full  px-3 py-2 rounded-md ">
                            {matchingUsers[0]?.number}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="flex items-center gap-2">
                            <span className="text-red-600">* </span>Address
                          </p>

                          <p className="border  border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full  px-3 py-2 rounded-md ">
                            {matchingUsers[0]?.village},
                            <span> {matchingUsers[0]?.upZillah},</span>
                            <span> {matchingUsers[0]?.district},</span>
                            <span> {matchingUsers[0]?.divison} </span>
                            <span> {matchingUsers[0]?.postCode}</span>
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <span className="text-red-600">* </span>Number
                        </p>

                        <input
                          type="number"
                          name="number"
                          {...register("number", { required: true })}
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
                          {...register("address", { required: true })}
                          className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full  px-3 py-2 rounded-md "
                          placeholder="Enter Your Address (divison, district, up-zella, Village name, post code )"
                          id=""
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">AdditionalData</p>

                    <textarea
                      rows={7}
                      cols={7}
                      type="text"
                      name="additionalData"
                      {...register("additionalData")}
                      className="border border-[#d9d9d9] outline-none focus:border-[#3b82f6] w-full px-3 py-2 rounded-md "
                      placeholder="Enter Your additional Data"
                      id=""
                    />
                  </div>
                  <button
                    type="submit"
                    className={`
                      isFormValid
                         bg-[#f50963] hover:bg-[#080921]
                         
                     px-6 w-full text-white transition-all duration-500 ease-in-out py-3 flex items-center justify-center gap-1 rounded-sm text-xl`}
                    // className={`${
                    //   isFormValid
                    //     ? "bg-[#f50963] hover:bg-[#080921]"
                    //     : "bg-gray-300 cursor-not-allowed"
                    // } px-6 w-full text-white transition-all duration-500 ease-in-out py-3 flex items-center justify-center gap-1 rounded-sm text-xl`}
                    // disabled={!isFormValid}
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
                      // {...register("couponCode", { required: true })}

                      onChange={(e) => setCouponCode(e.target.value)}
                      className=" w-full px-3 py-4 rounded-sm outline-none bg-[#f5f5f8]"
                      placeholder="Coupon Code"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleCouponCode}
                        className="bg-[#f50963] hover:bg-[#080921]
                            
                         px-6 text-white transition-all duration-500 ease-in-out py-3 rounded-sm text-xl"

                        // className={`${
                        //   isFormValid
                        //     ? "bg-[#f50963] hover:bg-[#080921]"
                        //     : "bg-gray-300 cursor-not-allowed"
                        // } px-6 text-white transition-all duration-500 ease-in-out py-3 rounded-sm text-xl`}
                        // disabled={!isFormValid}
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
                
                  
                    <div className="flex items-center pt-5 justify-between">
                      <h5 className="text-gray-900 flex items-center gap-1">
                        {CurrentProduct?.productName}{" "}
                        <FaPlus
                          size={12}
                          className="rotate-45"
                          color="#111827"
                        />{" "}
                        {CurrentProduct?.quantity}
                      </h5>
                      <h5 className="uppercase font-bold">
                        {CurrentProduct?.price * CurrentProduct?.quantity}৳
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
                    <h2 className="font-medium text-[17px] list-item">
                      Transaction Id
                    </h2>
                    <div onClick={toggleInput} color="#f50400">
                      {isOpen ? (
                        <FaMinus color="#f50400" />
                      ) : (
                        <FaPlus color="#f50400" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-700 ease-in overflow-hidden ${
                      isOpen ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    {isOpen && (
                      <input
                        type="text"
                        {...register("transactionID", { required: true })}
                        name="transactionID"
                        className="bg-gray-200 outline-none w-full px-3 py-2"
                        placeholder="Enter Transaction ID"
                      />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </section>
      
      </div>
    </Content>
  );
};

export default CheckOut;
