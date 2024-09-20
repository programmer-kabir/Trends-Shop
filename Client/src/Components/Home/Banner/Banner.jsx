import React from "react";
import BannerImage from "../../../assets/Banner/banner.png";
import "./Banner.css";
import Collection from "../Collection/Collection";
const Banner = () => {
  return (
    <section className="relative">
      <div className="">
        <img
          className="h-[450px] w-full object-cover"
          src={BannerImage}
          alt=""
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-end space-y-4 pr-20">
        <div className="text-center space-y-2">
          <h1 className="uppercase text-8xl font-bold bannerHeder">
            <span className="text-transparent stroke-white stroke-2">
              Grand
            </span>{" "}
            <br />
            <span className="text-[#f50400]">Opening</span>
          </h1>
          <p className="bannerText text-white text-3xl italic font-bold">Sale on All Items</p>
          <button className="px-8 bannerButton py-2 bg-[#f50400] text-white font-semibold text-xl">
            Buy Now
          </button>
        </div>
      </div>

    </section>
  );
};

export default Banner;
