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


const MensCollection = () => {
  const { isLoading, Shoes, error } = useSelector((state) => state.Shoes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShoes());
  }, []);
  const mensShoes = useMemo(() => {
    return Shoes.filter((shoe) => shoe.gender === "MEN'S");
  }, [Shoes]);


  return (
    <Content className="">
    {/* <span className="flex items-center">
      <span className="h-[2px] flex-1 bg-black"></span>
      <span className="shrink-0 px-6 text-[#f50400] font-bold">
      MEN'S COLLECTION
      </span>
      <span className="h-[2px] flex-1 bg-black"></span>
    </span> */}
    <Title title={"MEN'S COLLECTION"}/>

    <div>
      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        
        modules={[Pagination]}
        className="mySwiper mt-5"
      >
        {mensShoes.map((shoe) => (
          <SwiperSlide key={shoe._id}>
            <HoverCard shoe={shoe} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </Content>
  )
}

export default MensCollection