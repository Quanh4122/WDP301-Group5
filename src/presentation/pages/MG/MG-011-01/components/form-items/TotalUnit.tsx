import React from 'react';
import { Form, Input } from 'antd';

export const TotalUnit = () => {
    return (
        <Form.Item
            name="totalUnit"
            label="総戸数"
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
