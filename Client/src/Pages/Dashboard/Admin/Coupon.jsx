import React from "react";
import { FiSearch } from "react-icons/fi";

const Coupon = () => {
  return (
    <section className="mx-5 px-5 py-7 my-2 bg-white "  style={{
      boxShadow:
        "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
    }}>
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
<button className="bg-[#f50963]">Add Coupon</button>
      </div>
      </div>
    </section>
  );
};

export default Coupon;
