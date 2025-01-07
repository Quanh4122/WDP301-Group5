import React from 'react';
import { Form, Input } from 'antd';

export const ConstructionCompany = () => {
    return (
        <Form.Item
            name="constructionCompany"
            label="施工会社"
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
