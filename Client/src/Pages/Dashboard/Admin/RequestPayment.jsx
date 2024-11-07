import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../../Components/Hooks/useAuth";
import { Empty } from "antd";
const RequestPayment = () => {
  const { user } = useAuth();
  const { isLoading, RequestPayment, error } = useSelector(
    (state) => state.RequestPayment
  );
  const {
    isLoading: isShoeLoading,
    Shoes,
    error: isShoeError,
  } = useSelector((state) => state.Shoes);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRequestPayment());
    dispatch(fetchShoes());
  }, [dispatch]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Function to toggle individual dropdown
  const toggleDropdown = (paymentId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [paymentId]: !prevState[paymentId],
    }));
  };

  const handleStatusChange = (paymentId, newStatus, bookedId) => {
    setPaymentStatus((prevState) => ({
      ...prevState,
      [paymentId]: newStatus,
    }));

    setOpenDropdowns((prevState) => ({
      ...prevState,
      [paymentId]: false,
    }));
    const matchPayment = RequestPayment.find(
      (payment) => payment._id === paymentId
    );
    // console.log(matchPayment.products);
    const data = { newStatus, paymentId, bookedId,productId:matchPayment.products };
    // console.log(paymentId);
    axios
      .patch(`${import.meta.env.VITE_LOCALHOST_KEY}/requestPayment`, data)
      .then((data) => {
        console.log(data.data);
        toast.success(`${user?.displayName} ${data?.data?.message}`);
      });
  };

  // Filter the payments by invoiceId based on the search input
  const filteredPayments = RequestPayment?.filter((payment) =>
    payment?.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <section
      className="mx-5 pb-32  rounded-md py-7 my-2 bg-white overflow-x-scroll"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
      }}
    >
      <div className="pt-10 px-5">
        <div className="w-full flex justify-between items-center  mb-3 mt-1 ">
        
       
            <div className=" relative">
              <div className="relative">
                {/* Search Input */}
                <input
                  className="bg-white w-full pr-11 h-10 pl-8 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                  placeholder="Search for invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                />
                <button
                  className="absolute left-0 h-8 w-8  top-1 my-auto px-2 flex items-center rounded"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="currentColor"
                    className="w-8 h-8 text-slate-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Trends Shop with Invoices
            </h3>
            <p className="text-gray-900 font-medium">
              Overview of the user activities.
            </p>
          </div>
        </div>

        {/* Table */}
        {RequestPayment.length > 0 ? (
          <table className="divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr className="">
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Invoice Id
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Shipping Cost
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Transaction ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Products
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Number
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {RequestPayment?.map((payment) => {
                if (!payment) return null;

                const matchingShoe = Shoes.find(
                  (shoe) => shoe._id === payment.products
                );

                return (
                  <tr key={payment._id} className="border-b border-slate-200">
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 font-bold">
                      {payment?.invoiceId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 font-bold">
                      {payment?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                     
                        {payment?.email}
                     
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {payment?.shippingCost}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {payment?.transactionID}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <Link to={`/product-details/${matchingShoe?._id}`}>
                        {matchingShoe
                          ? matchingShoe.name
                          : "No matching product"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {payment?.number}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <div className="relative">
                        <span
                          onClick={() => {
                            toggleDropdown(payment._id);
                          }}
                          className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-md flex items-center justify-between cursor-pointer"
                        >
                          {/* Show the updated status */}
                          {paymentStatus[payment._id] || payment?.status}
                          <span className="ml-2">
                            {openDropdowns[payment._id] ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </span>
                        </span>

                        {openDropdowns[payment._id] && (
                          <div className="absolute top-full left-0 z-50 mt-1 w-full bg-white border rounded-md shadow-lg transition-all duration-300 ease-in-out">
                            <ul>
                              <li
                                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(
                                    payment._id,
                                    "Receive Payment",
                                    payment?.bookedId
                                  )
                                }
                              >
                                Receive Payment
                              </li>
                              <li
                                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(
                                    payment._id,
                                    "Transition ID Error",
                                    payment?.bookedId
                                  )
                                }
                              >
                                Transition Id Error
                              </li>
                              <li
                                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(
                                    payment._id,
                                    "Delivery",
                                    payment?.bookedId
                                  )
                                }
                              >
                                Delivery
                              </li>
                              <li
                                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(
                                    payment._id,
                                    "Completed Order",
                                    payment?.bookedId
                                  )
                                }
                              >
                                Completed Order
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">
            <Empty />
          </p> // Show this when no data found
        )}
      </div>
    </section>
  );
};

export default RequestPayment;
