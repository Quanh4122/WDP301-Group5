import React from 'react';
import { Form, Input } from 'antd';

export const Location = () => {
    return (
        <Form.Item
            name="location"
            label="所在地"
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
