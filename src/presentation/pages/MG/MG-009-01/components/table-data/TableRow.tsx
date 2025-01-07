import React from 'react';
import { useCollapse } from 'react-collapsed';
import { Button, Checkbox, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import CollapsedTrueSvg from '../../../../../../assets/icons/collapsed-true.svg';
import CollapsedFalseSvg from '../../../../../../assets/icons/collapsed-false.svg';
import { COLUMN_WIDTH_MG002 } from '.';

interface props {
    user: any;
}

export const TableRow = ({ user }: props) => {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

    const MOCK_DATA_COLUMN_1 = [
        {
            name: '最寄駅１',
            value: '都営大江戸線六本木駅',
        },
        {
            name: '最寄駅２',
            value: '都営大江戸線六本木駅',
        },
        {
            name: '新築年数',
            value: '4年',
        },
        {
            name: '占有面積',
            value: '40m2',
        },
        {
            name: '構造',
            value: '鉄筋',
        },
        {
            name: '総戸数',
            value: '40戸',
        },
        {
            name: '階数',
            value: '5階',
        },
    ];
    const MOCK_DATA_COLUMN_2 = [
        {
            name: 'エレベータ有無',
            value: 'あり',
        },
        {
            name: 'オートロック有無',
            value: 'あり',
        },
        {
            name: '外観タイル有無',
            value: 'あり',
        },
        {
            name: '宅配ボックス有無',
            value: 'あり',
        },
    ];
    const MOCK_DATA_COLUMN_3 = [
        {
            name: 'パンフレット',
            value: 'パンフレット.pdf',
        },
        {
            name: '不動産管理会社',
            value: '株式会社＊＊＊＊＊',
        },
        {
            name: '分譲会社',
            value: '株式会社＊＊＊＊＊',
        },
        {
            name: '施工会社',
            value: '株式会社＊＊＊＊＊',
        },
        {
            name: '調査フラグ',
            value: '＊＊＊＊＊',
        },
        {
            name: 'エリア係数',
            value: '＊＊＊＊＊',
        },
        {
            name: '最高評価額',
            value: '2,480万円',
        },
    ];
    return (
        <div className="collapsible mb-12">
            <div className="header" {...getToggleProps()}>
                <section className="record-row-container-013" key={user.id}>
                    <div style={{ width: COLUMN_WIDTH_MG002[0], paddingLeft: 12 }}>
                        {isExpanded ? (
                            <img alt="" src={CollapsedTrueSvg} />
                        ) : (
                            <img alt="" src={CollapsedFalseSvg} />
                        )}
                    </div>
                    <div style={{ width: COLUMN_WIDTH_MG002[1] }}>
                        <div className="thumbnail-013"></div>
                    </div>
                    <div style={{ width: COLUMN_WIDTH_MG002[2] }}>121211</div>
                    <div style={{ width: COLUMN_WIDTH_MG002[3] }}>ニューキャッスル麻布十番</div>
                    <div style={{ width: COLUMN_WIDTH_MG002[4] }}>2023-01-18</div>
                    <div style={{ width: COLUMN_WIDTH_MG002[5] }}>東京都港区</div>
                    <div style={{ width: COLUMN_WIDTH_MG002[6] }}>2023/12/12 12:24</div>
                    <div style={{ width: COLUMN_WIDTH_MG002[7] }}>2023/12/12 12:24</div>
                    <div
                        className="MG0013-container"
                        style={{
                            width: COLUMN_WIDTH_MG002[8],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button size="large" type="primary" style={{ marginRight: 12 }}>
                            詳細を開く
                        </Button>
                    </div>
                </section>
            </div>
            <div {...getCollapseProps()}>
                <div className="content" style={{ display: 'flex' }}>
                    <section style={{ minHeight: 228, width: '33.3%', padding: '24px 32px' }}>
                        {MOCK_DATA_COLUMN_1.map((element, index) => (
                            <div key={'1' + index} style={{ display: 'flex', marginTop: 16 }}>
                                <span className="collapse-label">{element.name}</span>
                                <span className="collapse-content">{element.value}</span>
                            </div>
                        ))}
                    </section>
                    <section style={{ minHeight: 228, width: '33.3%', padding: '24px 32px' }}>
                        {MOCK_DATA_COLUMN_2.map((element, index) => (
                            <div key={'2' + index} style={{ display: 'flex', marginTop: 16 }}>
                                <span className="collapse-label">{element.name}</span>
                                <span className="collapse-content">{element.value}</span>
                            </div>
                        ))}
                    </section>
                    <section style={{ minHeight: 228, width: '33.3%', padding: '24px 32px' }}>
                        {MOCK_DATA_COLUMN_3.map((element, index) => (
                            <div key={'3' + index} style={{ display: 'flex', marginTop: 16 }}>
                                <span className="collapse-label">{element.name}</span>
                                <span
                                    className={`${
                                        element.name === 'パンフレット'
                                            ? 'collapse-content-file'
                                            : 'collapse-content'
                                    }`}
                                >
                                    {element.value}
                                </span>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};
