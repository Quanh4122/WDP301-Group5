import React from 'react';
import { Form, Input } from 'antd';

export const NearestStation1 = () => {
    return (
        <Form.Item
            name="nearestStation1"
            label="最寄駅１*"
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
