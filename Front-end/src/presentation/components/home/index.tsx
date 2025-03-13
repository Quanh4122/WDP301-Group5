import React from "react";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import CarLogoCarousel from "./components/CarLogoCarousel";
import BannerSwiper from "./components/BannerSwiper";
import Feature from "./components/Feature";

const HomePage = () => {
    return (
        <>
            <BannerSwiper />
            <CarLogoCarousel />
            <HeroSection />
            <FeatureSection listContent={"Xe được yêu thích nhất"} />
            <FeatureSection listContent={"Xe có ngay"} />
            <Feature/>
        </>
    )
}

export default HomePage