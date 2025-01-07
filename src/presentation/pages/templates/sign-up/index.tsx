import React from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { AUTH_ROUTES, ROOT } from '../../../router/CONSTANTS';
import { DATE_FORMAT } from '../../../../infrastructure/config/CONSTANTS';
import { useState } from 'react';
import { SignUpData } from '../../../../domain/entities/AuthEntity';
import SuccessResult from '../../../components/common/SuccessResult';
import SignUpForm from './components/SignUpForm';
import { useAppDispatch } from '../../../redux/hooks';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';
import { AuthUseCaseInterface } from '../../../../application/usecases/AuthUseCase';

interface props {
    authenUseCase: AuthUseCaseInterface;
}

const SignUpPage = ({ authenUseCase }: props) => {
    const [registeredData, setRegisteredData] = useState<any>();
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const payload: SignUpData = {
                address: values.address,
                email: values.email,
                username: values.username,
                fullname: values.fullname,
                phonenumber: values.phonenumber,
                dob: values.dob.format(DATE_FORMAT.FORMAT2),
                password: values.password,
                roles: [1],
            };
            dispatch(startFetching());
            const results = await authenUseCase.signup(payload);
            setRegisteredData(results);
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: error?.message ?? 'There is an error!',
            });
        } finally {
            dispatch(completeFetching());
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const toSigninPage = () => {
        navigate(AUTH_ROUTES.PATH + AUTH_ROUTES.SUB.SIGNIN);
    };

    const toHome = () => {
        navigate(ROOT);
    };

    return registeredData ? (
        <SuccessResult toHome={toHome} username={registeredData?.username ?? ''} />
    ) : (
        <SignUpForm
            toSigninPage={toSigninPage}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            contextHolder={contextHolder}
        />
    );
};

export default SignUpPage;
