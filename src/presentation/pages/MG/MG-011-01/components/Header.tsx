import React from 'react';
import { Button, FormInstance } from 'antd';
import { SearchBar } from '../../../../components/common/SearchBar';
import ArrowBackSvg from '../../../../../assets/icons/arrow-back.svg';
import DownloadSvg from '../../../../../assets/icons/download-icon.svg';

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
                    物件編集
                </p>
            </section>
            <section style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="large" style={{ marginRight: 8 }}>
                    下書き保存
                </Button>
                <Button
                    size="large"
                    className="center-inside"
                    icon={<img alt="" src={DownloadSvg} />}
                    type="primary"
                >
                    保存
                </Button>
            </section>
        </div>
    );
};
