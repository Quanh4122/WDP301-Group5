import React, { useState } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import PlusIcon from '../../../../../assets/icons/plus-icon.svg';
import XCircleFill from '../../../../../assets/icons/x-circle-fill.svg';

const { Option } = Select;

interface props {
    submit: (value: any) => Promise<void>;
}

export const FormDrawer = ({ submit }: props) => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                size="large"
                icon={<img src={PlusIcon} alt="" />}
                type="primary"
                onClick={showDrawer}
            >
                ユーザー登録
            </Button>
            <Drawer
                className="disappear-close"
                closeIcon={null}
                title={
                    <p style={{ padding: 0, margin: 0 }} className="drawer-title">
                        ユーザー登録
                    </p>
                }
                width={'44.5%'}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <div
                        onClick={onClose}
                        className="button-style"
                        style={{ height: '100%', display: 'flex', alignItems: 'center' }}
                    >
                        <img src={XCircleFill} alt="" />
                    </div>
                }
            >
                <Form layout="vertical" onFinish={submit}>
                    <Form.Item
                        name="username"
                        label={<div className="form-label">ユーザー名</div>}
                        rules={[{ required: true, message: 'Please enter user name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="displayName"
                        label={<div className="form-label">ユーザー表示名</div>}
                        rules={[{ required: true, message: 'Please enter user name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="mail"
                        label={<div className="form-label">メールアドレス</div>}
                        rules={[{ required: true, message: 'Please enter user name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="companyName"
                        label={<div className="form-label">所属会社</div>}
                        rules={[{ required: true, message: 'Please enter user name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="authority"
                        label={<div className="form-label">権限</div>}
                        rules={[{ required: true, message: 'Please choose the authority' }]}
                    >
                        <Select>
                            <Option value="1">Example 1</Option>
                            <Option value="2">Example 2</Option>
                        </Select>
                    </Form.Item>

                    <Button size="large" type="primary" htmlType="submit">
                        登録する
                    </Button>
                </Form>
            </Drawer>
        </>
    );
};
