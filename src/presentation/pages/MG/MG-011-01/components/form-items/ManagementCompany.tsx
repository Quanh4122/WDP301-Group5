import React from 'react';
import { Form, Input } from 'antd';

export const ManagementCompany = () => {
    return (
        <Form.Item
            name="managementCompany"
            label="不動産管理会社"
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
