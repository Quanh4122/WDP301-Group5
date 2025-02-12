import { Button, Table } from "antd";
import React, { useEffect } from "react";
import { dataStudentType } from "../CONSTANTS";
import { BsFillPenFill, BsFillTrashFill, BsPlus } from "react-icons/bs"
import axios from "axios";

interface props {
    listName: string;
    listData?: dataStudentType[];
    columnsConfig: any[];
}

const TableData = ({ listName, listData, columnsConfig }: props) => {

    const [newColumnConfig, setNewColumnConfig] = React.useState(columnsConfig)

    const configAction = {
        title: 'Action',
        dataIndex: '',
        key: 'Action',
        render: (record: any) =>
            <span className="flex justify-between">
                <Button className="flex items-center justify-center border-none"> <BsFillTrashFill /></Button>
                <Button className="flex items-center justify-center border-none"><BsFillPenFill /></Button>
            </span>
    }

    useEffect(() => {
        setNewColumnConfig([...columnsConfig, configAction])
        console.log(columnsConfig)
    }, [])



    return (
        <div className="w-full h-auto" >
            <div>
                <h3 className="flex justify-center items-center text-xl text-sky-700 font-medium bg-slate-200 h-16">{listName}</h3>
                <div>
                    <Button><BsPlus /> ADD</Button>
                </div>
            </div>
            <div>
                <Table
                    dataSource={listData}
                    columns={newColumnConfig}
                    expandable={{
                        expandedRowRender: (record) =>
                            <div>
                                {
                                    record.enrollment?.map((item: any, index: number) => {
                                        return (
                                            <div key={index} className="flex items-center justify-between">
                                                <div>{item.id}</div>
                                                <div>{item.title}</div>
                                                <div>{item.description}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                    }}
                />
            </div>
        </div>
    )
}

export default TableData