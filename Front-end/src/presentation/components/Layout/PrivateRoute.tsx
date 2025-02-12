import React from "react";
import LayoutContainer from "./component/LayoutContainer";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
    return (
        <LayoutContainer>
            <Outlet />
        </LayoutContainer>
    )
}

export default PrivateRoute