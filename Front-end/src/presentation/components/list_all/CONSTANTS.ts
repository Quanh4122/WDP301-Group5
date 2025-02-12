import { Table, TableColumnsType } from "antd";

export interface dataStudentType {
    id: number,
    name: string,
    email: string,
    enrollment : dataCourseType[]
}

export interface dataCategory {
    id: number,
    label: string,
    image: string,
}

export interface dataProduct {
    id: number,
    categoryId : number,
    name: string,
    price: number,
    size: number[],
    images: string[]

}

export interface dataBill {
    id: number | undefined,
     name: string | undefined,
    price: number | undefined,
    size: number | undefined,
    quantityProduct: number | undefined,
    image: string[] | undefined,
}

export const columnsStudent: TableColumnsType<dataStudentType> = [
    Table.EXPAND_COLUMN,
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
    },
]

interface dataCourseType {
    id: number,
    title: string,
    description: string,
}

const columnsCourse: TableColumnsType<dataCourseType> = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: 'title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
    },
]