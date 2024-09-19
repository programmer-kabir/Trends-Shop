import React, { useEffect } from "react";
import Content from "../../Content/Content";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "./styles.css";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../../Pages/Redux/Shoes/shoesSlice";
import HoverCard from "../../Design/HoverCard";

const BestSelling = () => {
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShoes());
  }, []);

  return (
    <Content>
      <span className="flex items-center">
        <span className="h-[2px] flex-1 bg-black"></span>
        <span className="shrink-0 px-6 text-black font-bold">
          BEST SELLING'S PRODUCTS
        </span>
        <span className="h-[2px] flex-1 bg-black"></span>
      </span>

      <div>
        <Swiper
          slidesPerView={4}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {Shoes.map((shoe) => (
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
