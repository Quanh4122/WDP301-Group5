import React, { useState } from 'react';
import { Form, message } from 'antd';
import { MGEmailPasswordForm } from '../../../components/common/MGEmailPasswordForm';
import { useAppDispatch } from '../../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';

const MG11Page = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [errorMessage, setErrorMessage] = useState<string>('');

    const submit = async () => {
        try {
            const payload = {
                email: form.getFieldValue('email'),
                password: form.getFieldValue('password'),
            };
            dispatch(startFetching());
            // const results = await authenUseCase.signin(payload);
            // userStorage.setUserInfo(results);
            // dispatch(setUser(results));
            // navigate(ROOT);
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

    const redirectPage = () => {
        navigate('');
    };

    return (
        <div
            className="width-full-screen center-inside"
            style={{
                minHeight: '86vh',
            }}
        >
            <div style={{ width: 400, display: 'inline-block', justifyItems: 'center' }}>
                <p className="login-title">ログイン</p>
                <MGEmailPasswordForm
                    buttonText="ログイン"
                    errorMessage={errorMessage}
                    form={form}
                    redirectPage={redirectPage}
                    submit={submit}
                />
                {contextHolder}
            </div>
        </div>
    );
};

export default MG11Page;
