import { useState } from 'react';
import { Form } from 'antd';
import NumericInputComponent from './NumericInput';
import React from 'react';

export const PhonenumberInputFormItem = () => {
    const [value, setValue] = useState<string>('');

    return (
        <Form.Item
            label="Phonenumber"
            name="phonenumber"
            rules={[{ required: true, message: 'Please input your phonenumber again!' }]}
        >
            <NumericInputComponent onChange={setValue} value={value} style={{}} />
        </Form.Item>
    );
};
