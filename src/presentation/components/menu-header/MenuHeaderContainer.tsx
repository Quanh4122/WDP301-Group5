import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuHeaderView } from './MenuHeaderView';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { AUTH_ROUTES, PRIVATE_ROUTES, ROOT } from '../../router/CONSTANTS';
import { logout } from '../../redux/features/authen/authenSlice';
import { UserToken } from '../../../domain/entities/UserEntity';
import { UserStorageUseCaseInterface } from '../../../application/usecases/UserStorageUseCase';

interface props {
    userStorageUseCase: UserStorageUseCaseInterface;
    children?: string | JSX.Element | JSX.Element[];
}

export const MenuHeaderContainer = ({ children, userStorageUseCase }: props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [userLocal, setUserLocal] = useState<UserToken | null | undefined>();
    const [chosenItem, setChosenItem] = useState<string[]>([]);

    useEffect(() => {
        initiateMenu();
    }, [location.pathname]);

    useEffect(() => {
        const user = userStorageUseCase.getUserInfo();
        setUserLocal(user);
    }, []);

    const logoutApp = () => {
        userStorageUseCase.removeUserInfo();
        dispatch(logout());
        window.location.reload();
        navigate(ROOT);
    };

    const toSigninPage = () => {
        navigate(AUTH_ROUTES.PATH + '/' + AUTH_ROUTES.SUB.SIGNIN);
    };

    const toSignupPage = () => {
        navigate(AUTH_ROUTES.PATH + '/' + AUTH_ROUTES.SUB.SIGNUP);
    };

    const selectMenuItem = (value: any) => {
        navigate(PRIVATE_ROUTES.PATH + '/' + value.selectedKeys);
    };

    const initiateMenu = () => {
        const pathName = location.pathname;
        const pathNameArr = pathName.split('/');
        if (pathNameArr.length > 0 && pathNameArr[pathNameArr.length - 1] !== '') {
            setChosenItem([pathNameArr[pathNameArr.length - 1]]);
        }
    };

    return (
        <MenuHeaderView
            selectMenuItem={selectMenuItem}
            logoutApp={logoutApp}
            toSigninPage={toSigninPage}
            toSignupPage={toSignupPage}
            chosenItem={chosenItem}
            userLocal={userLocal}
        >
            {children}
        </MenuHeaderView>
    );
};
