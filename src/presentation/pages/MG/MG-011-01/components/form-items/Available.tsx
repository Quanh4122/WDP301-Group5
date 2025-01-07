import React from 'react';
import { Col, Form, Input, Radio, Row } from 'antd';

export const Available = () => {
    return (
        <Form.Item
            name="available"
            label="取り扱い可能"
            rules={[
                {
                    required: true,
                    message: 'required message',
                },
            ]}
        >
            <Radio.Group style={{ width: '100%' }}>
                <Row gutter={[8, 0]}>
                    <Col span={12}>
                        <div className="MG011-radio-container">
                            <Radio value="yes"> あり </Radio>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="MG011-radio-container">
                            <Radio value="no"> なし </Radio>
                        </div>
                    </Col>
                </Row>
            </Radio.Group>
        </Form.Item>
    );
};
