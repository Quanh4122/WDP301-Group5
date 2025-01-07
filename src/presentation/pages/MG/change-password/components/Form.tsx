import React from 'react';

import KeyIcon from '../../../../../assets/icons/key-1.svg';

import { Button, Form, FormInstance, Input } from 'antd';
import { PLACEHOLDER } from '../../../../../utilities/constants/PLACEHOLDER';

interface props {
    form: FormInstance<any>;
    errorMessage: string;
    submit: () => Promise<void>;
}

export const ChangePasswordForm = ({ form, errorMessage, submit }: props) => {
    return (
        <>
            <Form form={form} style={{ width: '50%' }} onFinish={submit}>
                <Form.Item name="currentPassword">
                    <Input.Password
                        prefix={<img src={KeyIcon} alt="" />}
                        size="large"
                        placeholder="現在のパスワード"
                    />
                </Form.Item>
                <Form.Item name="newPassword">
                    <Input.Password
                        prefix={<img src={KeyIcon} alt="" />}
                        size="large"
                        placeholder="新しいパスワード"
                    />
                </Form.Item>
                <Button
                    className="button-login-text"
                    type="primary"
                    size="large"
                    style={{ width: '100%' }}
                    htmlType="submit"
                >
                    変更する
                </Button>
            </Form>
            <p style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</p>
        </>
    );
};
