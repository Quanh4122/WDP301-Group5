import { Breadcrumb, Button, Layout, Menu, theme, Typography } from 'antd';
import React from 'react';

interface props {
    data: string;
}
export const ModeratorView = ({ data }: props) => (
    <div
        className="width-full-screen"
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '86vh',
        }}
    >
        <Typography.Title className="gardient-color">{data}</Typography.Title>
    </div>
);
