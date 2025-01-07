import { Navigate, Outlet } from 'react-router-dom';
import { UserStorageUseCaseInterface } from '../../../application/usecases/UserStorageUseCase';
import MenuHeader from '../menu-header';
import React from 'react';

interface props {
    userStorageUseCase: UserStorageUseCaseInterface;
}

export const PrivateRoute = ({ userStorageUseCase }: props) => {
    // const user = userStorageUseCase.getUserInfo();
    // if (!user) return <Navigate to="/authen/signin" />;
    return (
        <MenuHeader userStorageUseCase={userStorageUseCase}>
            <Outlet />
        </MenuHeader>
    );
};
