import React, { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons } from "../../Redux/Coupons/couponsSlice";

const Coupon = () => {
  const { isLoading, Coupons, error } = useSelector((state) => state.Coupons);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCoupons());
  }, []);
  console.log(Coupons);
  return (
    <section
      className="mx-5 px-5 py-7 my-2 bg-white "
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
      }}
    >
      <div className="flex items-center justify-between pt-5">
        <div className="w-64 py-2 hidden  md:flex  items-center gap-3 bg-gray-200 rounded-md">
          {" "}
          <div className="pl-4">
            <FiSearch className="primaryColor" size={23} />
          </div>
          <input
            type="search"
            name=""
            placeholder="Search"
            id=""
            className="outline-none primaryColor bg-transparent"
          />
        </div>
        <div>
          <button className="bg-[#f50963] px-5 py-2 rounded-md text-white font-semibold">
            Add Coupon
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="pt-10 overflow-hidden">
        <table className="min-w-full divide-y-2  divide-gray-200 bg-white text-sm ">
          <thead className="text-left ">
            <tr className="">
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
            {/* {user?.map((User) => (
            <tr>
              <td className="whitespace-nowrap px-4 py-2 text-[#a5a5a5] font-bold">
                {User.name}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {User?.email}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {User?.role ? User?.role : "User"}
              </td>

              <td className="whitespace-nowrap px-4 py-2">
                <div className="flex gap-2">
                  <span
                    onClick={() => handleMakeAdmin(User)}
                    className="inline-flex items-center gap-1 rounded-full bg-cyan-200 hover:bg-cyan-400 hover:text-gray-600 transition-colors duration-500 px-2 py-1 text-xs font-semibold  text-cyan-600"
                  >
                    {User.role === "admin" ? "admin" : <>Make Admin</>}
                  </span>
                  {User.role === "admin" ? (
                    <span
                      onClick={() => handleMakeAdmin(User)}
                      className="inline-flex items-center gap-1 rounded-full bg-cyan-200 hover:bg-cyan-400 hover:text-gray-600 transition-colors duration-500 px-2 py-1 text-xs font-semibold  text-cyan-600"
                    >
                      {User.role === "admin" ? <>Make User</> : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            </tr>
          ))} */}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Coupon;
