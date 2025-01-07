import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_ROUTES, ROOT } from '../../../router/CONSTANTS';
import { message } from 'antd';
import { useState } from 'react';
import { SignInData } from '../../../../domain/entities/AuthEntity';
import SignInForm from './components/SignInnForm';
import { AuthUseCaseInterface } from '../../../../application/usecases/AuthUseCase';
import { useAppDispatch } from '../../../redux/hooks';
import { setUser } from '../../../redux/features/authen/authenSlice';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';
import { UserStorageUseCaseInterface } from '../../../../application/usecases/UserStorageUseCase';

interface props {
    authenUseCase: AuthUseCaseInterface;
    userStorage: UserStorageUseCaseInterface;
}

const SignInPage = ({ authenUseCase, userStorage }: props) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [errorMessage, setErrorMessage] = useState<string>('');

    const onFinish = async (values: any) => {
        try {
            const payload: SignInData = {
                username: values.username,
                password: values.password,
            };
            dispatch(startFetching());
            const results = await authenUseCase.signin(payload);
            userStorage.setUserInfo(results);
            dispatch(setUser(results));
            navigate(ROOT);
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: error?.message ?? 'Username or password is not correct!',
            });
            setErrorMessage('Username or password is not correct!');
        } finally {
            dispatch(completeFetching());
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const toSignupPage = () => {
        navigate(AUTH_ROUTES.PATH + '/' + AUTH_ROUTES.SUB.SIGNUP);
    };

    return (
        <>
            <SignInForm
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                toSignupPage={toSignupPage}
                errorMessage={errorMessage}
            />
            {contextHolder}
        </>
    );
};

export default SignInPage;
