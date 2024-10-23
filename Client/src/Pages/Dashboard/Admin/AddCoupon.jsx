import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons } from "../../Redux/Coupons/couponsSlice";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const AddCoupon = () => {
  const { isLoading, Coupons, error } = useSelector((state) => state.Coupons);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Tracks if modal should be open
  const [modalContentVisible, setModalContentVisible] = useState(false); // Controls the content visibility for smooth animation

  const openModal = () => {
    setModalContentVisible(true);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 10); // Slight delay for smooth opening animation
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalContentVisible(false);
    }, 300); // Matches the transition duration for smooth closing
  };

  return (
    <div>
      <section
        className="mx-5 px-5 py-7 my-2 bg-white"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
        }}
      >
        <div className="flex items-center justify-between pt-5">
          <div className="w-64 py-2 hidden md:flex items-center gap-3 bg-gray-200 rounded-md">
            <div className="pl-4">
              <FiSearch className="primaryColor" size={23} />
            </div>
            <input
              type="search"
              placeholder="Search"
              className="outline-none primaryColor bg-transparent"
            />
          </div>
          <div>
            <button
              onClick={openModal}
              className="bg-[#f50963] px-5 py-2 rounded-md text-white font-semibold"
            >
              Add Coupon
            </button>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="pt-10 overflow-hidden">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Code
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Amount
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Start
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  End
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Coupons?.map((coupon) => (
                <tr key={coupon?._id}>
                  <td className="whitespace-nowrap flex items-center gap-2 px-4 py-2 text-gray-700 font-bold">
                    <img
                      className="w-[60px] h-[60px] rounded-md"
                      src={coupon.image}
                      alt={coupon.name}
                    />
                    {coupon?.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <button className="bg-gray-200 px-2 py-1 rounded-md">
                      {coupon?.code}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {coupon?.amount}%
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {coupon?.status === "Active" ? (
                      <button className=" bg-[#50cd901a] px-2 rounded-md text-sm font-semibold py-1 text-[#50cd89]">
                        {coupon?.status}
                      </button>
                    ) : (
                      <button className=" bg-[#f1cd901a] px-2 rounded-md text-sm font-semibold py-1 text-[#f1416c]">
                        {coupon?.status}
                      </button>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {coupon?.start}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {coupon?.end}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <div className="flex gap-2">
                      <span className="bg-[#50cd89] px-3 py-2 rounded-md">
                        <MdEdit color="white" size={20} />
                      </span>
                      <span className="border rounded-md border-[#50cd89] px-3 py-2">
                        <MdDeleteForever size={20} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal with Transition */}
      {modalContentVisible && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
              isModalOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div
            className={`fixed top-0 right-0 h-full w-[30%] bg-white shadow-lg z-50 transition-transform duration-300 ${
              isModalOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Modal Header */}
            <div
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
              }}
              className="px-6 py-2 flex items-center gap-1"
            >
              <button onClick={closeModal}>
                <RxCross2 size={20} />
              </button>
              <h2 className="text-xl font-semibold">Enter Coupon Details</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="mb-4">Enter your coupon details below.</p>
              {/* Add coupon form content here */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddCoupon;
