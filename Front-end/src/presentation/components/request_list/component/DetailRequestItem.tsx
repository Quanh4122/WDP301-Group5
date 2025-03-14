import { Box, Divider, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import SitemarkIcon from "../../checkout/components/SitemarkIcon";
import dayjs from "dayjs";

interface Props {
    isOpen: boolean;
    onCancel: () => void;
    title?: string; // Changed String to string (lowercase 's' for TypeScript)
    detailRequest: RequestModelFull;
}

const DetailRequestItem = ({ isOpen, onCancel, title, detailRequest }: Props) => {
    const [totalTime, setTotalTime] = useState<number | null>(null);
    const [VATFee, setVATFee] = useState<number | null>(null);
    const [totalFee, setTotalFee] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    useEffect(() => {
        calculateTotalTimeBooking();
        console.log(detailRequest);
    }, [detailRequest]); // Added detailRequest as a dependency to recalculate if it changes

    const calculateTotalTimeBooking = () => {
        const start = dayjs(detailRequest.startDate);
        const end = dayjs(detailRequest.endDate);
        const total = end.diff(start, 'hour', true); // Total hours, including decimals
        setStartDate(start.format("HH:mm, DD/MM/YYYY"));
        setEndDate(end.format("HH:mm, DD/MM/YYYY"));
        setTotalTime(total);

        // Handle the case where detailRequest.car might be empty or undefined
        const carPrices = detailRequest?.car?.map(item => item.price) || [];
        const arrprice = carPrices.reduce((total, current) => total + current, 0); // Added initial value 0
        const calVATFee = arrprice * total * 0.1; // 10% VAT
        setVATFee(calVATFee);
        setTotalFee(calVATFee + arrprice * total);
    };

    return (
        <Modal
            title={<div className="flex items-center justify-center text-2xl font-semibold">
                {title}
            </div>}
            open={isOpen}
            onCancel={onCancel}
            centered
            footer={null} // Loại bỏ footer mặc định
        >
            <div className="flex justify-center">
                <div className="w-full max-w-lg p-6">
                    <ul className="space-y-2">
                        <li className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700">Ngày nhận</span>
                            <span className="font-semibold">{startDate || "N/A"}</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700">Ngày trả</span>
                            <span className="font-semibold">{endDate || "N/A"}</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700">Thuế VAT</span>
                            <span className="font-semibold">
                                {VATFee !== null
                                    ? (VATFee * 1000).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })
                                    : "N/A"}
                            </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                            <span className="text-gray-700 font-semibold">Total</span>
                            <span className="font-semibold text-lg">
                                {totalFee !== null
                                    ? (totalFee * 1000).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })
                                    : "N/A"}
                            </span>
                        </li>
                    </ul>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Thông tin của bạn</h3>
                            <p>Họ và tên: <span className="text-gray-500">{detailRequest.user?.userName || "N/A"}</span></p>
                            <p>Email: <span className="text-gray-500">{detailRequest.user?.email || "N/A"}</span></p>
                            <p>Số điện thoại: <span className="text-gray-500">{detailRequest.user?.phoneNumber || "N/A"}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DetailRequestItem;