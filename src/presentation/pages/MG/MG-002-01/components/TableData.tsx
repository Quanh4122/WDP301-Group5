import React from 'react';
import { Button, Checkbox, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SortDownSvg from '../../../../../assets/icons/sort-down.svg';
import MoreOptionSvg from '../../../../../assets/icons/more-option.svg';

const COLUMN_WIDTH_MG002: string[] = ['5%', '10%', '15%', '15%', '15%', '15%', '15%', '6%', '4%'];
const HEADERS: string[] = [
    '',
    'ユーザーID',
    'ユーザー名',
    'ユーザー表示名',
    'メールアドレス',
    '所属会社',
    '権限',
    '無効フラグ',
    '',
];

interface props {
    data: any[];
}

export const TableData = ({ data }: props) => {
    return (
        <section style={{ width: '100%' }}>
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                    alignItems: 'center',
                    paddingLeft: 12,
                    paddingRight: 12,
                }}
            >
                {HEADERS.map((header, index) => (
                    <div
                        style={{
                            width: COLUMN_WIDTH_MG002[index],
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        key={header}
                    >
                        <p style={{ marginRight: 8 }} className="header-table-font">
                            {header}
                        </p>
                        {header !== '' && <img src={SortDownSvg} alt="" />}
                    </div>
                ))}
            </header>
            <section style={{ padding: 12 }}>
                {data.map((user, index) => (
                    <section className="record-row-container" key={user.id}>
                        <div style={{ width: COLUMN_WIDTH_MG002[0], paddingLeft: 12 }}>
                            <Checkbox />
                        </div>
                        <div style={{ width: COLUMN_WIDTH_MG002[1] }}>{user.id}</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[2] }}>{user.username}</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[3] }}>{user.displayName}</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[4] }}>{user.mail}</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[5] }}>{user.companyName}</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[6] }}>{user.authority}</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[7] }}>
                            <Switch />
                        </div>
                        <div
                            style={{
                                width: COLUMN_WIDTH_MG002[8],
                                display: 'flex',
                                justifyContent: 'flex-end',
                                paddingRight: 12,
                            }}
                        >
                            <Button type="link" icon={<img alt="" src={MoreOptionSvg} />} />
                        </div>
                    </section>
                ))}
            </section>
        </section>
    );
};
