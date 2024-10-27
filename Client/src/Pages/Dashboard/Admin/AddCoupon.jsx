import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons } from "../../Redux/Coupons/couponsSlice";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import { VscCloudUpload } from "react-icons/vsc";
import { useForm } from "react-hook-form";
import PropagateLoader from "react-spinners/PropagateLoader";
import axios from "axios";
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
  // Image
  const url =
    "https://api.imgbb.com/1/upload?key=f1e08dc7c44c396aa409d50dfcc797da";
  const [file, setFile] = useState(null);
  const [errors, setError] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const handleFileChange = (event) => {
    const image = event.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);
    setImageLoading(true);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((image) => {
        const photo = image?.data?.display_url;
        setFile(photo);
        setError("");
        setImageLoading(false);
      })
      .catch((error) => {
        setError("Error uploading the image. Please try again.");
        toast.error(error);

        setImageLoading(false); // Corrected from setLoading to setImageLoading
      });
  };

  const handleRemoveImage = () => {
    setFile(null);
    setError("");

    toast.success("image Remove SuccessFul");
  };

  //
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors: formError },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    const { name, amount, start, end, code } = data;
    const endDate = new Date(end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const startDate = new Date(start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const numericAmount = Number(amount);
    const mainData = {
      name,
      amount: numericAmount,
      star: startDate,
      end: endDate,
      code,
      image: file,
    };
    axios
      .post(`${import.meta.env.VITE_LOCALHOST_KEY}/couponCode`, mainData)
      .then((data) => {
        if (data.data.insertedId) {
          toast.success("Your Coupon is Post");
          closeModal()
        }
      })
      .catch((error) => {
        // Axios throws error for 4xx and 5xx status codes
        console.log(error);
        if (error.response && error.status === 400) {
          toast.error("Your Coupon already exists");
        } else {
          toast.error("An unexpected error occurred");
        }
      });
  };

  //
  const getCouponStatus = (coupon) => {
    const currentDate = new Date();
    const startDate = new Date(coupon.star); // Start date of the coupon
    const endDate = new Date(coupon.end); // End date of the coupon

    // Calculate the difference in days
    const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
    const daysRemaining = Math.round((endDate - currentDate) / oneDay);

    // Check the status based on the current date
    if (currentDate >= startDate && currentDate <= endDate) {
      return { status: "Active", availableDays: daysRemaining }; // Active with available days
    } else if (currentDate > endDate) {
      return { status: "Expired", availableDays: 0 }; // Expired with no days left
    }
    return {
      status: "Not Active",
      availableDays: Math.round((startDate - currentDate) / oneDay),
    }; // Coupon hasn't started yet
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
              {Coupons?.map((coupon) => {
                const { status, availableDays } = getCouponStatus(coupon);

                return (
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
                      {/* Display status and available days */}
                      <button
                        className={`px-2 py-1 rounded-md text-sm font-semibold ${
                          status === "Active"
                            ? "bg-[#50cd901a] text-[#50cd89]"
                            : "bg-[#f1cd901a] text-[#f1416c]"
                        }`}
                      >
                        {status} ({availableDays} days left)
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {coupon?.star}
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
                );
              })}
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`fixed top-0 right-0 h-full w-[30%] bg-white shadow-lg z-50 transition-transform duration-300 flex flex-col ${
              isModalOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Modal Header */}
            <div
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
              }}
              className="flex-shrink-0 w-full flex items-center py-2 gap-3 px-5 bg-white z-50"
            >
              <button onClick={closeModal}>
                <RxCross2 size={20} />
              </button>
              <h2 className="text-xl font-semibold">Enter Coupon Details</h2>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <p className="mb-2">Upload Image</p>
                  <div className="flex justify-center items-center bg-gray-100">
                    <div className="bg-white rounded-lg w-full max-w-lg">
                      <label className="flex flex-col items-center cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          {...register("image", { required: true })}
                          onChange={handleFileChange}
                        />
                        {/* <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#dd0d5d] rounded-lg p-6 hover:border-[#f50963] transition">
                          {file ? (
                            <div className="relative flex flex-col items-center justify-center">
                              <div className="border p-2 rounded-md">
                                <img
                                  src={file}
                                  alt="Preview"
                                  className="w-28 flex object-contain rounded-md"
                                />
                              </div>
                              <button
                                onClick={handleRemoveImage}
                                className="bg-white"
                              >
                                <RxCross2
                                  className="absolute -top-2 right-12 border border-red-500 rounded-full"
                                  color="red"
                                />
                              </button>
                              <p className="text-[12px] text-stone-700 pt-2">
                                (Only png* jpg* jpeg* webp/ will be accepted)
                              </p>
                            </div>
                          ) : (
                            <div className="text-center flex flex-col items-center justify-center text-gray-500">
                              <VscCloudUpload size={35} />{" "}
                              <span>Select a file or drag here</span>
                              <p className="text-[12px] text-stone-700">
                                (Only png* jpg* jpeg* webp/ will be accepted)
                              </p>
                            </div>
                          )}
                        </div> */}
                        <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#dd0d5d] rounded-lg p-6 hover:border-[#f50963] transition">
                          {imageLoading ? (
                            // Show loading spinner or message
                            <div className="text-center flex flex-col items-center justify-center text-gray-500">
                              <PropagateLoader />
                            </div>
                          ) : file ? (
                            // Show the image preview once it's uploaded
                            <div className="relative flex flex-col items-center justify-center">
                              <div className="border p-2 rounded-md">
                                <img
                                  src={file}
                                  alt="Preview"
                                  className="w-28 h-20 flex object-contain rounded-md"
                                />
                              </div>
                              <button
                                onClick={handleRemoveImage}
                                className="bg-white"
                              >
                                <RxCross2
                                  className="absolute -top-2 right-12 border border-red-500 rounded-full"
                                  color="red"
                                />
                              </button>
                              <p className="text-[12px] text-stone-700 pt-2">
                                (Only png* jpg* jpeg* webp/ will be accepted)
                              </p>
                            </div>
                          ) : (
                            // Default file selection prompt
                            <div className="text-center flex flex-col items-center justify-center text-gray-500">
                              <VscCloudUpload size={35} />
                              <span>Select a file or drag here</span>
                              <p className="text-[12px] text-stone-700">
                                (Only png* jpg* jpeg* webp/ will be accepted)
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                {/* Name */}
                <div>
                  <label className="block text-xs text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="name"
                    className="mt-1 px-3 py-2 w-full text-gray-700 font-normal rounded-md border border-gray-500 focus:border-[#f50963] focus:outline-none"
                  />
                </div>
                {/* Code */}
                <div>
                  <label className="block text-xs text-gray-700">Code</label>
                  <input
                    type="text"
                    {...register("code", { required: true })}
                    placeholder="code"
                    className="mt-1 px-3 py-2 w-full text-gray-700 font-normal rounded-md border border-gray-500 focus:border-[#f50963] focus:outline-none"
                  />
                </div>
                {/* Amount */}
                <div>
                  <label className="block text-xs text-gray-700">Amount</label>
                  <input
                    type="number"
                    {...register("amount", { required: true })}
                    placeholder="amount"
                    className="mt-1 px-3 py-2 w-full text-gray-700 font-normal rounded-md border border-gray-500 focus:border-[#f50963] focus:outline-none"
                  />
                </div>
                {/* Start Date */}
                <div>
                  <label className="block text-xs text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register("start", { required: true })}
                    placeholder="startDate"
                    className="mt-1 px-3 py-2 w-full text-gray-700 font-normal rounded-md border border-gray-500 focus:border-[#f50963] focus:outline-none"
                  />
                </div>
                {/* End Date */}
                <div>
                  <label className="block text-xs text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register("end", { required: true })}
                    placeholder="endDate"
                    className="mt-1 px-3 py-2 w-full text-gray-700 font-normal rounded-md border border-gray-500 focus:border-[#f50963] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex-shrink-0 gap-5 w-full flex  bg-white py-3 px-5"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px -1px 3px 0px, rgba(0, 0, 0, 0.06) 0px -1px 2px 0px",
              }}
            >
              <button
                type="submit"
                className="px-5 py-2 w-full bg-[#f50963] text-white rounded-md"
              >
                Add Coupon
              </button>
              <button
                onClick={closeModal}
                className="px-5 py-2 w-full border border-[#f50963] text-[#f50963] rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AddCoupon;
