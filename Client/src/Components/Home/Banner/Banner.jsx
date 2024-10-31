import React from "react";
import BannerImage from "../../../assets/Banner/banner.png";
import "./Banner.css";
import Collection from "../Collection/Collection";
const Banner = () => {
  return (
    <section className="relative">
      <div className="">
        {/* <img
          className="h-[450px] w-full object-cover"
          // src={BannerImage}
          src="https://trendys.vercel.app/assets/Trendy%20Banner-Cer6Yw6Z.png"
          alt=""
        /> */}
        <img
          className="h-[200px] md:h-[450px] w-full object-fill"
          src="https://trendys.vercel.app/assets/Trendy%20Banner-Cer6Yw6Z.png"
          alt=""
        />
      </div>

      {/* <div className="absolute right-0 inset-0 flex flex-col justify-center items-end space-y-4 md:pr-20 pr-5">
        <div className="md:text-center space-y-2">
          <h1 className="uppercase text-4xl md:text-8xl font-bold bannerHeder">
            <span className="text-transparent stroke-white stroke-2">
              Grand
            </span>{" "}
            <br />
            <span className="text-[#f50400]">Opening</span>
          </h1>
          <p className="bannerText text-white text-3xl italic font-bold">
            Sale on All Items
          </p>
          <button className="px-8 bannerButton py-2 bg-[#f50400] text-white font-semibold text-xl">
            Buy Now
          </button>
        </div>
      </div> */}
    </section>
  );
};

export default Banner;
