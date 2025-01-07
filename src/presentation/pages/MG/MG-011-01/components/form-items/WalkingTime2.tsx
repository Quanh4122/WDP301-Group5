import React from 'react';
import { Form, Input } from 'antd';

export const WalkingTime2 = () => {
    return (
        <Form.Item
            name="walkingTime2"
            label="最寄駅２からの徒歩所有時間"
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
