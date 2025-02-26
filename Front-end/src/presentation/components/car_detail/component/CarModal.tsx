import { Modal } from "antd";
import React from "react";

interface props {
    isOpen: boolean;
    onCancel: () => void,
    element: string | JSX.Element | JSX.Element[],
    title: String;
}

const CarModal = ({ isOpen, onCancel, element, title }: props) => {
    return (
        <Modal
            title={<div className="flex items-center justify-center text-xl font-bold">{title}</div>}
            open={isOpen}
            onCancel={onCancel}
            width={750}
            centered
            footer={<></>}
        >
            {
                element
            }
        </Modal>
    )
}

export default CarModal