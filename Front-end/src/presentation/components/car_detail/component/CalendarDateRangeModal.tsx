import { DatePicker, Modal } from "antd";
import React from "react";

interface props {
    isOpen: boolean;
    onCancel: () => void,
}

const CalendarDateRangeModal = ({ isOpen, onCancel }: props) => {
    const dateFormat = 'YYYY/MM/DD';
    return (
        <Modal
            title={<div className="flex items-center justify-center text-xl font-bold">Thời gian thuê</div>}
            open={isOpen}
            onCancel={onCancel}
            footer={<></>}
        >
            <DatePicker.RangePicker
                format={dateFormat}
            />
        </Modal>
    )
}

export default CalendarDateRangeModal