import React from 'react';
import { Form, Input } from 'antd';

export const StormSurgeMap = () => {
    return (
        <Form.Item
            name="stormSurgeMap"
            label="ハザードマップ（高潮）*"
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
