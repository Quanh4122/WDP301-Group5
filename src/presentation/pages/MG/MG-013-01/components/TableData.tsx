import React from 'react';
import { Button, Checkbox, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SortDownSvg from '../../../../../assets/icons/sort-down.svg';
import MoreOptionSvg from '../../../../../assets/icons/more-option.svg';

const COLUMN_WIDTH_MG002: string[] = ['5%', '10%', '20%', '15%', '15%', '15%', '25%'];
const HEADERS: string[] = ['', '', '物件名', '住所', '出品者', 'ステータス', ''];

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
                    <section className="record-row-container-013 mb-12" key={user.id}>
                        <div style={{ width: COLUMN_WIDTH_MG002[0], paddingLeft: 12 }}>
                            <Checkbox />
                        </div>
                        <div style={{ width: COLUMN_WIDTH_MG002[1] }}>
                            <div className="thumbnail-013"></div>
                        </div>
                        <div style={{ width: COLUMN_WIDTH_MG002[2] }}>ニューキャッスル麻布十番</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[3] }}>東京都港区</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[4] }}>山田太郎</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[5] }}>
                            <div
                                className="tag-013 center-inside"
                                style={{ backgroundColor: '#ED6C02' }}
                            >
                                未登録
                            </div>
                        </div>
                        <div
                            style={{
                                width: COLUMN_WIDTH_MG002[6],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button size="large" type="primary" style={{ marginRight: 8 }}>
                                物件を登録
                            </Button>
                            <Button size="large" type="primary" style={{ marginRight: 12 }}>
                                メッセージする
                            </Button>
                        </div>
                    </section>
                ))}
            </section>
        </section>
    );
};
