import React, { useEffect, useMemo } from "react";
import Content from "../../Content/Content";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "../styles.css";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../../Pages/Redux/Shoes/shoesSlice";
import HoverCard from "../../Design/HoverCard";
import Title from "../../Design/Title";

const BestSelling = () => {
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShoes());
  }, []);
  // Sort products based on 'selling' in descending order
  const sortedProducts = useMemo(() => {
    return [...Shoes].sort((a, b) => b.selling - a.selling);
  }, [Shoes]);

  // Select the top 6 products
  const top10Products = sortedProducts.slice(0, 10);

  return (
    <Content>
      {/* <span className="flex items-center">
        <span className="h-[2px] flex-1 bg-black"></span>
        <span className="shrink-0 px-6 text-black font-bold">
          BEST SELLING'S PRODUCTS
        </span>
        <span className="h-[2px] flex-1 bg-black"></span>
      </span> */}
      <Title title={"BEST SELLING'S PRODUCTS"} />

      <div>
        <Swiper
          spaceBetween={10}
          modules={[Pagination]}
          className="mySwiper mt-5"
          breakpoints={{
            // When the viewport width is >= 640px
            640: {
              slidesPerView: 4, // 4 slides per view on larger screens
            },
            // When the viewport width is < 640px
            0: {
              slidesPerView: 1, // 1 slide per view on small screens
            },
          }}
        >
          {top10Products.map((shoe) => (
            <SwiperSlide key={shoe._id}>
              <HoverCard shoe={shoe} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Content>
  );
};

export default BestSelling;
