import { Layout } from "antd";
import React from "react";

import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";


interface props {
    children?: string | JSX.Element | JSX.Element[];
}

const { Header } = Layout

const LayoutContainer = ({ children }: props) => {

    return (
        <>
            <Navbar />
            <>
                {children}
            </>
            <Footer />
        </>
    )
}

export default LayoutContainer