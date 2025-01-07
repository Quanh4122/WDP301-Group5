import React from 'react';
import { Form, Input } from 'antd';

export const SalesCompany = () => {
    return (
        <Form.Item
            name="salesCompany"
            label="分譲会社"
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
