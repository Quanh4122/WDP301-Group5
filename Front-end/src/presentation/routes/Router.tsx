import { PRIVATE_ROUTES, ROOT } from "./CONSTANTS";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/Layout/PrivateRoute";
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
import BlogManager from "../components/blog/BlogManager";
import ChangePassword from "../components/auth/ChangePassword";
import NotFound from "../components/auth/NotFound";
import NotAuthentication from "../components/auth/NotAuthentication";
import NotAuthorization from "../components/auth/NotAuthorization";
import ProtectedRoute from "./PrivateRoute";
import RequestList from "../components/request_list";
import CreateDriver from "../components/driver_create";
import AdminRequest from "../components/list_request_admin";
import AdminDetailRequest from "../components/list_request_admin/components/AdminDetailRequest";
import TransactionList from "../components/transaction/transactionList";
import ApplyDriver from "../components/driver/ApplyDriver";
import ManageAccount from "../components/admin/ManageAccount";
import UserList from "../components/admin/UserList";
import ChangeRoleAccount from "../components/admin/ChangeRoleAccount";
import ManagerCar from "../components/manager_car";
import RequestInExpire from "../components/request_list/component/RequestInExpire";

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
            path: PRIVATE_ROUTES.PATH + "/blogManager",
            element: <ProtectedRoute requiredRole="Admin"><BlogManager /></ProtectedRoute>
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
            path: "*",
            element: <NotFound />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.BOOKING_LIST,
            element: <ProtectedRoute requiredRole="User"><RequestList /></ProtectedRoute>
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.DRIVER_CREATE,
            element: <CreateDriver />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.ADMIN_REQUEST,
            element: <ProtectedRoute requiredRole="Admin"><AdminRequest /></ProtectedRoute>
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.ADMIN_DETAIL_REQUEST,
            element: <AdminDetailRequest />
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.TRANSACTION,
            element: <TransactionList />
        },

        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.MANAGE_DRIVER_ACCEPT,
            element: <ProtectedRoute requiredRole="Admin"><ManageAccount /></ProtectedRoute>
        },

        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.MANAGE_ACCOUNT,
            element: <ProtectedRoute requiredRole="Admin"><UserList /></ProtectedRoute>
        },

        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CHANGE_ROLE_ACCOUNT + "/:userId",
            element: <ProtectedRoute requiredRole="Admin"><ChangeRoleAccount /></ProtectedRoute>
        },

        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.APPLY_DRIVER + "/:userId",
            element: <ProtectedRoute requiredRole="User"><ApplyDriver /></ProtectedRoute>
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.MANAGER_CAR,
            element: <ProtectedRoute requiredRole="Admin"><ManagerCar /></ProtectedRoute>
        },
        {
            path: PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.REQUEST_IN_EXPIRE,
            element: <ProtectedRoute requiredRole="User"><RequestInExpire /></ProtectedRoute>
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