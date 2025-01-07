import React from 'react';
import { Form, Input } from 'antd';

export const NearestStationRoute2 = () => {
    return (
        <Form.Item
            name="nearestStationRoute2"
            label="最寄駅路線２*"
            rules={[
                {
                    required: true,
                    message: 'required message',
                },
            ]}
        >
            <Input style={{ width: '100%' }} />
        </Form.Item>
    );
};
