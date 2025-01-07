import React from 'react';
import { Form, Input } from 'antd';

export const FloodMap = () => {
    return (
        <Form.Item
            name="floodMap"
            label="ハザードマップ（洪水）*"
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
