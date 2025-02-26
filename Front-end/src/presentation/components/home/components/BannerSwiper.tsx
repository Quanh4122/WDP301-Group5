import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import Banner1 from '../../../assets/banner1.png'
import Banner2 from '../../../assets/banner2.png'
import Banner3 from '../../../assets/banner3.png'
import Banner4 from '../../../assets/banner4.png'
import Banner5 from '../../../assets/banner5.png'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const BannerSwiper = () => {
    return (
        <div>
            <Swiper
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper: any) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
                autoplay={{
                    delay: 300,
                    disableOnInteraction: false,
                }}
            >
                <SwiperSlide>
                    <img src={Banner1} alt="Image 1" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={Banner2} alt="Image 2" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={Banner3} alt="Image 3" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={Banner4} alt="Image 4" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={Banner5} alt="Image 5" />
                </SwiperSlide>

            </Swiper>
        </div>
    )
}

export default BannerSwiper