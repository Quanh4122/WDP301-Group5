import { PRIVATE_ROUTES, ROOT } from "./CONSTANTS";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/Layout/PrivateRoute";
import ProductDetai from "../components/list_all/components/ProductDetail";
import SignIn from "../components/sign-in";
import Dashboard from "../components/dashboard/Dashboard";
import Checkout from "../components/checkout/Checkout";
import HomePage from "../components/home";
import SignUp from "../components/sign-up/SignUp";
import NotAuthenticated from "../components/services/NotAuthenticated";
import Authorization from "../components/services/Authorization";
import Booking from "../components/customer/Booking";


const Router = () => {

    const privateRoutes: any[] = [
        {
            path: ROOT,
            element: <HomePage />
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
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.REGISTER,
            element: <SignUp />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.NOT_AUTHENTICATION,
            element: <NotAuthenticated />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.AUTHORIZATION,
            element: <Authorization />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.DASH_BOARD,
            element: <Dashboard />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CHECK_OUT,
            element: <Checkout />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/booking",
            element: <Booking />
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