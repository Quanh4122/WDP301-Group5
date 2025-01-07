import React from 'react';
import { Button, Card, Checkbox, Form, Input } from 'antd';

interface props {
    errorMessage: string;
    onFinish: (values: any) => void;
    onFinishFailed: (errorInfo: any) => void;
    toSignupPage: () => void;
}

const SignInForm = ({ onFinish, onFinishFailed, toSignupPage, errorMessage }: props) => (
    <div
        className="height-full-screen width-full-screen"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
        <Card title="Sign in" style={{ minWidth: 500 }}>
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
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                {errorMessage ? <p style={{ color: 'red' }}>{errorMessage}</p> : null}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Form.Item style={{ padding: 0, margin: 0 }}>
                        <Button type="primary" htmlType="submit">
                            Sign in
                        </Button>
                    </Form.Item>
                </div>
                <p>
                    {'if you have not have an account yet, please sign up'}
                    <Button onClick={toSignupPage} style={{ padding: 0, margin: 0 }} type="link">
                        sign up
                    </Button>
                </p>
            </Form>
        </Card>
    </div>
);

export default SignInForm;
