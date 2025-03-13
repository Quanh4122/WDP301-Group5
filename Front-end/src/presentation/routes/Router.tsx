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
import CreateBlog from "../components/blog/createBlog";
import Verify from "../components/auth/Verify";
import ResetPassword from "../components/auth/ResetPassword";
import ForgotPassword from "../components/auth/ForgotPassword";
import UserProfile from "../components/auth/UserProfile";
import EditProfile from "../components/auth/EditProfile";
import CarList from "../components/car_list";
import CarDetail from "../components/car_detail";
import BlogDetail from "../components/blog/BlogDetail";
import BlogList from "../components/blog/BlogList";
import ChangePassword from "../components/auth/ChangePassword";
import CarCreate from "../components/car_create";
import DriverList from "../components/driverlist/DriverList";
import NotFound from "../components/auth/NotFound";
import NotAuthentication from "../components/auth/NotAuthentication";
import NotAuthorization from "../components/auth/NotAuthorization";
import ProtectedRoute from "./PrivateRoute";
import RequestList from "../components/request_list";
import CreateDriver from "../components/driver_create";
import AdminRequest from "../components/list_request_admin";
import ListRequestPending from "../components/list_request_admin/components/ListRequestPending";
import AdminDetailRequest from "../components/list_request_admin/components/AdminDetailRequest";
import TransactionList from "../components/transaction/transactionList";


const Router = () => {

    const privateRoutes: any[] = [
        {
            path: ROOT,
            element: <HomePage />
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
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.NOT_FOUND,
            element: <NotFound />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.NOT_AUTHENTICATION,
            element: <NotAuthentication />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.NOT_AUTHORIZATION,
            element: <NotAuthorization />
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
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.PROFILE + "/:userId",
            element: <ProtectedRoute><UserProfile /></ProtectedRoute>
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.EDIT_PROFILE + "/:userId",
            element: <ProtectedRoute><EditProfile /></ProtectedRoute>
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CHANGE_PASSWORD + "/:userId",
            element: <ProtectedRoute><ChangePassword /></ProtectedRoute>
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
            element: <ProtectedRoute requiredRole="Admin"><Dashboard /></ProtectedRoute>
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.BOOKING,
            element: <Checkout />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/createBlog",
            element: <ProtectedRoute requiredRole="Admin"><CreateBlog /></ProtectedRoute>
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
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_CREATE,
            element: <ProtectedRoute requiredRole="Admin"><CarCreate /></ProtectedRoute>
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.DRIVER_LIST,
            element: <DriverList />
        },
        {
            path: "*",
            element: <NotFound />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.BOOKING_LIST,
            element: <ProtectedRoute><RequestList /></ProtectedRoute>
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.DRIVER_CREATE,
            element: <CreateDriver />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.ADMIN_REQUEST,
            element: <AdminRequest />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.ADMIN_DETAIL_REQUEST,
            element: <AdminDetailRequest />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.TRANSACTION,
            element: <TransactionList />
        },
        
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