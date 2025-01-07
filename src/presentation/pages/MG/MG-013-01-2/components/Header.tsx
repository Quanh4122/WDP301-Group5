import React from 'react';
import { FormInstance } from 'antd';
import { SearchBar } from '../../../../components/common/SearchBar';

interface props {
    form: FormInstance<any>;
    onSearch: () => void;
}

export const HeaderSearchBar = ({ form, onSearch }: props) => {
    return (
        <div
            className="dashboard-title-container"
            style={{ justifyContent: 'space-between', backgroundColor: '#fff' }}
        >
            <p className="dashboard-title">問い合わせ物件一覧</p>
            <SearchBar form={form} onSearch={onSearch} placeholder="物件IDもしくは物件名で検索" />
        </div>
    );
};
