import React from 'react';

import LogoBBM from '../../assets/images/Logo.svg';
import EmailIcon from '../../assets/icons/email-1.svg';
import KeyIcon from '../../../assets/icons/key-1.svg';

import { Button, Form, FormInstance, Input } from 'antd';
import { PLACEHOLDER } from '../../../utilities/constants/PLACEHOLDER';

interface props {
    form: FormInstance<any>;
    errorMessage: string;
    submit: () => Promise<void>;
    buttonText: string;
    placeholder?: string;
}

export const MGPasswordOnlyForm = ({
    form,
    errorMessage,
    buttonText,
    placeholder,
    submit,
}: props) => {
    return (
        <>
            <Form form={form} style={{ width: '100%' }} onFinish={submit}>
                <Form.Item name="password">
                    <Input.Password
                        prefix={<img src={KeyIcon} alt="" />}
                        size="large"
                        placeholder={placeholder ?? PLACEHOLDER.PASSWORD}
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
            <p style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</p>
        </>
    );
};
