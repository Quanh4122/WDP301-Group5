import React from 'react';
import { Button, Checkbox, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SortDownSvg from '../../../../../assets/icons/sort-down.svg';
import MoreOptionSvg from '../../../../../assets/icons/more-option.svg';
import { FormDrawer } from './FormDrawer';

const COLUMN_WIDTH_MG014: string[] = ['5%', '10%', '10%', '15%', '15%', '15%', '10%', '10%', '10%'];
const HEADERS: string[] = [
    '',
    'ユーザーID',
    '法人/個人',
    '氏名',
    'ニックネーム',
    '取引ステータス',
    '作成日',
    '更新日',
    '',
];

interface props {
    data: any[];
}

export const TableData = ({ data }: props) => {
    const GreenBadge = () => (
        <div
            className="tag-013 center-inside"
            style={{ backgroundColor: '#DEF6E8', color: '#01AA6D', width: 100 }}
        >
            取引中
        </div>
    );
    return (
        <section style={{ width: '100%' }} className="MG-014-01">
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
                            width: COLUMN_WIDTH_MG014[index],
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        key={header}
                    >
                        {index === 0 ? (
                            <Checkbox style={{ marginLeft: 12 }} />
                        ) : (
                            <>
                                <p style={{ marginRight: 8 }} className="header-table-font">
                                    {header}
                                </p>
                                {header !== '' && <img src={SortDownSvg} alt="" />}
                            </>
                        )}
                    </div>
                ))}
            </header>
            <section style={{ padding: 12 }}>
                {data.map((user, index) => (
                    <section className="record-row-container" key={user.id}>
                        <div style={{ width: COLUMN_WIDTH_MG014[0], paddingLeft: 12 }}>
                            <Checkbox />
                        </div>
                        <div style={{ width: COLUMN_WIDTH_MG014[1] }}>121211</div>
                        <div style={{ width: COLUMN_WIDTH_MG014[2] }}>法人</div>
                        <div style={{ width: COLUMN_WIDTH_MG014[3] }}>山田太郎</div>
                        <div style={{ width: COLUMN_WIDTH_MG014[4] }}>タロウ</div>
                        <div style={{ width: COLUMN_WIDTH_MG014[5] }}>
                            <GreenBadge />
                        </div>
                        <div style={{ width: COLUMN_WIDTH_MG014[6] }}>2023/12/12</div>
                        <div style={{ width: COLUMN_WIDTH_MG014[7] }}>2023/12/16</div>
                        <div
                            className="MG0013-container"
                            style={{
                                width: COLUMN_WIDTH_MG014[8],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <FormDrawer
                                submit={(value: any) => {
                                    console.log('haha');
                                }}
                            />
                        </div>
                    </section>
                ))}
            </section>
        </section>
    );
};
