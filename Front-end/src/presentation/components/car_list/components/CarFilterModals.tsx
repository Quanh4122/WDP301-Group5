import { Checkbox, Modal } from "antd";
import React from "react";

interface props {
    title: string,
    option: any[],
    onSetListData?: (list: string[]) => void,
    isOpen: boolean;
    onCancel: () => void,
}

const CarFilterModals = ({ title, option, onSetListData, onCancel, isOpen }: props) => {

    return (
        <Modal
            title={<div className="flex items-center justify-center text-xl font-bold text-sky-500 border-b-2 border-gray-300 h-14">{title}</div>}
            open={isOpen}
            onCancel={onCancel}
            footer={<></>}
        >
            <div className="w-full flex flex-wrap items-center justify-center my-4">
                <Checkbox.Group
                    options={option}
                    onChange={onSetListData}
                    className="font-bold"
                />
            </div>
        </Modal>
    )
}

export default CarFilterModals