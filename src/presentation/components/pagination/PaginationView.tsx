import { Button, Input, InputNumber } from 'antd';
import React from 'react';

import SingleLeftDisabledSvg from '../../../assets/icons/single-left-disabled.svg';
import SingleLeftSvg from '../../../assets/icons/single-left.svg';
import SingleRightDisabledSvg from '../../../assets/icons/single-right-disabled.svg';
import SingleRightSvg from '../../../assets/icons/single-right.svg';

import DoubleLeftDisabledSvg from '../../../assets/icons/double-left-disabled.svg';
import DoubleLeftSvg from '../../../assets/icons/double-left.svg';
import DoubleRightDisabledSvg from '../../../assets/icons/double-right-disabled.svg';
import DoubleRightSvg from '../../../assets/icons/double-right.svg';

export const PaginationView = () => {
    return (
        <section className="center-inside pagination-component" style={{ height: '100%' }}>
            <div className="button-style center-inside">
                <img src={DoubleLeftDisabledSvg} />
            </div>
            <div className="button-style center-inside" style={{ marginLeft: 8 }}>
                <img src={SingleLeftDisabledSvg} alt="" />
            </div>

            <div className="button-style center-inside">
                {' '}
                <img src={DoubleLeftSvg} alt="" />
            </div>
            <div className="button-style center-inside" style={{ marginLeft: 8 }}>
                {' '}
                <img src={SingleLeftSvg} alt="" />
            </div>

            <div className="center-inside" style={{ marginLeft: 8, marginRight: 8 }}>
                <InputNumber controls={false} />
                <div style={{ marginLeft: 8 }}>/ 12ページ</div>
            </div>

            <div className="button-style center-inside" style={{ marginRight: 8 }}>
                <img src={SingleRightSvg} alt="" />
            </div>
            <div className="button-style center-inside">
                <img src={DoubleRightSvg} alt="" />
            </div>

            <div className="button-style center-inside" style={{ marginRight: 8 }}>
                <img src={SingleRightDisabledSvg} alt="" />
            </div>
            <div className="button-style center-inside">
                <img src={DoubleRightDisabledSvg} alt="" />
            </div>
        </section>
    );
};
