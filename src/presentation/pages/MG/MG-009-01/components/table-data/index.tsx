import React from 'react';
import { Button, Checkbox, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SortDownSvg from '../../../../../../assets/icons/sort-down.svg';
import MoreOptionSvg from '../../../../../../assets/icons/more-option.svg';
import { CollapseComponent } from '../../../../../components/common/CollapseComponent';
import { TableRow } from './TableRow';

export const COLUMN_WIDTH_MG002: string[] = [
    '4%',
    '6%',
    '10%',
    '20%',
    '15%',
    '15%',
    '10%',
    '10%',
    '10%',
];
const HEADERS: string[] = [
    '',
    '',
    '物件ID',
    '物件名',
    '所有権',
    '住所',
    '作成日時',
    '更新日時',
    '',
];

interface props {
    data: any[];
}

export const TableData = ({ data }: props) => {
    return (
        // <CollapseComponent />
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
                        key={index}
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
                    <TableRow user={user} key={index} />
                ))}
            </section>
        </section>
    );
};

export default TableData;
