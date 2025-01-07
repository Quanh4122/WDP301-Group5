import React from 'react';
import { Form, Input } from 'antd';

export const ReasonForNonHandling = () => {
    return (
        <Form.Item
            name="reasonForNonHandling"
            label="取り扱い不可理由*"
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
