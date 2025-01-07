import React from 'react';
import { Form, Input } from 'antd';

export const LandLeaseRemark = () => {
    return (
        <Form.Item
            name="landLeaseRemark"
            label="借地権備考*"
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
