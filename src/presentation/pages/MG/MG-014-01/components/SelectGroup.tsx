import { Form, Row, Select } from 'antd';
import React from 'react';

interface ChosenItem {
    userId?: string;
    corporate?: string;
    nickname?: string;
    familyName?: string;
    status?: string;
}

export interface ElementOptions {
    id: number | string;
    value: string;
    name: string;
}

interface props {
    userIdList: ElementOptions[];
    corporateList: ElementOptions[];
    nicknameList: ElementOptions[];
    familyNameList: ElementOptions[];
    statusList: ElementOptions[];
    chosenItem: ChosenItem;
}

export const SelectGroup = ({
    userIdList,
    corporateList,
    nicknameList,
    familyNameList,
    statusList,
    chosenItem,
}: props) => {
    const [form] = Form.useForm();

    const FILTERS = [
        {
            id: 1,
            name: 'ユーザーID',
            value: 'userId',
            options: userIdList,
        },
        {
            id: 2,
            name: '法人/個人',
            value: 'corporate',
            options: corporateList,
        },
        {
            id: 3,
            name: 'ニックネーム',
            value: 'nickname',
            options: nicknameList,
        },
        {
            id: 4,
            name: '氏名',
            value: 'familyName',
            options: familyNameList,
        },
        {
            id: 5,
            name: '取引ステータス',
            value: 'status',
            options: statusList,
        },
    ];

    return (
        <Form
            layout="vertical"
            style={{
                margin: 0,
                padding: '16px 0px',
                width: '100%',
                height: 88,
                borderBottom: '1px solid #CED4DA',
                display: 'flex',
            }}
            form={form}
        >
            {FILTERS.map((filter) => {
                return (
                    <div
                        style={{ width: '25%', paddingLeft: 16, paddingRight: 16 }}
                        key={filter.id}
                    >
                        <Form.Item
                            name={filter.value}
                            label={<div className="form-label">{filter.name}</div>}
                            rules={[{ required: true, message: '' }]}
                        >
                            <Select style={{ width: '100%' }}>
                                {filter.options.map((element) => (
                                    <Select.Option key={element.id} value={element.value}>
                                        {element.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                );
            })}
        </Form>
    );
};
