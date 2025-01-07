import React from 'react';
import { Form, Input } from 'antd';

export const RainMap = () => {
    return (
        <Form.Item
            name="rainMap"
            label="ハザードマップ（雨）*"
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
