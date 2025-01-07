import React from 'react';
import { Form, Input } from 'antd';

export const Structure = () => {
    return (
        <Form.Item
            name="structure"
            label="構造"
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
