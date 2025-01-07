import React from 'react';
import { Form, Input } from 'antd';

export const NearestStationRoute1 = () => {
    return (
        <Form.Item
            name="nearestStationRoute1"
            label="最寄駅路線１"
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
