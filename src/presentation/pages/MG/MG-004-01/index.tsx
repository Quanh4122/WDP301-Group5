import React, { useState } from 'react';
import { Form, message } from 'antd';
import { useAppDispatch } from '../../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { completeFetching, startFetching } from '../../../redux/features/app/appSlice';
import LogoBBM from '../../../../assets/images/Logo.svg';
import { MGPasswordOnlyForm } from '../../../components/common/MGPasswordOnlyForm';

const MG00401Page = () => {
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
        <div
            className="width-full-screen center-inside"
            style={{
                minHeight: '86vh',
            }}
        >
            <div style={{ width: 400, display: 'inline-block', justifyItems: 'center' }}>
                <img
                    style={{
                        marginBottom: 8,
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                    src={LogoBBM}
                    alt=""
                />
                <p className="login-title">パスワード登録</p>
                <MGPasswordOnlyForm
                    buttonText="登録する"
                    errorMessage={errorMessage}
                    form={form}
                    submit={submit}
                />
                {contextHolder}
            </div>
        </div>
    );
};
export default MG00401Page;
