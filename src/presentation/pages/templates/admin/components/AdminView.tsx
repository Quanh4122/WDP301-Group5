import React from 'react';
import { Typography } from 'antd';
interface props {
    data: string;
}
export const AdminView = ({ data }: props) => (
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
