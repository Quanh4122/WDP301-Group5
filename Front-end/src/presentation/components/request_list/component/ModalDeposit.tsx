import { Button, Modal, InputNumber } from "antd";
import React, { useState, useEffect } from "react";

interface Props {
    isOpen: boolean;
    onCancel: () => void;
    onSubmit: (amount: number) => void;
    amountDefault: number; // Đã sửa typo từ "amoutDefault" thành "amountDefault"
    maxAmonut?: number;    // Giữ nguyên tên prop, nhưng bạn có thể sửa thành "maxAmount" cho đúng chính tả
}

const ModalDeposit = ({ isOpen, onCancel, onSubmit, amountDefault, maxAmonut }: Props) => {
    const [amount, setAmount] = useState<number>(amountDefault);

    // Đồng bộ amount với amountDefault khi prop thay đổi
    useEffect(() => {
        setAmount(amountDefault);
    }, [amountDefault]);

    const handleSubmit = () => {
        if (amount !== null && amount >= amountDefault && (maxAmonut === undefined || amount <= maxAmonut)) {
            onSubmit(amount);
        }
    };

    const handleAmountChange = (value: number | null) => {
        // Nếu value là null hoặc undefined, đặt về amountDefault
        let newValue = value ?? amountDefault;

        // Giới hạn giá trị trong khoảng amountDefault và maxAmonut (nếu có)
        if (newValue < amountDefault) {
            newValue = amountDefault;
        }
        if (maxAmonut !== undefined && newValue > maxAmonut) {
            newValue = maxAmonut;
        }

        setAmount(newValue);
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
                    disabled={amount < amountDefault || (maxAmonut !== undefined && amount > maxAmonut)}
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
                    min={amountDefault}              // Giá trị tối thiểu là amountDefault
                    max={maxAmonut}                  // Giá trị tối đa là maxAmonut (nếu có)
                    value={amount}
                    onChange={handleAmountChange}    // Xử lý thay đổi giá trị
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="Nhập số tiền"
                // Bỏ readOnly để người dùng có thể nhập
                />
            </div>
        </Modal>
    );
};

export default ModalDeposit;