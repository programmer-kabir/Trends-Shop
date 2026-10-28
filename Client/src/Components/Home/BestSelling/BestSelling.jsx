import React, { useEffect, useMemo } from "react";
import Content from "../../Content/Content";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoes } from "../../../Pages/Redux/Shoes/shoesSlice";
import LuxuryProductCard from "../../Design/LuxuryProductCard";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const BestSelling = () => {
  const { isLoading, Shoes } = useSelector((state) => state.Shoes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShoes());
  }, [dispatch]);

  const sortedProducts = useMemo(() => {
    return [...(Shoes || [])].sort((a, b) => (b.selling || 0) - (a.selling || 0));
  }, [Shoes]);

  const top10Products = sortedProducts.slice(0, 8);

  return (
    <section id="bestselling" className="py-12 bg-white dark:bg-[#0B0F19] transition-colors">
      <Content>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              <span className="w-6 h-[2px] bg-amber-500"></span>
              Customer Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Best Selling Footwear
            </h2>
          </div>
          <Link
            to="/products/MAN'S-FORMAL"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors uppercase tracking-wider group"
          >
            <span>View All Products</span>
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Swiper Slider */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-[340px] rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <Swiper
            spaceBetween={20}
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="pb-12"
            breakpoints={{
              1280: { slidesPerView: 4 },
              1024: { slidesPerView: 3 },
              640: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
          >
            {top10Products.map((shoe) => (
              <SwiperSlide key={shoe._id} className="h-auto pb-8">
                <LuxuryProductCard shoe={shoe} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Content>
    </section>
  );
};

export default BestSelling;

