import React from 'react';

import LogoBBM from './../../assets/images/Logo.svg';
import EmailIcon from './../../../assets/icons/email-1.svg';
import KeyIcon from '../../../assets/icons/key-1.svg';


import { Button, Form, FormInstance, Input } from 'antd';
import { PLACEHOLDER } from '../../../utilities/constants/PLACEHOLDER';

interface props {
    form: FormInstance<any>;
    errorMessage: string;
    buttonText: string;

    submit: () => Promise<void>;
    redirectPage: () => void;
}

export const MGEmailPasswordForm = ({
    buttonText,
    form,
    errorMessage,
    submit,
    redirectPage,
}: props) => {
    return (
        <>
            <Form form={form} style={{ width: '100%' }} onFinish={submit}>
                <Form.Item name="email">
                    <Input
                        prefix={<img src={EmailIcon} alt="" />}
                        size="large"
                        placeholder={PLACEHOLDER.LOGIN_EMAIL}
                    />
                </Form.Item>
                <Form.Item name="password">
                    <Input.Password
                        prefix={<img src={KeyIcon} alt="" />}
                        size="large"
                        placeholder={PLACEHOLDER.PASSWORD}
                    />
                </Form.Item>
                <Button
                    className="button-login-text"
                    type="primary"
                    size="large"
                    style={{ width: '100%' }}
                    htmlType="submit"
                >
                    {buttonText}
                </Button>
            </Form>
            <p style={{ textAlign: 'center' }} className="login-last-text">
                ユーザーをお持ちの方はこちらへ{' '}
                <Button
                    onClick={redirectPage}
                    style={{ margin: 0, padding: 0 }}
                    type="link"
                    className="last-text-link"
                >
                    ログイン
                </Button>
            </p>
            <p style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</p>
        </>
    );
};
