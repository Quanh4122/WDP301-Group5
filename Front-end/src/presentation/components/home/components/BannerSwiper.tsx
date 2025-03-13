import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Chỉ import Autoplay
import Banner1 from "../../../assets/banner1.png";
import Banner2 from "../../../assets/banner2.png";
import Banner3 from "../../../assets/banner3.png";
import Banner4 from "../../../assets/banner4.png";
import Banner5 from "../../../assets/banner5.png";
import "swiper/css"; // Chỉ cần CSS cơ bản

const BannerSwiper = () => {
  return (
    <div>
      <Swiper
        modules={[Autoplay]} // Chỉ dùng Autoplay
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{
          delay: 2500, // 2.5 giây
          disableOnInteraction: false,
        }}
      >
        <SwiperSlide>
          <img src={Banner1} alt="Image 1" className="w-full h-auto object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Banner2} alt="Image 2" className="w-full h-auto object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Banner3} alt="Image 3" className="w-full h-auto object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Banner4} alt="Image 4" className="w-full h-auto object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Banner5} alt="Image 5" className="w-full h-auto object-cover" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default BannerSwiper;