import React from 'react';
import { Form, Input } from 'antd';

export const Area = () => {
    return (
        <Form.Item
            name="area"
            label="エリア"
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
