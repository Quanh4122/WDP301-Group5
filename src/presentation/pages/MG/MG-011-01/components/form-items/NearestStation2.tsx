import React from 'react';
import { Form, Input } from 'antd';

export const NearestStation2 = () => {
    return (
        <Form.Item
            name="nearestStation2"
            label="最寄駅２"
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
