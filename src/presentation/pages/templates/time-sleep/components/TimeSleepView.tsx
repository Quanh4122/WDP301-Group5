import React from 'react';

import { Breadcrumb, Button, Layout, Menu, theme, Typography } from 'antd';
interface props {
    data: string;
}
export const TimeSleepView = ({ data }: props) => (
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
