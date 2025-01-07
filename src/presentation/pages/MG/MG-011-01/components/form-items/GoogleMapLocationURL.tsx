import React from 'react';
import { Form, Input } from 'antd';

export const GoogleMapLocationURL = () => {
    return (
        <Form.Item
            name="googleMapLocationURL"
            label="Googleマップの位置情報URL"
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
