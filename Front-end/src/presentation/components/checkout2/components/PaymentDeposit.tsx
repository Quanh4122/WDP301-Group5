import React, { useEffect, useState } from "react";
import { RequestModelFull, RequestUserBookingToBill } from "../../checkout/models";
import CarItemPayment from "./CarItemPayment";
import { Button } from "antd";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Định nghĩa interface cho props
interface Props {
    dataPayment: RequestUserBookingToBill | undefined;
    dataRequest: RequestModelFull;
    handleNext: () => void,
}

const PaymentDeposit: React.FC<Props> = ({ dataPayment, dataRequest, handleNext }) => {
    const depositFee: number = 500000;
    const mortgateFee: number = 3000000;
    const [totalFee, setTotalFee] = useState<number>(0);
    const [VATFee, setVATFee] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate()

    useEffect(() => {
        setTotalFee((dataPayment?.billData.totalCarFee || 0) + (dataPayment?.billData.vatFee || 0) + mortgateFee);
        setVATFee(dataPayment?.billData.vatFee || 0);
    }, [dataPayment]);

    const displayMoney = (value: number): string => {
        return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        await axiosInstance
            .post("/bill/userBookingBill", dataPayment)
            .then((res) => {
                setTimeout(() => {
                    setIsLoading(false);
                    handleNext()
                }, 2000)
            })
            .catch((err) => {
                console.log(err.response.data.message)
                toast.error(err.response.data.message + " !!!");
            });
    };

    return (
        <div className="flex justify-between">
            <div className="w-1/2 bg-white">
                <h5>Thanh toán phí giữ chỗ {displayMoney(depositFee)}</h5>
                <p>Vui lòng quét mã QRCode hoặc chụp ảnh màn hình QRCode để thanh toán bằng ứng dụng ngân hàng</p>
                <div>
                    ảnh qr
                </div>
            </div>
            <div className="w-1/2">
                <div className="bg-white border-b-2 border-sky-500">
                    <div><h4>Thông tin đơn thuê</h4></div>
                    <div className="py-4">
                        <div className="flex justify-between">
                            <p>Email: </p><span>{dataPayment?.request.emailRequest}</span>
                        </div>
                        <div className="flex justify-between border-b-2 border-gray-300">
                            <p>Số điện thoại: </p><span>{dataRequest?.user?.phoneNumber}</span>
                        </div>
                        <div>
                            {dataRequest.car && dataRequest.car.map((ele, inx) => (
                                <CarItemPayment
                                    carData={ele}
                                    key={inx}
                                    small={true}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-white">
                    <div>
                        <div>
                            <h4>Các bước thanh toán</h4>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="w-1/12">
                                    <div className="w-6 h-6 rounded-full bg-sky-600 text-gray-100 flex items-center justify-center font-semibold">1</div>
                                </div>
                                <div className="flex w-full justify-between">
                                    <div>
                                        <h6>Thanh toán giữ chỗ</h6>
                                        <p className="text-xs">Tiền này để xác nhận đơn thuê và giữ xe, sẽ được trừ vào tiền thế chấp khi nhận xe</p>
                                    </div>
                                    <div>{displayMoney(depositFee)}</div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between">
                                    <div className="w-1/12">
                                        <div className="w-6 h-6 rounded-full bg-sky-600 text-gray-100 flex items-center justify-center font-semibold">2</div>
                                    </div>
                                    <div className="w-11/12">
                                        <div className="flex w-full justify-between">
                                            <h6>Thanh toán khi nhận xe</h6>
                                            <div>{displayMoney(totalFee)}</div>
                                        </div>
                                        <div className="flex w-full justify-between">
                                            <h6>Tiền thuê</h6>
                                            <div>{displayMoney(totalFee - mortgateFee)}</div>
                                        </div>
                                        <div className="flex w-full justify-between">
                                            <div>
                                                <h6>Tiền thế chấp</h6>
                                                <p>Sẽ hoàn lại sau khi trả xe</p>
                                            </div>
                                            <div>{displayMoney(mortgateFee)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-auto">
                    <Button
                        className="w-full h-14"
                        type="primary"
                        loading={isLoading}
                        onClick={handleConfirm}
                    >
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentDeposit;