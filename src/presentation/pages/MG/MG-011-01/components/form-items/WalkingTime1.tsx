import React from 'react';
import { Form, Input } from 'antd';

export const WalkingTime1 = () => {
    return (
        <Form.Item
            name="walkingTime1"
            label="最寄駅路１からの徒歩所有時間"
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
