import { Modal } from "antd";
import React from "react";

interface props {
    isOpen: boolean;
    onCancel: () => void,
}

const ModalDriverSelect = ({ isOpen, onCancel }: props) => {
    return (
        <Modal
            title={<div className="flex items-center justify-center text-xl font-bold">Danh sách tài xế rảnh</div>}
            open={isOpen}
            onCancel={onCancel}
            width={750}
            centered
            footer={<></>}
        >
            <div>
                chọn tài
            </div>
        </Modal>
    )
}

export default ModalDriverSelect