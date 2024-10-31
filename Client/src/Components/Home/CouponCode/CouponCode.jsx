import React, { useEffect, useState } from "react";
import Content from "../../Content/Content";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons } from "../../../Pages/Redux/Coupons/couponsSlice";
import Title from "../../Design/Title";
import {toast} from 'react-hot-toast';

const CouponCode = () => {
  const { isLoading, Coupons, error } = useSelector((state) => state.Coupons);
  const dispatch = useDispatch();

  const [timeLeftArray, setTimeLeftArray] = useState([]);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  useEffect(() => {
    // Initialize time left for each coupon
    const initializeTimeLeft = Coupons.map((coupon) =>
      calculateTimeLeft(coupon.end)
    );
    setTimeLeftArray(initializeTimeLeft);

    // Set up a timer that updates time left every second
    const timer = setInterval(() => {
      const updatedTimeLeft = Coupons.map((coupon) =>
        calculateTimeLeft(coupon.end)
      );
      setTimeLeftArray(updatedTimeLeft);
    }, 1000);

    // Clean up the timer
    return () => clearInterval(timer);
  }, [Coupons]);

  const calculateTimeLeft = (endDate) => {
    const difference = new Date(endDate) - new Date(); // Convert endDate to a Date object
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    return timeLeft;
  };

  // 
  const copyToClipboard = (code) => {
    if (code) {
      navigator.clipboard.writeText(code)
        .then(() => {
          toast.success("Coupon code Copy!");
        })
        .catch(err => {
          toast.error("Failed to copy the coupon code");
        });
    }
;
  };
  const getCouponStatus = (endDate) => {
    return new Date(endDate) > new Date() ? "Active" : "Expired";
  };

  return (
    <Content>
      <section>
        <Title title={"Deal Of The Day"} />
        <div className="pt-5 grid md:grid-cols-2 gap-5">
          {Coupons.map((coupon, index) => (
            <div
              key={coupon._id}
              className="md:flex items-center md:gap-4 gap-3 p-2 border md:p-4"
            >
             <div className="flex items-center md:gap-7 gap-3 ">
             <img className="md:w-[120px] w-[80px] h-[80px] md:h-[120px]" src={coupon.image} alt="" />
              <div className="md:border-r border-dashed border-gray-400 pr-5">
                <h2 className="text-black text-[15px] md:text-[18px] font-medium">
                  {coupon.name}
                </h2>
                <h2 className="text-red-600 text-[16px] md:text-[18px] font-medium">
                  {coupon.amount}%{" "}
                  <span className="font-semibold text-[15px] md:text-base text-gray-600">Off</span>
                </h2>
                <div className="flex gap-1 md:gap-5 pt-3">
                  {/* Days */}
                  <div className="text-sm uppercase border-r pr-3">
                    {timeLeftArray[index]?.days} <br />
                    Day
                  </div>
                  {/* Hours */}
                  <div className="text-sm uppercase border-r pr-3">
                    {timeLeftArray[index]?.hours} <br />
                    Hrs
                  </div>
                  {/* Minutes */}
                  <div className="text-sm uppercase border-r pr-3">
                    {timeLeftArray[index]?.minutes} <br />
                    Min
                  </div>
                  {/* Seconds */}
                  <div className="text-sm uppercase pr-3">
                    {timeLeftArray[index]?.seconds} <br />
                    Sec
                  </div>
                </div>
              </div>
             </div>
              <div className="space-y-2 text-center pt-5 md:pt-0">
                <h2 className="font-light">
                  
                  <span className="text-green-600 font-medium">
                  {getCouponStatus(coupon.end)}
                  </span>
                </h2>
                <button onClick={()=>copyToClipboard(coupon?.code)} className="border-2 border-dashed bg-[#0080801a] border-[#00808066] text-center text-[#008080] font-semibold text-xl px-3 py-1">
                  <h2>{coupon?.code}</h2>
                </button>
              </div>
             
            </div>
          ))}
        </div>
      </section>
    </Content>
  );
};

export default CouponCode;
