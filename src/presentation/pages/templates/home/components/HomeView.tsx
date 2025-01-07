import React from 'react';
import { Breadcrumb, Button, Layout, Menu, theme, Typography } from 'antd';

const { Header, Content, Footer } = Layout;

interface props {
    userLocal: any;
    toSigninPage: () => void;
    toSignupPage: () => void;
    logoutApp: () => void;
}

export const HomeView = ({ toSigninPage, toSignupPage, logoutApp, userLocal }: props) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '86vh',
            }}
        >
            <Typography.Title className="gardient-color">
                Welcome back {userLocal?.user?.fullname ?? 'my dear guest'}
            </Typography.Title>
        </div>
    );
};
