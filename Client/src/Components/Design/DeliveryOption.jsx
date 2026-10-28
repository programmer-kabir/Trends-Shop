import React from "react";
import { FaCcStripe, FaLocationDot } from "react-icons/fa6";
import { TbCashBanknote, TbTruckDelivery } from "react-icons/tb";
const DeliveryOption = () => {
  return (
    <div className="pt-10 w-full">
      <h2 className=" text-lg font-semibold text-gray-500">Delivery Options</h2>
      <hr className="w-full" />
      {/*  */}
      <div className="mt-5 space-y-3">
        <div className="flex gap-2 items-center ">
          <FaLocationDot color="#189EDB" size={20} />
          <p className="font-semibold">
            Available Delivery Area: All over the Bangladesh.
          </p>
        </div>
        <div className="flex gap-2 items-center ">
          <FaLocationDot color="#189EDB" size={20} />
          <p className="font-semibold">
            Dhaka Dhaka City North{" "}
            <span className="uppercase font-normal text-[#189FE0]">Change</span>
          </p>
        </div>
        {/* Delivery  */}
        <div>
          <div className="flex gap-2 items-center ">
            <TbTruckDelivery color="#189EDB" size={20} />
            <p className="font-semibold">Delivery Info</p>
          </div>
          <div className="text-gray-400 space-y-2 pl-6 pt-2">
            <p>Delivery Time : 1-7 working days</p>
            <p>Shipping Charge : Free Shipping</p>
            <p>Free Shipping Over Order Amount : Tk 499</p>
          </div>
        </div>
        {/* Cash */}
        <div>
          <div className="flex gap-2 items-center ">
            <TbCashBanknote color="#189EDB" size={30} />
            <p className="font-semibold">Cash on Delivery Available</p>
          </div>
          <div className="pl-5 flex gap-5 pt-5 items-center flex-wrap">
            <img
              className="w-1/4 border border-gray-500 rounded-md p-2 shadow-md"
              src="https://i.ibb.co/N9RCWVB/pngwing-com.png"
              alt=""
            />
            <img
              className="w-1/4 border border-gray-500 rounded-md p-2 shadow-md"
              src="https://i.ibb.co/QrFXcq0/1656227518bkash-logo-png.png"
              alt=""
            />
            <img
              className="w-1/4 border border-gray-500 rounded-md p-2 shadow-md"
              src="https://i.ibb.co/NSmbwSH/nagad.pngg"
              alt=""
            />
          </div>
        </div>
        {/* Return & Warranty */}
        <div className="pt-5 border-b pb-2  ">
          <h2 className="text-lg font-semibold text-gray-500">
            Return & Warranty
          </h2>
        </div>

        <div className="border-l pl-5">
          <p className="font-semibold">7 Days Returns</p>
          <span className="text-gray-800">
            Change of mind is not applicable
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <img src="https://i.ibb.co/rfRm9vN/warranty.png" alt="" />
          <span className="font-semibold">Warranty Not Available</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOption;
