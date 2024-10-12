import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequestPayment } from '../../Redux/RequestPayment/requestPaymentSlice';
import { fetchShoes } from '../../Redux/Shoes/shoesSlice';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const RequestPayment = () => {
  const { isLoading, RequestPayment, error } = useSelector((state) => state.RequestPayment);
  const { isLoading:isShoeLoading, Shoes, error:isShoeError } = useSelector((state) => state.Shoes);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchRequestPayment());
    dispatch(fetchShoes());
  }, [dispatch]);

  const [openDropdowns, setOpenDropdowns] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});

  // Function to toggle individual dropdown
  const toggleDropdown = (paymentId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [paymentId]: !prevState[paymentId],
    }));
  };
  const handleStatusChange = (paymentId, newStatus) => {
    setPaymentStatus((prevState) => ({
      ...prevState,
      [paymentId]: newStatus,
    }));
    
    // Optionally, you can dispatch an action or API call here to persist the status change
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [paymentId]: false, // Close the dropdown after selecting
    }));
  };
  return (
    <section
      className="mx-5 pb-32 px-5 py-7 my-2  bg-white overflow-x-auto"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
      }}
    >
      <div className="flex items-center justify-end pt-5">
        <button className="bg-[#f50963] px-5 py-2 rounded-md text-white font-semibold">
          Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="pt-10 ">
        <table className="min-w-full divide-y-2  divide-gray-200 bg-white text-sm ">
          <thead className="text-left ">
            <tr className="">
              <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">Name</th>
              <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">Email</th>
              <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">Shipping Cost</th>
              <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">Transaction ID</th>
              <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">Products</th>
              <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">Number</th>
              <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {RequestPayment?.map((payment) => {
              if (!payment) return null;

              const matchingShoe = Shoes.find((shoe) => shoe._id === payment.products);

              return (
                <tr key={payment._id}>
                  <td className="whitespace-nowrap flex items-center gap-2 px-4 py-2 text-gray-700 font-bold">
                    {payment?.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <button className="bg-gray-200 px-2 py-1 rounded-md">
                      {payment?.email}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {payment?.shippingCost}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {payment?.transactionID}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <Link to={`/product-details/${matchingShoe?._id}`}>
                      {matchingShoe ? matchingShoe.name : "No matching product"}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {payment?.number}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <div className="relative">
                      <span
                        onClick={() => toggleDropdown(payment._id)}
                        className="bg-[#50cd89] px-3 py-2 rounded-md flex items-center justify-between cursor-pointer"
                      >
                        {/* Show the updated status */}
                        {paymentStatus[payment._id] || payment?.status}
                        <span className="ml-2">
                          {openDropdowns[payment._id] ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      </span>

                      {openDropdowns[payment._id] && (
                        <div className="absolute top-full left-0 z-50 mt-1 w-full bg-white border rounded-md shadow-lg transition-all duration-300 ease-in-out">
                          <ul>
                            <li
                              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => handleStatusChange(payment._id, 'Receive Payment')}
                            >
                              Receive Payment
                            </li>
                            <li
                              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => handleStatusChange(payment._id, 'Transition ID Error')}
                            >
                              Transition Id Error
                            </li>
                            <li
                              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => handleStatusChange(payment._id, 'Delivery')}
                            >
                              Delivery
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
      </div>
    </section>
  );
};

export default RequestPayment;
