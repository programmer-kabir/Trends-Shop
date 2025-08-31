import { Badge, Button, Modal } from "antd";
import React, { useState } from "react";
import { TbCurrencyTaka } from "react-icons/tb";
const HoverCard = ({ shoe }) => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const mainPrice = shoe.price;
  let updatePrice;
  const discount = shoe?.Discount;

  if (discount) {
    // Calculate the updated price with the discount
    updatePrice = mainPrice - mainPrice * (discount / 100);
  } else {
    updatePrice = mainPrice;
  }

  return (
   <div className="w-full px-2 py-2 mx-auto relative group">
  {/* Card container */}
  <div
    className="relative pb-5 rounded-md flex flex-col h-[300px]" // 👈 fixed height
    style={{
      boxShadow:
        "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
    }}
  >
    {/* Discount Badge */}
    <div className="absolute z-50">
      {shoe?.Discount ? (
        <Badge.Ribbon
          placement="start"
          color="#f50400"
          text={`Discount ${shoe.Discount}%`}
        />
      ) : null}
    </div>

    {/* Image */}
    <img
      src={shoe.mainImage}
      alt=""
      className="w-full h-[200px] object-cover rounded-md" // 👈 fixed image height
    />

    {/* Overlay + Buttons */}
    <div className="absolute inset-0 rounded-md bg-gray-500 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
    <div className="absolute inset-0 flex flex-col items-center justify-between cursor-pointer p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="flex-grow flex items-center justify-center">
        <button
          onClick={showModal}
          className="px-2 py-2 text-xs bg-[#080921] hover:bg-[#4D4F53] transition-all duration-500 ease-in-out text-white font-semibold rounded-md"
        >
          Clicked To View
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col flex-grow justify-between px-1 text-start mt-2">
      <p className="font-medium line-clamp-2">{shoe.name}</p> {/* 👈 prevents overflow */}
      <div className="flex gap-2 pt-1 items-center">
        {shoe?.Discount ? (
          <p className="line-through text-xl">{shoe.price}৳</p>
        ) : (
          <p className="text-xl">{shoe.price}৳</p>
        )}
        {shoe?.Discount ? (
          <p className="text-[#f50400] font-semibold text-xl">
            {updatePrice}৳
          </p>
        ) : null}
      </div>
    </div>
  </div>
</div>

  );
};

export default HoverCard;
