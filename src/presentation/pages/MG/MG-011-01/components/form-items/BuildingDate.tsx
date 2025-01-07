import React from 'react';
import { Form, Input } from 'antd';

export const BuildingDate = () => {
    return (
        <Form.Item
            name="buildingDate"
            label="築年月日"
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
