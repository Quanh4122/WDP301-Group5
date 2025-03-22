import { Button, Modal, InputNumber } from "antd";
import React, { useState } from "react";

interface Props {
    isOpen: boolean;
    onCancel: () => void;
    onSubmit: (amount: number) => void; // Thay đổi để truyền số tiền
}

const ModalDeposit = ({ isOpen, onCancel, onSubmit }: Props) => {
    const [amount, setAmount] = useState<number | null>(null);

    const handleSubmit = () => {
        if (amount !== null) {
            onSubmit(amount);
            setAmount(null); // Reset giá trị sau khi submit
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onCancel}
            title="Nạp tiền" // Thêm tiêu đề cho modal
            footer={[
                <Button
                    key="submit"
                    type="primary" // Đổi sang type primary để nút nổi bật hơn
                    onClick={handleSubmit}
                    disabled={amount === null || amount <= 0} // Disable nếu không có giá trị hợp lệ
                >
                    Thanh toán
                </Button>,
                <Button
                    key="cancel"
                    onClick={onCancel}
                >
                    Hủy
                </Button>
            ]}
        >
            <div style={{ padding: '16px 0' }}>
                <label>Số tiền thanh toán (VNĐ):</label>
                <InputNumber
                    style={{ width: '100%', marginTop: 8 }}
                    min={0} // Giá trị tối thiểu là 0
                    value={amount}
                    onChange={(value) => setAmount(value)}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Format số với dấu phẩy
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any} // Parse giá trị khi nhập
                    placeholder="Nhập số tiền"
                />
            </div>
        </Modal>
    );
};

export default ModalDeposit;