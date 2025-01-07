import React from 'react';

import DeleteGrey from '../../../../../assets/icons/delete-grey.svg';
import PDFIcon from '../../../../../assets/icons/pdf-icon.svg';
import { Button } from 'antd';

interface props {
    name: string;
}

export const PamphletView = ({ name }: props) => {
    return (
        <section className="pamphlet-container">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img alt="" src={PDFIcon} />
                <span> {name}</span>
            </div>
            <Button className="center-inside" type="link" icon={<img alt="" src={DeleteGrey} />} />
        </section>
    );
};
