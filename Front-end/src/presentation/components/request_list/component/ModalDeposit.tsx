import { Button, Modal, InputNumber } from "antd";
import React, { useState, useEffect } from "react";

interface Props {
    isOpen: boolean;
    onCancel: () => void;
    onSubmit: (amount: number) => void;
    amoutDefault: number; // Sửa lỗi typo: "amoutDefault" thành "amountDefault" để thống nhất
}

const ModalDeposit = ({ isOpen, onCancel, onSubmit, amoutDefault }: Props) => {
    const [amount, setAmount] = useState<number>(amoutDefault);

    // Đồng bộ amount với amoutDefault khi prop thay đổi
    useEffect(() => {
        setAmount(amoutDefault);
    }, [amoutDefault]);

    const handleSubmit = () => {
        if (amount !== null && amount > 0) { // Kiểm tra amount hợp lệ
            onSubmit(amount);
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onCancel}
            title="Nạp tiền"
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={amount === null || amount <= 0}
                >
                    Thanh toán
                </Button>,
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
            ]}
        >
            <div style={{ padding: "16px 0" }}>
                <label>Số tiền đặt cọc (10% tổng bill) :</label>
                <InputNumber
                    style={{ width: "100%", marginTop: 8 }}
                    min={0}
                    value={amount}
                    onChange={(value) => setAmount(value ?? 0)} // Sử dụng ?? để xử lý null/undefined
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any} // Ép kiểu any vì parser trả về string
                    placeholder="Nhập số tiền"
                    readOnly // Giữ readOnly nếu bạn không muốn người dùng chỉnh sửa
                />
            </div>
        </Modal>
    );
};

export default ModalDeposit;