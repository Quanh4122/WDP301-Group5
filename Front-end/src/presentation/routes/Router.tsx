import React from "react";
import { PRIVATE_ROUTES, ROOT } from "./CONSTANTS";
import { Route, Routes } from "react-router-dom";
import LayoutContainer from "../components/Layout/component/LayoutContainer";
import ListAll from "../components/list_all";
import PrivateRoute from "../components/Layout/PrivateRoute";
import ProductDetai from "../components/list_all/components/ProductDetail";
import path from "path";
import SignIn from "../components/sign-in";
import Dashboard from "../components/dashboard/Dashboard";
import Checkout from "../components/checkout/Checkout";

const Router = () => {

    const privateRoutes: any[] = [
        {
            path: ROOT,
            element: <ListAll />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.PRODUCT_DETAIL,
            element: <ProductDetai />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.SIGN_IN,
            element: <SignIn />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.DASH_BOARD,
            element: <Dashboard />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CHECK_OUT,
            element: <Checkout />
        }
    ]

    return (
        <Routes>
            <Route
                path={ROOT}
                element={<PrivateRoute />}
            >
                {
                    privateRoutes.map((element: any, index) => (
                        <Route
                            key={index}
                            path={element.path}
                            element={element.element}
                        />
                    ))
                }
            </Route>
        </Routes>
    )
}

export default Router