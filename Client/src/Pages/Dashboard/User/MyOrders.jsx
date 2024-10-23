import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { Link } from "react-router-dom";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import useAuth from "../../../Components/Hooks/useAuth";
import Table from "../../../Components/Dashboard/Table";
const MyOrder = () => {
  const { user } = useAuth();
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);
  const {
    isLoading: isPaymentLoading,
    RequestPayment,
    error: isPaymentError,
  } = useSelector((state) => state.RequestPayment);
  const { Booked } = useSelector((state) => state.Booked);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchShoes());
    dispatch(fetchRequestPayment());
    dispatch(fetchBooked(user?.email));
  }, []);

  // Incomplete Data
  const matchIncompleteData = Booked.map((bookedItem) => {
    const matchingShoe = Shoes.find(
      (shoe) => shoe._id === bookedItem.productId
    );
    if (matchingShoe) {
      return {
        _id: bookedItem._id,
        productId: matchingShoe._id,
        productName: matchingShoe.name,
        quantity: bookedItem.quantity,
        price: bookedItem.price,
        size: bookedItem.size,
        status: bookedItem?.status,
        discount: bookedItem?.discount,
        invoiceId: bookedItem?.invoiceId,
      };
    }
    return null;
  }) // Remove null values
    .filter((item) => item.status !== "Completed Order"); // Filter out items with "complete order" status

  // Match Complete Data
  const matchCompleteData = Booked.map((bookedItem) => {
    const matchingShoe = Shoes.find(
      (shoe) => shoe._id === bookedItem.productId
    );
    if (matchingShoe) {
      return {
        _id: bookedItem._id,
        productId: matchingShoe._id,
        productName: matchingShoe.name,
        quantity: bookedItem.quantity,
        price: bookedItem.price,
        size: bookedItem.size,
        status: bookedItem?.status,
        discount: bookedItem?.discount,
        invoiceId: bookedItem?.invoiceId,
      };
    }
    return null;
  }) // Remove null values
    .filter((item) => item.status === "Completed Order");
  console.log(matchCompleteData);
  const [activeTab, setActiveTab] = useState("Completed");
  const tabs = ["Completed", "Incomplete"];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const TableName = [
    "Invoice Id",
    "Product Name",
    "Size",
    "Quantity",
    "Discount",
    "Amount",
    "Delivery Status",
  ];
  return (
    <div className="px-5 pt-7">
      <div className="flex border-b border-gray-400">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`cursor-pointer  px-4 py-2 border-b-2 ${
              activeTab === tab
                ? "border-black font-bold"
                : "border-transparent"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
      {activeTab === "Incomplete" && (
        <Table name={TableName} matchData={matchIncompleteData} />
      )}
      {activeTab === "Completed" && (
        <Table name={TableName} matchData={matchCompleteData} />
      )}
    </div>
  );
};

export default MyOrder;
