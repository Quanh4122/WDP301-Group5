import React from 'react';
import { Form, Upload } from 'antd';
import CloudUpload from '../../../../../../assets/icons/cloud-upload-2.svg';

export const Pamphlet = () => {
    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Form.Item
            name="パンフレット*"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
        >
            <Upload.Dragger name="pamphlet" action="/upload.do">
                <p className="ant-upload-drag-icon">
                    <img src={CloudUpload} alt="" />
                </p>
                <p className="ant-upload-text">クリック or ドロップしてファイルをアップロード</p>
                <p className="ant-upload-hint">最大ファイルサイズ2MB。</p>
            </Upload.Dragger>
        </Form.Item>
    );
};
