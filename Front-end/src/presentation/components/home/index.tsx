import React from "react";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Blog from "./components/Blog";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import ManyCarBanner from "./components/ManyCarBanner";
import BannerSwiper from "./components/BannerSwiper";

const HomePage = () => {
    return (
        <>
            <BannerSwiper />
            <HeroSection />
            <FeatureSection listContent={"Xe được yêu thích nhất"} />
            <FeatureSection listContent={"Xe có ngay"} />
            {/* <Blog />
            <Pricing /> */}
            <ManyCarBanner />
        </>
    )
}

export default HomePage