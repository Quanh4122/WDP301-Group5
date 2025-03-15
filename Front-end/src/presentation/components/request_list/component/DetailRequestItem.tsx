import { Modal, Descriptions } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import dayjs from "dayjs";

interface Props {
    isOpen: boolean;
    onCancel: () => void;
    title?: string;
    detailRequest: RequestModelFull;
}

const DetailRequestItem = ({ isOpen, onCancel, title, detailRequest }: Props) => {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const formattedCurrency = (amount: number | null): string => {
        if (amount === null) return "N/A";
        return (amount * 1000).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    };

    const calculation = useMemo(() => {
        const start = dayjs(detailRequest.startDate);
        const end = dayjs(detailRequest.endDate);
        const totalHours = end.diff(start, 'hour', true);
        setStartDate(start.format("HH:mm, DD/MM/YYYY"));
        setEndDate(end.format("HH:mm, DD/MM/YYYY"));

        const carPrices = detailRequest?.car?.map(item => item.price) ?? [];
        const totalPrice = carPrices.reduce((total, current) => total + current, 0);
        const vatFee = totalPrice * totalHours * 0.1;
        const totalFee = vatFee + totalPrice * totalHours;

        return { vatFee, totalFee };
    }, [detailRequest]);

    return (
        <Modal
            title={<div className="flex items-center justify-center text-2xl font-semibold">{title}</div>}
            open={isOpen}
            onCancel={onCancel}
            centered
            footer={null}
        >
            <div className="flex justify-center">
                <div className="w-full max-w-lg p-6">
                    <Descriptions column={1} bordered size="small" className="mb-4">
                        <Descriptions.Item label="Ngày nhận">
                            <span className="font-semibold">{startDate ?? "N/A"}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày trả">
                            <span className="font-semibold">{endDate ?? "N/A"}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thuế VAT">
                            <span className="font-semibold">{formattedCurrency(calculation.vatFee)}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Total">
                            <span className="font-semibold text-lg">{formattedCurrency(calculation.totalFee)}</span>
                        </Descriptions.Item>
                    </Descriptions>

                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Họ và tên">
                                <span className="text-gray-500">{detailRequest.user?.userName ?? "N/A"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                <span className="text-gray-500">{detailRequest.user?.email ?? "N/A"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                <span className="text-gray-500">{detailRequest.user?.phoneNumber ?? "N/A"}</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DetailRequestItem;