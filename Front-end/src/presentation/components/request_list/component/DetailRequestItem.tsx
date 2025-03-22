import { Modal, Descriptions } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { RequestModelFull } from "../../checkout/models";
import dayjs from "dayjs";
import { BillModal } from "../../list_request_admin/Modals";
import axiosInstance from "../../utils/axios";

interface Props {
    isOpen: boolean;
    onCancel: () => void;
    title?: string;
    detailRequest: RequestModelFull;
}

const DetailRequestItem = ({ isOpen, onCancel, title, detailRequest }: Props) => {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const formattedCurrency = (amount?: number | null): string => {
        if (amount === null) return "N/A";
        return (amount || 0 * 1000).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    };

    const [billData, setBillData] = useState<BillModal>()
    useEffect(() => {
        getBillByRequestId(detailRequest._id)
    }, [])

    const getBillByRequestId = async (id: string) => {
        axiosInstance.get("/bill/getBillByReuqestId", {
            params: {
                key: id
            }
        })
            .then(res => {
                setBillData(res.data.bill)
                console.log(res.data)
            })
            .catch(err => console.log(err))
    }

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
                        <Descriptions.Item label="Ngày trả ">
                            <span className="font-semibold">{dayjs(billData?.realTimeDrop).format("HH:mm DD/MM/YYYY") ?? dayjs(billData?.request.endDate).format("HH:mm DD/MM/YYYY")}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thuế VAT">
                            <span className="font-semibold">{formattedCurrency(billData?.vatFee)}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số tiền thuê xe">
                            <span className="font-semibold text-lg">{formattedCurrency(billData?.totalCarFee)}</span>
                        </Descriptions.Item>
                        {
                            billData?.depositFee &&
                            <Descriptions.Item label="Số tiền phạt">
                                <span className="font-semibold text-lg">{formattedCurrency(billData?.depositFee)}</span>
                            </Descriptions.Item>
                        }
                        {
                            billData?.totalCarFee && billData?.vatFee && billData?.depositFee &&
                            <Descriptions.Item label="Tổng số tiền cần thanh toán : ">
                                <span className="font-semibold text-lg">{formattedCurrency((billData?.totalCarFee || 0) + (billData?.vatFee || 0) + (billData?.depositFee || 0))}</span>
                            </Descriptions.Item>
                        }

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