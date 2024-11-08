
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
  const {
    isLoading: isShoesLoading,
    Shoes,
    error,
  } = useSelector((state) => state.Shoes);
  const {
    isLoading: isPaymentLoading,
    RequestPayment,
    error: isPaymentError,
  } = useSelector((state) => state.RequestPayment);
  const { isLoading: isBookedLoading, Booked } = useSelector(
    (state) => state.Booked
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShoes());
    dispatch(fetchRequestPayment());
    dispatch(fetchBooked(user?.email));
  }, [dispatch, user?.email]);

  // Combined loading state
  const isLoading = isShoesLoading || isPaymentLoading || isBookedLoading;

  // Data for Incomplete Orders
  const matchIncompleteData = Booked.map((bookedItem) => {
    const matchingShoe = Shoes.find(
      (shoe) => shoe._id === bookedItem.productId
    );
    const matchingPayment = RequestPayment.find(
      (payment) => payment.bookedId == bookedItem._id
    );
  // console.log(matchingPayment);

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
        orderDate: matchingPayment?.orderDate, // Add order date
        deliveryDate: matchingPayment?.deliveryDate, // Add delivery date
      };
    }
    return null;
  }).filter((item) => item && item.status != "Completed Order"); // Remove null values and filter out "Completed Order" items
  // const matchIncompleteData = Booked.filter (item => item.status !== "Completed Order") 
  // Data for Incomplete Orders


  const matchCompleteData = Booked.map((bookedItem) => {
    const matchingShoe = Shoes.find(
      (shoe) => shoe._id === bookedItem.productId
    );
    const matchingPayment = RequestPayment.find(
      (payment) => payment.bookedId === bookedItem._id
    );

    if (matchingShoe && matchingPayment) {
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
        orderDate: matchingPayment?.orderDate, // Add order date
        deliveryDate: matchingPayment?.deliveryDate, // Add delivery date
      };
    }
    return null;
  }).filter((item) => item && item.status === "Completed Order"); // Remove null values and filter out "Completed Order" items

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
    "Order Date",
    "Delivery Date",
    "Discount",
    "Amount",
    "Delivery Status",
  ];

  if (isLoading) {
    // Show loader if data is loading
    return <Loader />;
  }
  return (
    <div
      className="px-5 rounded-md overflow-x-scroll mx-5 py-7 my-4"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
      }}
    >
      <div className="flex border-b border-gray-400">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`cursor-pointer px-4 py-2 border-b-2 ${
              activeTab === tab
                ? "border-black font-bold"
                : "border-transparent"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        {activeTab === "Incomplete" && (
          <Table name={TableName} matchData={matchIncompleteData} />
        )}
        {activeTab === "Completed" && (
          <Table name={TableName} matchData={matchCompleteData} />
        )}
      </div>
    </div>
  );
};

export default MyOrder;
