import React from 'react';
import { Button, Card, Checkbox, DatePicker, Form, Input } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { current } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';
import { PhonenumberInputFormItem } from '../../../../components/common/PhonenumberInput';

const { TextArea } = Input;

const disableDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().startOf('day');
};

interface props {
    contextHolder: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    onFinish: (values: any) => void;
    onFinishFailed: (errorInfo: any) => void;
    toSigninPage: () => void;
}

const SignUpForm = ({ contextHolder, onFinish, onFinishFailed, toSigninPage }: props) => (
    <div
        className="height-full-screen width-full-screen"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
        {contextHolder}
        <Card title="Sign up" style={{ minWidth: 500 }}>
            <Form
                layout="vertical"
                name="basic"
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Fullname"
                    name="fullname"
                    rules={[{ required: true, message: 'Please input your fullname!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Re-enter password"
                    name="reEnterPassowrd"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('The new password that you entered do not match!'),
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                            type: 'email',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Address" name="address">
                    <TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Date of birth" name="dob">
                    <DatePicker disabledDate={disableDate} />
                </Form.Item>
                <PhonenumberInputFormItem />
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Form.Item style={{ padding: 0, margin: 0 }}>
                        <Button type="primary" htmlType="submit">
                            Sign up
                        </Button>
                    </Form.Item>
                </div>
                <p>
                    if you already have an account, please{' '}
                    <Button onClick={toSigninPage} style={{ padding: 0, margin: 0 }} type="link">
                        sign in
                    </Button>
                </p>
            </Form>
        </Card>
    </div>
);

export default SignUpForm;
