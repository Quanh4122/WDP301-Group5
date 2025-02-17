import { Button, Form, Input, Layout } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROOT } from "../../../routes/CONSTANTS";
import { ZoomInOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import Bill from "./Bill";
import axios from "axios";
import Navbar from "../../home/components/Navbar";
import HeroSection from "../../home/components/HeroSection";
import FeatureSection from "../../home/components/FeatureSection";
import Blog from "../../home/components/Blog";
import Pricing from "../../home/components/Pricing";
import Footer from "../../home/components/Footer";


interface props {
    children?: string | JSX.Element | JSX.Element[];
}

const { Header } = Layout

const LayoutContainer = ({ children }: props) => {

    return (
        <Layout>
            <Navbar />
            <Layout>
                {children}
            </Layout>
        </Layout>
    )
}

export default LayoutContainer