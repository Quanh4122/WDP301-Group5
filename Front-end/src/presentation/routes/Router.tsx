import { PRIVATE_ROUTES, ROOT } from "./CONSTANTS";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/Layout/PrivateRoute";
import ProductDetai from "../components/list_all/components/ProductDetail";
import SignIn from "../components/auth/SignIn";
import Dashboard from "../components/dashboard/Dashboard";
import Checkout from "../components/checkout/Checkout";
import HomePage from "../components/home";
import SignUp from "../components/auth/SignUp";
import NotAuthenticated from "../components/services/NotAuthenticated";
import Authorization from "../components/services/Authorization";
import Booking from "../components/customer/Booking";
import CreateBlog from "../components/blog/createBlog";
import Verify from "../components/auth/Verify";
import ResetPassword from "../components/auth/ResetPassword";
import ForgotPassword from "../components/auth/ForgotPassword";
import CarList from "../components/car_list";
import CarDetail from "../components/car_detail";
import BlogDetail from "../components/blog/BlogDetail";
import BlogList from "../components/blog/BlogList";


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
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.VERIFY,
            element: <Verify />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.FORGOT_PASSWORD,
            element: <ForgotPassword />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.RESET_PASSWORD,
            element: <ResetPassword />
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
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.BOOKING,
            element: <Booking />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/createBlog",
            element: <CreateBlog />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/blog/:postId",
            element: <BlogDetail />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/blog",
            element: <BlogList />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_LIST,
            element: <CarList />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_DETAIL,
            element: <CarDetail />
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