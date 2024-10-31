import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { Link } from "react-router-dom";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import useAuth from "../../../Components/Hooks/useAuth";
import Table from "../../../Components/Dashboard/Table";
import Loader from "../../../Components/Design/LoadingSpinner/LoadingSpinner";

const MyOrder = () => {
  const { user } = useAuth();
  const { isLoading: isShoesLoading, Shoes, error } = useSelector((state) => state.Shoes);
  const { isLoading: isPaymentLoading, RequestPayment, error: isPaymentError } = useSelector((state) => state.RequestPayment);
  const { isLoading: isBookedLoading, Booked } = useSelector((state) => state.Booked);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShoes());
    dispatch(fetchRequestPayment());
    dispatch(fetchBooked(user?.email));
  }, [dispatch, user?.email]);

  // Combined loading state
  const isLoading = isShoesLoading || isPaymentLoading || isBookedLoading;

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
  }).filter((item) => item && item.status !== "Completed Order"); // Remove null values and filter out "Completed Order" items
console.log(matchIncompleteData);
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
  }).filter((item) => item && item.status === "Completed Order"); // Remove null values and filter out items with status not equal to "Completed Order"

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

  if (isLoading) {
    // Show loader if data is loading
    return <Loader />;
  }

  // Main content when data is loaded
  return (
    <div className="px-5 pt-7">
      <div className="flex border-b border-gray-400">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`cursor-pointer px-4 py-2 border-b-2 ${
              activeTab === tab ? "border-black font-bold" : "border-transparent"
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
