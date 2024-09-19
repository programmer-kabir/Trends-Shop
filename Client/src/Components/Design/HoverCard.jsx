import { Badge, Button, Modal } from "antd";
import React, { useState } from "react";
import './styles.css'
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
        className="relative  pb-5 rounded-md "
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
            ></Badge.Ribbon>
          ) : null}
        </div>

        {/* Image */}
        <img
          src={shoe.mainImage}
          alt=""
          className="w-full rounded-md h-[250px] object-cover "
        />

        {/* Black overlay on hover */}
        <div className="absolute inset-0 rounded-md  bg-gray-500 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        {/* Buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-between cursor-pointer p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* First button in the middle */}
          <div className="flex-grow flex items-center justify-center">
            <button onClick={showModal} className="px-2 py-2 text-xs bg-[#080921] hover:bg-[#4D4F53] transition-all duration-500 ease-in-out text-white font-semibold rounded-md">
              Clicked To View
            </button>
          </div>
          <Modal
            title="Title"
            open={open}
            onCancel={handleCancel}
          >
            <p>sfhs</p>
          </Modal>
          {/* Last button at the bottom */}
          <div className="mb-4">
            <Button type="default">Last Button</Button>
          </div>
        </div>
        {/* Content */}
        <div className="flex flex-col px-1  text-start">
          <p className="pt-3">{shoe.name}</p>
          <div className="flex gap-2 pt-1">
            {shoe?.Discount ? (
              <div>
                <p className="line-through text-xl">{shoe.price}৳</p>
              </div>
            ) : (
              <p className="text-xl">{shoe.price}৳</p>
            )}
            <p></p>
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
