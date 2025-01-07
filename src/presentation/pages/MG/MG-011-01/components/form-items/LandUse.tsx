import React from 'react';
import { Form, Input } from 'antd';

export const LandUse = () => {
    return (
        <Form.Item
            name="landUse"
            label="土地利用*"
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
