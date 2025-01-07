import React, { useState } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import PlusIcon from '../../../../../assets/icons/plus-icon.svg';
import XCircleFill from '../../../../../assets/icons/x-circle-fill.svg';
import { DrawerData } from '../entities/DrawerEntity';
import { Value } from 'sass';

const { Option } = Select;

const MOCK_DATA: DrawerData[] = [
    {
        id: 1,
        name: '会員ランク',
        value: 'テキストが入ります',
    },
    {
        id: 2,
        name: '会社名',
        value: 'テキストが入ります',
    },
    {
        id: 3,
        name: '住所',
        value: 'テキストが入ります',
    },
    {
        id: 4,
        name: '代表番号',
        value: 'テキストが入ります',
    },
    {
        id: 5,
        name: '宅建業免許番号',
        value: 'テキストが入ります',
    },
    {
        id: 6,
        name: '担当者連絡先',
        value: 'テキストが入ります',
    },
    {
        id: 7,
        name: '担当者メールアドレス',
        value: 'テキストが入ります',
    },
    {
        id: 8,
        name: '会社謄本',
        value: ['会社謄本.pdf'],
    },
    {
        id: 9,
        name: '反射確認',
        value: 'テキストが入ります',
    },
    {
        id: 10,
        name: '最終ログイン日',
        value: 'テキストが入ります',
    },
    {
        id: 11,
        name: 'ログイン失敗回数',
        value: 'テキストが入ります',
    },
];

const LABEL_COLUMN = 12;
const CONTENT_COLUMN = 12;

const NormalRow = (props: { name: string; value: any }) => (
    <>
        <Col span={LABEL_COLUMN}>
            <div className="MG-014-01-label MG-014-01-row-container">{props.name}</div>
        </Col>
        <Col span={CONTENT_COLUMN}>
            <div className="MG-014-01-content MG-014-01-row-container">{props.value}</div>
        </Col>
    </>
);

interface props {
    submit: (value: any) => Promise<void> | void;
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
            <Button size="large" type="primary" style={{ marginRight: 12 }} onClick={showDrawer}>
                詳細を開く
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
                <Row gutter={[24, 24]}>
                    {MOCK_DATA.map((element) => (
                        <NormalRow key={element.id} value={element.value} name={element.name} />
                    ))}

                    <Col span={LABEL_COLUMN}>
                        <div className="MG-014-01-label MG-014-01-row-container">会社名</div>
                    </Col>
                    <Col span={CONTENT_COLUMN}>
                        <div className="MG-014-01-content MG-014-01-row-container">
                            テキストが入ります
                        </div>
                    </Col>

                    <Col span={LABEL_COLUMN}>
                        <div className="MG-014-01-label MG-014-01-row-container">住所</div>
                    </Col>
                    <Col span={CONTENT_COLUMN}>
                        <div className="MG-014-01-content MG-014-01-row-container">
                            テキストが入ります
                        </div>
                    </Col>

                    <Col span={LABEL_COLUMN}>
                        <div className="MG-014-01-label MG-014-01-row-container">代表番号</div>
                    </Col>
                    <Col span={CONTENT_COLUMN}>
                        <div className="MG-014-01-content MG-014-01-row-container">
                            テキストが入ります
                        </div>
                    </Col>

                    <Col span={LABEL_COLUMN}>
                        <div className="MG-014-01-label MG-014-01-row-container">
                            宅建業免許番号
                        </div>
                    </Col>
                    <Col span={CONTENT_COLUMN}>
                        <div className="MG-014-01-content MG-014-01-row-container">
                            テキストが入ります
                        </div>
                    </Col>

                    <Col span={LABEL_COLUMN}>
                        <div className="MG-014-01-label MG-014-01-row-container">担当者連絡先</div>
                    </Col>
                    <Col span={CONTENT_COLUMN}>
                        <div className="MG-014-01-content MG-014-01-row-container">
                            テキストが入ります
                        </div>
                    </Col>

                    <Col span={LABEL_COLUMN}>
                        <div className="MG-014-01-label MG-014-01-row-container">
                            担当者メールアドレス
                        </div>
                    </Col>
                    <Col span={CONTENT_COLUMN}>
                        <div className="MG-014-01-content MG-014-01-row-container">
                            テキストが入ります
                        </div>
                    </Col>

                    <Col span={LABEL_COLUMN}>
                        <div className="MG-014-01-label MG-014-01-row-container">反射確認</div>
                    </Col>
                    <Col span={CONTENT_COLUMN}>
                        <div className="MG-014-01-content MG-014-01-row-container">
                            テキストが入ります
                        </div>
                    </Col>

                    <Col span={LABEL_COLUMN}>
                        <div className="MG-014-01-label MG-014-01-row-container">
                            最終ログイン日
                        </div>
                    </Col>
                    <Col span={CONTENT_COLUMN}>
                        <div className="MG-014-01-content MG-014-01-row-container">
                            テキストが入ります
                        </div>
                    </Col>

                    <Col span={LABEL_COLUMN}>
                        <div className="MG-014-01-label MG-014-01-row-container">
                            ログイン失敗回数
                        </div>
                    </Col>
                    <Col span={CONTENT_COLUMN}>
                        <div className="MG-014-01-content MG-014-01-row-container">
                            テキストが入ります
                        </div>
                    </Col>
                </Row>
            </Drawer>
        </>
    );
};
