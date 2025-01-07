import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignInPage from '../pages/templates/sign-in';
import SignUpPage from '../pages/templates/sign-up';
import HomePage from '../pages/templates/home';
import CounterPage from '../pages/templates/counter';
import AdminPage from '../pages/templates/admin';
import UserPage from '../pages/templates/user';
import ModeratorPage from '../pages/templates/moderator';
import TimeSleepPage from '../pages/templates/time-sleep';
import { AppProps } from '../App';
import { AUTH_ROUTES, PRIVATE_ROUTES } from './CONSTANTS';
import LoadingComponent from '../components/common/Loading';
import NotFound from '../components/common/NotFound';
import ErrorSite from '../components/common/Error';
import { PrivateRoute } from '../components/common/PrivateRoute';
import DashboardPage from '../pages/templates/dashboard';
import MG11Page from '../pages/MG/MG-1-1';
import MG00201Page from '../pages/MG/MG-002-01';
import MG00401Page from '../pages/MG/MG-004-01';
import MG00501Page from '../pages/MG/MG-005-01';
import MG00601Page from '../pages/MG/MG-006-01';
import MG00701Page from '../pages/MG/MG-007-01';
import MG01301Page from '../pages/MG/MG-013-01';
import ChangePasswordPage from '../pages/MG/change-password';
import MG013012Page from '../pages/MG/MG-013-01-2';
import MG00901Page from '../pages/MG/MG-009-01';
import MG01101Page from '../pages/MG/MG-011-01';
import MG01001Page from '../pages/MG/MG-010-01';
import MG01401Page from '../pages/MG/MG-014-01';

const Router = (props: AppProps) => {
    const privateRoutes: any[] = [
        {
            path: PRIVATE_ROUTES.SUB.COUNTER,
            element: <CounterPage />,
        },
        {
            path: PRIVATE_ROUTES.SUB.ADMIN,
            element: <AdminPage testUseCase={props.testUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.USER,
            element: <UserPage testUseCase={props.testUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.MOD,
            element: <ModeratorPage testUseCase={props.testUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.TIME,
            element: <TimeSleepPage testUseCase={props.testUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.DASHBOARD,
            element: <DashboardPage />,
        },
        {
            path: PRIVATE_ROUTES.SUB.MG00201,
            element: <MG00201Page userUseCase={props.userUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.MG01301,
            element: <MG01301Page userUseCase={props.userUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.MG013012,
            element: <MG013012Page userUseCase={props.userUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.CHANGE_PASSWORD,
            element: <ChangePasswordPage />,
        },
        {
            path: PRIVATE_ROUTES.SUB.MG00901,
            element: <MG00901Page userUseCase={props.userUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.MG01001,
            element: <MG01001Page userUseCase={props.userUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.MG01101,
            element: <MG01101Page userUseCase={props.userUseCase} />,
        },
        {
            path: PRIVATE_ROUTES.SUB.MG01401,
            element: <MG01401Page userUseCase={props.userUseCase} />,
        },
    ];

    const authRoutes: any[] = [
        {
            path: AUTH_ROUTES.SUB.SIGNUP,
            element: <SignUpPage authenUseCase={props.authUseCase} />,
        },
        {
            path: AUTH_ROUTES.SUB.MG11,
            element: <MG11Page />,
        },
        {
            path: AUTH_ROUTES.SUB.MG00401,
            element: <MG00401Page />,
        },
        {
            path: AUTH_ROUTES.SUB.MG00501,
            element: <MG00501Page />,
        },
        {
            path: AUTH_ROUTES.SUB.MG00601,
            element: <MG00601Page />,
        },
        {
            path: AUTH_ROUTES.SUB.MG00701,
            element: <MG00701Page />,
        },
        {
            path: AUTH_ROUTES.SUB.SIGNIN,
            element: (
                <SignInPage
                    userStorage={props.userStorageUseCase}
                    authenUseCase={props.authUseCase}
                />
            ),
        },
    ];

    return (
        <LoadingComponent>
            <Routes>
                <Route
                    path="/"
                    errorElement={<ErrorSite />}
                    element={<HomePage userStorageUseCase={props.userStorageUseCase} />}
                />
                <Route path={AUTH_ROUTES.PATH}>
                    {authRoutes.map((element, index) => (
                        <Route
                            key={index}
                            path={element.path}
                            errorElement={<ErrorSite />}
                            element={element.element}
                        />
                    ))}
                </Route>
                <Route
                    path={PRIVATE_ROUTES.PATH}
                    element={<PrivateRoute userStorageUseCase={props.userStorageUseCase} />}
                >
                    {privateRoutes.map((element, index) => (
                        <Route
                            key={index}
                            path={element.path}
                            errorElement={<ErrorSite />}
                            element={element.element}
                        />
                    ))}
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </LoadingComponent>
    );
};

export default Router;
