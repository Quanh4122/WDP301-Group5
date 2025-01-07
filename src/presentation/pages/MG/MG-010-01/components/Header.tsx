import React from 'react';
import { Button, FormInstance } from 'antd';
import ArrowBackSvg from '../../../../../assets/icons/arrow-back.svg';
import DeleteSvg from '../../../../../assets/icons/edit.svg';
import EditSvg from '../../../../../assets/icons/delete.svg';

interface props {
    form: FormInstance<any>;
    onSearch: () => void;
}

export const HeaderSearchBar = ({ form }: props) => {
    return (
        <div
            className="dashboard-title-container"
            style={{ justifyContent: 'space-between', backgroundColor: '#fff' }}
        >
            <section style={{ display: 'flex', alignItems: 'center' }}>
                <div className="center-inside">
                    <img alt="" src={ArrowBackSvg} />
                    <span style={{ marginLeft: 8 }}>戻る</span>
                </div>
                <p className="dashboard-title" style={{ marginLeft: 16 }}>
                    物件詳細
                </p>
            </section>
            <section style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    size="large"
                    className="center-inside"
                    icon={<img alt="" src={DeleteSvg} />}
                    style={{ marginRight: 8 }}
                >
                    削除
                </Button>
                <Button size="large" className="center-inside" icon={<img alt="" src={EditSvg} />}>
                    編集
                </Button>
            </section>
        </div>
    );
};
