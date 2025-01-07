import React from 'react';
import { Form, FormInstance, Input } from 'antd';
import SearchIcon from './../../../assets/icons/search-bar-icon.svg'

interface props {
    form?: FormInstance<any>;
    onSearch?: () => void;
    placeholder?: string;
    width?: number;
    height?: number;
}

export const SearchBar = ({
    form,
    onSearch,
    width ,
    height,
    placeholder = 'ユーザー名で検索',
}: props) => {
    return (
        <Form form={form}>
            <Form.Item name="text" style={{ margin: 0, padding: 0 }}>
                <Input
                    style={{ width: width, height: height }}
                    size="large"
                    suffix={<img alt="" src={SearchIcon} />}
                    placeholder={placeholder}
                    onChange={onSearch}
                />
            </Form.Item>
        </Form>
    );
};
