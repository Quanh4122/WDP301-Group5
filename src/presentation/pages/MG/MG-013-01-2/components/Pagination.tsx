import React from 'react';
import { Button, Pagination } from 'antd';

interface props {
    openForm: () => void;
    changePage: (value: number) => void;
    changeSize: (value: number) => void;
    onPaginationChange: (page: number, pageSize: number) => void;
}

export const PaginationComponent = ({
    openForm,
    changePage,
    changeSize,
    onPaginationChange,
}: props) => {
    return <Pagination onChange={onPaginationChange} simple defaultCurrent={2} total={100} />;
};
