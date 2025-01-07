import React from 'react';
import { Button, Checkbox, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SortDownSvg from '../../../../../assets/icons/sort-down.svg';
import PlusSvg from '../../../../../assets/icons/plus-lv1.svg';
import MessageSvg from '../../../../../assets/icons/message-lv1.svg';

const COLUMN_WIDTH_MG002: string[] = ['10%', '20%', '15%', '15%', '15%', '5%', '25%'];
const HEADERS: string[] = ['', '物件名', '住所', '出品者', 'ステータス', '更新日時', ''];

interface props {
    data: any[];
}

export const TableData = ({ data }: props) => {
    const OrangeBadge = () => (
        <div
            className="tag-013 center-inside"
            style={{ backgroundColor: '#ED6C02', color: '#FFFFFF', width: 56 }}
        >
            未登録
        </div>
    );

    const GreenBadge = () => (
        <div
            className="tag-013 center-inside"
            style={{ backgroundColor: '#DEF6E8', color: '#01AA6D', width: 100 }}
        >
            登録済み
        </div>
    );

    const RedBadge = () => (
        <div
            className="tag-013 center-inside"
            style={{ backgroundColor: '#FAE7E9', color: '#97101D', width: 100 }}
        >
            未登録
        </div>
    );

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
                            <div className="thumbnail-013"></div>
                        </div>
                        <div style={{ width: COLUMN_WIDTH_MG002[1] }}>ニューキャッスル麻布十番</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[2] }}>東京都港区</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[3] }}>山田太郎</div>
                        <div style={{ width: COLUMN_WIDTH_MG002[4] }}>
                            {index % 2 === 0 ? <GreenBadge /> : <RedBadge />}
                        </div>
                        <div style={{ width: COLUMN_WIDTH_MG002[5] }}></div>

                        <div
                            className="MG0013-container"
                            style={{
                                width: COLUMN_WIDTH_MG002[6],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                className="center-inside"
                                icon={<img alt="" src={PlusSvg} />}
                                size="large"
                                type="primary"
                                style={{ marginRight: 8 }}
                            >
                                物件登録
                            </Button>
                            <Button
                                className="center-inside"
                                icon={<img alt="" src={MessageSvg} />}
                                size="large"
                                type="primary"
                                style={{ marginRight: 12 }}
                            >
                                メッセージ
                            </Button>
                        </div>
                    </section>
                ))}
            </section>
        </section>
    );
};
