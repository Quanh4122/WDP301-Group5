import React, { useEffect, useState } from "react";
import { Card, Descriptions, Button, Divider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // Để định dạng ngày giờ
import axiosInstance from "../../utils/axios";
import { BillModal } from "../../list_request_admin/Modals";
import { toast } from "react-toastify";


const BillDetail: React.FC<{ bill?: BillModal }> = ({ bill }) => {

    const navigate = useNavigate();
    // Hàm xử lý khi nhấn nút Submit
    const handleSubmit = async () => {
        console.log("Submitted bill:", bill);
        const data = {
            billId: bill?._id,
            requestId: bill?.request._id
        }
        await axiosInstance.put("/bill/userAcceptPayment", data)
            .then(res => {
                toast.success("Thanh toán thành công !!!")
                setTimeout(() => navigate("/"), 2000);
            })
            .catch(err => toast.error("Thanh toán thất bại !!!"))
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card
                title={<h2 className="text-2xl font-bold text-center text-blue-600">Hóa đơn thanh toán</h2>}
                className="w-full max-w-2xl shadow-lg rounded-lg"
                bordered={false}
            >
                {/* Thông tin hóa đơn */}
                <Descriptions column={1} bordered className="mb-6">
                    {/* <Descriptions.Item label={<span className="font-semibold">Mã yêu cầu</span>}>
                        {bill.request}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="font-semibold">Trạng thái hóa đơn</span>}>
                        <span className={bill.billStatus ? "text-green-500" : "text-red-500"}>
                            {bill.billStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                    </Descriptions.Item> */}
                    <Descriptions.Item label={<span className="font-semibold">Thuế VAT</span>}>
                        {bill?.vatFee ? `${bill.vatFee.toLocaleString("vi-VN")} VND` : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="font-semibold">Tổng tiền thuê xe</span>}>
                        {bill?.totalCarFee ? `${bill.totalCarFee.toLocaleString("vi-VN")} VND` : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="font-semibold">Tiền cọc</span>}>
                        {bill?.depositFee ? `${bill.depositFee.toLocaleString("vi-VN")} VND` : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="font-semibold">Thời gian trả xe thực tế</span>}>
                        {bill?.realTimeDrop ? dayjs(bill.realTimeDrop).format("HH:mm, DD/MM/YYYY") : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="font-semibold">Địa điểm trả xe thực tế</span>}>
                        {bill?.realLocationDrop || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="font-semibold">Hình ảnh thực tế</span>}>
                        {bill?.realImage ? (
                            <img src={`http://localhost:3030${bill.realImage}`} alt="Real drop image" className="w-32 h-32 object-cover rounded" />
                        ) : (
                            "N/A"
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="font-semibold">Phí phạt</span>}>
                        {bill?.penaltyFee ? `${bill.penaltyFee.toLocaleString("vi-VN")} VND` : "N/A"}
                    </Descriptions.Item>
                </Descriptions>

                {/* Tổng tiền */}
                <div className="text-right mb-6">
                    <Divider />
                    <p className="text-lg font-semibold">
                        Tổng tiền cần thanh toán:{" "}
                        <span className="text-blue-600">
                            {((bill?.vatFee || 0) + (bill?.totalCarFee || 0) + (bill?.penaltyFee || 0)).toLocaleString("vi-VN")} VND
                        </span>
                    </p>
                </div>

                {/* Nút Submit */}
                <div className="flex justify-center">
                    <Button
                        type="primary"
                        size="large"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// Ví dụ sử dụng component với dữ liệu tĩnh
const BillDetailPage: React.FC = () => {
    // const sampleBill: BillData = {
    //     request: "507f1f77bcf86cd799439011",
    //     billStatus: false,
    //     vatFee: 100000,
    //     totalCarFee: 1000000,
    //     depositFee: 200000,
    //     realTimeDrop: new Date("2025-03-22T14:00:00"),
    //     realLocationDrop: "123 Đường Láng, Hà Nội",
    //     realImage: "https://via.placeholder.com/150",
    //     penaltyFee: 50000,
    // };

    const location = useLocation()
    const [billValue, setBillvalue] = useState<BillModal>()

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const billId = queryParams.get('billId');
        console.log(billId)
        getBillData(billId)
    }, [location.search]);

    const getBillData = async (billId: any) => {
        await axiosInstance.get('/bill/getBillById', {
            params: {
                key: billId
            }
        })
            .then(res => setBillvalue(res.data))
            .catch(err => console.log(err))
    }


    return <BillDetail bill={billValue} />;
};

export default BillDetailPage;