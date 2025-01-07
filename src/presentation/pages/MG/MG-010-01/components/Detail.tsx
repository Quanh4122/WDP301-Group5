import React from 'react';
import { Col, Row } from 'antd';
import { PamphletView } from './PamphletView';
export const Detail = () => {
    const SPAN_LEFT = 4;
    const SPAN_RIGHT = 20;

    const MOCK_DATA = [
        {
            label: '物件名',
            value: 'ニューキャッスル麻布十番',
            isLink: false,
        },
        {
            label: 'Googleマップの位置情報URL',
            value: 'https://www.googl.map',
            isLink: true,
        },
        {
            label: '所在地',
            value: '東京都港区麻布十番1-1-2',
            isLink: false,
        },
        {
            label: 'エリア',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '最寄駅路線１',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '最寄駅１',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '最寄駅１からの徒歩所有時間',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '最寄駅路線２',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '最寄駅２',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '最寄駅２からの徒歩所有時間',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '築年月日',
            value: '2002年12月12日',
            isLink: false,
        },
        {
            label: '構造',
            value: '鉄筋',
            isLink: false,
        },
        {
            label: '総戸数',
            value: '120戸',
            isLink: false,
        },
        {
            label: '不動産管理会社',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '分譲会社',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '施工会社',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '外観タイル有無',
            value: 'あり',
            isLink: false,
        },
        {
            label: 'オートロック有無',
            value: 'あり',
            isLink: false,
        },
        {
            label: 'エレベーター有無',
            value: 'あり',
            isLink: false,
        },
        {
            label: '調査未実施/実施済み',
            value: 'あり',
            isLink: false,
        },
        {
            label: '取り扱い可能',
            value: '不可',
            isLink: false,
        },
        {
            label: '取り扱い不可理由',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: '土地利用',
            value: 'テキストが入ります',
            isLink: false,
        },
        {
            label: 'ハザードマップ（雨）',
            value: 'https://www.googl.map',
            isLink: true,
        },
        {
            label: 'ハザードマップ（高潮）',
            value: 'https://www.googl.map',
            isLink: true,
        },
        {
            label: 'ハザードマップ（洪水）',
            value: 'https://www.googl.map',
            isLink: true,
        },
    ];

    return (
        <Row gutter={[24, 0]}>
            {MOCK_DATA.map((element, index) => {
                const content = element.isLink ? (
                    <div className="content-link column-container">
                        <a href={element.value}>{element.value}</a>
                    </div>
                ) : (
                    <div className="content column-container">{element.value}</div>
                );
                return (
                    <React.Fragment key={index}>
                        <Col span={SPAN_LEFT}>
                            <div className="label column-container">{element.label}</div>
                        </Col>
                        <Col span={SPAN_RIGHT}>{content}</Col>
                    </React.Fragment>
                );
            })}
            <Col span={SPAN_LEFT}>
                <div className="label column-container">パンフレット</div>
            </Col>
            <Col span={SPAN_RIGHT}>
                <PamphletView name="パンフレット.pdf" />
            </Col>
            {/* <Col span={SPAN_RIGHT + SPAN_LEFT}>
                <div style={{ height: 62 }}></div>
            </Col > */}
        </Row>
    );
};
