import React, { useState } from 'react';
import { Form, message } from 'antd';
import { useAppDispatch } from '../../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';
import LogoBBM from '../../../../assets/images/Logo.svg';
import { MGPasswordOnlyForm } from '../../../components/common/MGPasswordOnlyForm';
import { Header } from './components/Header';
import { ChangePasswordForm } from './components/Form';

const ChangePasswordPage = () => {
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

    return (
        <>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
                <Header />
                <div
                    style={{
                        width: '100%',
                        paddingRight: 20,
                        paddingLeft: 20,
                        marginTop: 20,
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <ChangePasswordForm errorMessage={errorMessage} form={form} submit={submit} />
                </div>
            </div>
        </>
    );
};
export default ChangePasswordPage;
