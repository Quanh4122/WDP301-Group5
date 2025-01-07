import React from 'react';
import { Form, Input } from 'antd';

export const PropertyName = () => {
    return (
        <Form.Item
            name="propertyName"
            label="物件名"
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
