import React from "react";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Blog from "./components/Blog";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <FeatureSection />
            <Blog />
            <Pricing />
            <Footer />
        </>
    )
}

export default HomePage