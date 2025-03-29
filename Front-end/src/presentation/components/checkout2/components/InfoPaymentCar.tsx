import { Button, Form, Input, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddressSearch from "../../request_list/component/AddressSearch";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CarModal from "../../car_detail/component/CarModal";
import CarCalendar from "../../car_detail/component/CarCalendar";
import { RequestModelFull, RequestUserBookingToBill } from "../../checkout/models";
import CarItemPayment from "./CarItemPayment";
import { useForm } from "antd/es/form/Form";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";

interface props {
    requestData: RequestModelFull,
    handleNext: () => void,
    handleGetData: (value: RequestUserBookingToBill, requestNew: RequestModelFull) => void
}

const InforPaymentCar = ({ requestData, handleNext, handleGetData }: props) => {

    const [requestVal, setRequestVal] = useState<RequestModelFull>(requestData);
    const [pickUpLocation, setPickUpLocation] = useState<string>("");
    const [dropLocation, setDropLocation] = useState<string>("");
    const [isOpenModalN, setIsOpenModalN] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false); // Trạng thái hợp lệ của form
    const [form] = useForm()
    const [dataCheck, setDataCheck] = useState<{ isExisted: boolean; duplicateCar: string[] } | undefined>()

    const [dateValue, setDateValue] = useState<string[]>([
        dayjs().format("DD/MM/YYYY"),
        dayjs().add(1, "day").format("DD/MM/YYYY"),
    ]);

    const [timeValue, setTimeValue] = useState<string[]>([
        `${dayjs().add(2, 'hour').hour()}:00`,
        `${dayjs().hour()}:00`,
    ]);
    const depositFee = 500000
    const mortgateFee = 3000000
    const initialValue = {
        email: requestData?.user?.email,
        phoneNumber: requestData?.user?.phoneNumber,
    };

    const requestDriver = [
        { label: "Có", value: true },
        { label: "Không", value: false },
    ];

    const getDateValue = (value: DateRange<Dayjs>) => {
        setDateValue([
            value && value[0] ? dayjs(value[0].toLocaleString()).format("DD/MM/YYYY") : dayjs().format("DD/MM/YYYY"),
            value && value[1] ? dayjs(value[1].toLocaleString()).format("DD/MM/YYYY") : dayjs().add(1, "day").format("DD/MM/YYYY"),
        ]);
    };

    const getTimeValue = (value: string[]) => {
        setTimeValue([
            value && value[0] ? value[0] : `${dayjs().hour()}:00`,
            value && value[1] ? value[1] : `${dayjs().hour()}:00`,
        ]);
    };

    const formatDate = (date: string): string => {
        const arr = date.split("/");
        return `${arr[1]}/${arr[0]}/${arr[2]}`;
    };

    const displayMoney = (value: number) => {
        return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    }

    const arrPrice = requestData?.car.length > 0 ? requestData.car.map((item) => item.price).reduce((total, current) => total + current, 0) : 0;
    const [totalTime, setTotalTime] = useState(
        dayjs(formatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(formatDate(dateValue[0]) + " " + timeValue[0]), "hour")
    );
    const [totalPriceCar, setTotalPriceCar] = useState<number>(arrPrice * totalTime);
    const [VATFee, setVATFee] = useState<number>(arrPrice * totalTime * 0.1)
    const [totalFee, setTotalFee] = useState<number>(arrPrice * totalTime + arrPrice * totalTime * 0.1)
    useEffect(() => {
        const val = dayjs(formatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(formatDate(dateValue[0]) + " " + timeValue[0]), "hour");
        setTotalTime(val);
        setTotalPriceCar(arrPrice * val);
        setVATFee(arrPrice * val * 0.1);
        setTotalFee(arrPrice * val + arrPrice * val * 0.1)
    }, [timeValue, dateValue, arrPrice]);

    const validateForm = () => {
        try {
            form.validateFields(); // Kiểm tra tất cả các trường trong form
            const allFieldsFilled = pickUpLocation && dropLocation ? true : false; // Kiểm tra pickUpLocation và dropLocation
            setIsFormValid(allFieldsFilled);
        } catch (error) {
            setIsFormValid(false); // Nếu có lỗi validate, disable nút
        }
    };

    useEffect(() => {
        validateForm(); // Kiểm tra lần đầu khi component mount
    }, [pickUpLocation, dropLocation]); // Theo dõi thay đổi của các trường bổ sung

    const onDeleteCarInRequest = async (carId: string) => {
        await axiosInstance
            .put("/request/userDeleteCarInRequest", {
                requestId: requestData?._id,
                car: carId,
            })
            .then((res) => {
                setRequestVal(res.data);
                toast.success("Xóa thành công !!");
            })
            .catch((err) => toast.error("Xóa thất bại!!"));
    };

    const handleBooking = async () => {
        const dataCheckRequest = {
            requestId: requestData._id,
            startDate: dayjs(formatDate(dateValue[0]) + " " + timeValue[0]),
            endDate: dayjs(formatDate(dateValue[1]) + " " + timeValue[1]),
        };
        try {
            const dataDuplicate = await axiosInstance.post("/request/handleCheckAdminAcceptRequest", dataCheckRequest);
            setDataCheck(dataDuplicate.data);
            if (!dataDuplicate.data.isExisted) {
                if (form.getFieldValue('isRequestDriver') == true) {
                    await axiosInstance.post('/request/handleCheckDriver', dataCheckRequest)
                        .then(res => {
                            handleSetData()
                        })
                        .catch(err =>
                            toast.error(err.response.data.message)
                        )
                }
            } else {
                toast.error("Có xe đã được thuê trong khoảng thời gian bạn muốn thuê")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSetData = () => {
        const dataUserBookingToBill: RequestUserBookingToBill = {
            request: {
                _id: requestVal._id,
                requestStatus: "2",
                pickUpLocation,
                isRequestDriver: form.getFieldValue("isRequestDriver") || false,
                startDate: dayjs(formatDate(dateValue[0]) + " " + timeValue[0]),
                endDate: dayjs(formatDate(dateValue[1]) + " " + timeValue[1]),
                emailRequest: form.getFieldValue("email") || requestData.user?.email,
                dropLocation,
            },
            billData: {
                vatFee: VATFee,
                depositFee: depositFee,
                totalCarFee: totalPriceCar,
            },
            userName: requestVal.user?.userName,
        };

        handleGetData(dataUserBookingToBill, requestVal)
    }

    return (
        <div className="w-full h-auto ">
            <Form
                form={form}
                onValuesChange={validateForm}
                initialValues={initialValue}
            >
                <div className="border-b-2 border-sky-500">
                    <div>
                        <h4>Thông tin liên hệ</h4>
                        <p>Vui lòng để lại thông tin liên lạc. Chúng tôi sẽ gửi thông báo cho bạn sớm nhất</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                        >
                            <Input
                                className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200"
                                placeholder="email"
                            />
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                        >
                            <Input
                                className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200"
                                placeholder="Số điện thoại"
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="py-5 border-b-2 border-sky-500">
                    <div>
                        <h4>Thông tin đơn hàng</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <Form.Item name="pickUp">
                                <AddressSearch
                                    addressBooking={setPickUpLocation}
                                    title="Vị trí nhận xe"
                                    isRequire={true} />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item name="drop">
                                <AddressSearch addressBooking={setDropLocation} title="Vị trí trả xe" isRequire={true} />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="w-full h-14 border border-blue-300 rounded-md flex items-center">
                        <div
                            className="h-full w-12 flex items-center justify-center text-blue-600 cursor-pointer"
                            onClick={() => setIsOpenModalN(true)}
                        >
                            <CalendarMonthIcon />
                        </div>
                        <div className="flex-grow flex items-center">
                            <div>
                                <div className="text-xs text-gray-500">Thời gian thuê</div>
                                <div className="text-sm font-semibold text-blue-800">
                                    {timeValue[0]}, {dateValue[0]} đến {timeValue[1]}, {dateValue[1]}
                                </div>
                            </div>
                        </div>
                        <CarModal
                            isOpen={isOpenModalN}
                            onCancel={() => setIsOpenModalN(false)}
                            title="Thời gian thuê xe"
                            element={<CarCalendar setDateValue={getDateValue} setTimeValue={getTimeValue} onSubmit={() => setIsOpenModalN(false)} />}
                        />
                    </div>

                    <div className="mb-8">
                        <Form.Item
                            label={<span className="text-blue-600 font-semibold">Bạn muốn thuê tài xế:</span>}
                            name="isRequestDriver"
                            rules={[{ required: true, message: "Vui lòng chọn tùy chọn!" }]}
                        >
                            <Radio.Group className="text-blue-600" options={requestDriver} />
                        </Form.Item>
                    </div>

                    <div className="pt-5 border-b-2 border-gray-300 w-full h-auto">
                        <div>Danh sách xe thuê</div>
                        <div>
                            {
                                requestVal.car && requestVal.car.map((ele, inx) => (
                                    <CarItemPayment
                                        carData={ele}
                                        key={inx}
                                        isBusy={dataCheck?.isExisted && dataCheck.duplicateCar.some(val => ele._id == val)}
                                        onDelete={onDeleteCarInRequest}
                                    />
                                ))
                            }
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="border-b-2 border-gray-300">
                            <div className="flex w-full justify-between">
                                <h6>Phí thuê xe</h6>
                                <div>{displayMoney(totalPriceCar)}</div>
                            </div>
                        </div>
                        <div>
                            <div className="flex w-full justify-between">
                                <h6>Thuế VAT</h6>
                                <div>{displayMoney(VATFee)}</div>
                            </div>
                            <div className="flex w-full justify-between">
                                <h6>Tổng cộng tiền thuê</h6>
                                <div>{displayMoney(totalFee)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>

            <div>
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
                                        <div>{displayMoney(totalFee + mortgateFee)}</div>
                                    </div>
                                    <div className="flex w-full justify-between">
                                        <h6>Tiền thuê</h6>
                                        <div>{displayMoney(totalPriceCar)}</div>
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
                    onClick={handleBooking}
                    disabled={!isFormValid}
                >
                    Xác nhận
                </Button>
            </div>
        </div>
    )
}

export default InforPaymentCar;