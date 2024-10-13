import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa6";
// import Payment from "./Payment";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import useBooked from "../../../Components/Hooks/useBooked";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import useAuth from "../../../Components/Hooks/useAuth";
// import usePayment from "../../../Components/Hooks/usePayment";
const MyOrder = () => {
  const {user} = useAuth()
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);
  const { isLoading:isPaymentLoading, RequestPayment, error:isPaymentError } = useSelector(
    (state) => state.RequestPayment
  );
  const {  Booked } = useSelector((state) => state.Booked);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchShoes());
    dispatch(fetchRequestPayment())
    dispatch(fetchBooked(user?.email))
  }, []);

// Matching data where Booked._id and RequestPayment.bookId match
const matchingData = Booked?.filter((bookedItem) =>
  RequestPayment.some((paymentItem) => paymentItem.bookedId === bookedItem._id)
);
console.log(matchingData);
  const matchedItems = Booked
    .map((bookedItem) => {
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
        };
      }
      return null;
    })
    .filter((item) => item !== null);
  // console.log(matchedItems);

  const [activeTab, setActiveTab] = useState("Completed");
  const tabs = ["Completed", "Incomplete"];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="px-5 pt-7">
      {/* {isLoading || loading ? <><LoadingSpinner /></>:(<> */}
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
        <section>
          <div class="mx-auto">
            <div class="w-full flex justify-between items-center mb-3 mt-1 pl-3">
              <div>
                <h3 class="text-lg font-semibold text-slate-800">
                  Projects with Invoices
                </h3>
                <p class="text-gray-900 font-medium">
                  Overview of the current activities.
                </p>
              </div>
              <div class="ml-3">
                <div class="w-full relative">
                  <div class="relative">
                    <input
                      class="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                      placeholder="Search for invoice..."
                    />
                    <button
                      class="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="3"
                        stroke="currentColor"
                        class="w-8 h-8 text-slate-600"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative flex flex-col w-full h-full text-black bg-white shadow-md rounded-lg bg-clip-border">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Product Name
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Size
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Quantity
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Discount
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Amount
                      </p>
                    </th>

                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Delivery Status
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matchedItems.map((data, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 border-b border-slate-200"
                    >
                      <td className="p-4 py-5">
                        <Link
                          to={`/product-details/${data?.productId}`}
                          className="text-sm hover:underline text-gray-900 font-medium"
                        >
                          {data?.productName}
                        </Link>{" "}
                        {/* Replace with actual data field */}
                      </td>
                      <td className="p-4 py-5">
                        <p className="text-sm text-gray-900 font-medium">
                          {data?.size
                            ? Array.isArray(data.size)
                              ? data.size.join(", ") // Join sizes with a comma if it's an array
                              : data.size // Display the size directly if it's a single value
                            : "N/A"}
                        </p>

                        {/* Replace with actual data field */}
                      </td>
                      <td className="p-4 py-5">
                        <p className="text-sm text-gray-900 font-medium">
                          {data?.quantity}
                        </p>{" "}
                        {/* Replace with actual data field */}
                      </td>

                      <td className="p-4 py-5">
                        <p className="text-sm text-gray-900 font-medium">
                          {data?.discount ? <>{data?.discount}</> : <>0</>}%
                        </p>{" "}
                        {/* Replace with actual data field */}
                      </td>
                      <td className="p-4 py-5">
                        <p className="text-sm text-gray-900 font-medium">
                          ৳
                          {data?.quantity && data?.price
                            ? `${data.quantity * data.price}`
                            : "N/A"}{" "}
                        </p>{" "}
                        {/* Replace with actual data field */}
                      </td>
                      <td className="p-4 py-5">
  <p className="text-sm text-gray-900 font-medium">
    {data?.status === "Awaiting Check Payment" ? (
      <button className="cursor-not-allowed flex disable items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
        Waiting For Successful Payment
      </button>
    ) : data?.status === "Receive Payment" ? (
      <button className="cursor-not-allowed flex disable items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
        Payment Received
      </button>
    ) : data?.status === "Error" ? (
      <button className="cursor-not-allowed flex disable items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
        Payment Error
      </button>
    ) : (
      <div className="flex gap-2 items-center">
        <Link to={`/CheckOut/${data.productId}`}>
          <button className="uppercase flex items-center gap-2 bg-[#439DDF] hover:bg-[#B63155] text-white rounded font-semibold px-3 py-1">
            Payment
          </button>
        </Link>
        <button className="uppercase flex items-center gap-2 bg-[#B63155] text-white rounded font-semibold px-3 py-1">
          Cancel
        </button>
      </div>
    )}
  </p>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
              <Link
                to="/checkout"
                className="flex items-end justify-end mt-3 px-5"
              >
                <button className="uppercase  flex items-center gap-2 bg-[#439DDF] hover:bg-[#B63155] text-white rounded font-semibold px-3 py-1">
                  Check Out
                </button>
              </Link>
              <div class="flex justify-between items-center px-4 py-3">
                <div class="text-sm text-gray-900 font-medium">
                  Showing <b>1-5</b> of 45
                </div>
                <div class="flex space-x-1">
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-gray-900 font-medium bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                    Prev
                  </button>
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
                    1
                  </button>
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-gray-900 font-medium bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                    2
                  </button>
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-gray-900 font-medium bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                    3
                  </button>
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-gray-900 font-medium bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {activeTab === "Completed" && (
        <section>
          <div class="mx-auto">
            <div class="w-full flex justify-between items-center mb-3 mt-1 pl-3">
              <div>
                <h3 class="text-lg font-semibold text-slate-800">
                  Projects with Invoices
                </h3>
                <p class="text-gray-900 font-medium">
                  Overview of the current activities.
                </p>
              </div>
              <div class="ml-3">
                <div class="w-full relative">
                  <div class="relative">
                    <input
                      class="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                      placeholder="Search for invoice..."
                    />
                    <button
                      class="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="3"
                        stroke="currentColor"
                        class="w-8 h-8 text-slate-600"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative flex flex-col w-full h-full overflow-scroll text-black bg-white shadow-md rounded-lg bg-clip-border">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Product Name
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Size
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Quantity
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Discount
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Amount
                      </p>
                    </th>

                    <th className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-sm  leading-none text-gray-900 font-medium">
                        Delivery Status
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matchedItems.map((data, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 border-b border-slate-200"
                    >
                      <td className="p-4 py-5">
                        <Link
                          to={`/product-details/${data?.productId}`}
                          className="text-sm hover:underline text-gray-900 font-medium"
                        >
                          {data?.productName}
                        </Link>{" "}
                        {/* Replace with actual data field */}
                      </td>
                      <td className="p-4 py-5">
                        <p className="text-sm text-gray-900 font-medium">
                          {data?.size
                            ? Array.isArray(data.size)
                              ? data.size.join(", ") // Join sizes with a comma if it's an array
                              : data.size // Display the size directly if it's a single value
                            : "N/A"}
                        </p>

                        {/* Replace with actual data field */}
                      </td>
                      <td className="p-4 py-5">
                        <p className="text-sm text-gray-900 font-medium">
                          {data?.quantity}
                        </p>{" "}
                        {/* Replace with actual data field */}
                      </td>

                      <td className="p-4 py-5">
                        <p className="text-sm text-gray-900 font-medium">
                          {data?.discount ? <>{data?.discount}</> : <>0</>}%
                        </p>{" "}
                        {/* Replace with actual data field */}
                      </td>
                      <td className="p-4 py-5">
                        <p className="text-sm text-gray-900 font-medium">
                          ৳
                          {data?.quantity && data?.price
                            ? `${data.quantity * data.price}`
                            : "N/A"}{" "}
                        </p>{" "}
                        {/* Replace with actual data field */}
                      </td>
                      <td className="p-4 py-5">
                        <p className="text-sm text-gray-900 font-medium">
                          {data?.status ? (
                            <button className="uppercase cursor-not-allowed flex disable items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
                              Waiting
                            </button>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <button className="uppercase  flex items-center gap-2 bg-[#439DDF] hover:bg-[#B63155] text-white rounded font-semibold px-3 py-1">
                                Payment
                              </button>
                              <button className="uppercase  flex items-center gap-2 bg-[#B63155] text-white rounded font-semibold px-3 py-1">
                                Cancel
                              </button>
                            </div>
                          )}
                        </p>{" "}
                        {/* Replace with actual data field */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-end justify-end mt-5 px-5">
                <button className="uppercase  flex items-center gap-2 bg-[#439DDF] hover:bg-[#B63155] text-white rounded font-semibold px-3 py-1">
                  Check Out
                </button>
              </div>
              <div class="flex justify-between items-center px-4 py-3">
                <div class="text-sm text-gray-900 font-medium">
                  Showing <b>1-5</b> of 45
                </div>
                <div class="flex space-x-1">
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-gray-900 font-medium bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                    Prev
                  </button>
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
                    1
                  </button>
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-gray-900 font-medium bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                    2
                  </button>
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-gray-900 font-medium bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                    3
                  </button>
                  <button class="px-3 py-1 min-w-9 min-h-9 text-sm  text-gray-900 font-medium bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* </>) } */}
    </div>
  );
};

export default MyOrder;
