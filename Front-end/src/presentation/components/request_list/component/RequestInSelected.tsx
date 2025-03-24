import React, { useEffect, useState } from "react";
import { RequestAcceptForApi, RequestModelFull, RequestUserBookingToBill } from "../../checkout/models";
import { Button, Form, Input, Radio } from "antd";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useForm } from "antd/es/form/Form";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from '@mui/x-date-pickers-pro/models';
import axiosInstance from "../../utils/axios";
import CarModal from "../../car_detail/component/CarModal";
import CarCalendar from "../../car_detail/component/CarCalendar";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";
import AddressSearch from "./AddressSearch";
import ModalDeposit from "./ModalDeposit";

interface Props {
    requestModal: RequestModelFull;
}

const RequestInSelected: React.FC<Props> = ({ requestModal }) => {
    const [isOpenModalN, setIsOpenModalN] = useState(false);
    const [requestData, setRequestData] = useState<RequestModelFull>(requestModal);
    const [dataCheck, setDataCheck] = useState<{ isExisted: boolean; duplicateCar: string[] } | undefined>();
    const navigate = useNavigate();
    const [driverSelected] = useState<any[]>([]); // Giả định driverSelected không thay đổi
    const [pickUpLocation, setPickUpLocation] = useState<string>("");
    const [dropLocation, setDropLocation] = useState<string>("");
    const [form] = useForm();
    const [isFormValid, setIsFormValid] = useState(false); // Trạng thái hợp lệ của form

    const requestDriver = [
        { label: "Có", value: true },
        { label: "Không", value: false },
    ];

    const initialValue = {
        userName: requestData?.user?.userName,
        email: requestData?.user?.email,
        phoneNumber: requestData?.user?.phoneNumber,
        address: requestData?.user?.address,
        isRequestDriver: false, // Giá trị mặc định
    };

    const [dateValue, setDateValue] = useState<string[]>([
        dayjs().format("DD/MM/YYYY"),
        dayjs().add(1, "day").format("DD/MM/YYYY"),
    ]);

    const [timeValue, setTimeValue] = useState<string[]>([
        `${dayjs().hour()}:00`,
        `${dayjs().hour()}:00`,
    ]);

    // Kiểm tra tính hợp lệ của form và các trường bổ sung
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
        console.log("check", pickUpLocation, pickUpLocation)
    }, [pickUpLocation, dropLocation]); // Theo dõi thay đổi của các trường bổ sung

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

    // const handleBooking = async () => {
    //     const requestBookingAccept: RequestAcceptForApi = {
    //         user: {
    //             ...requestData?.user,
    //             userName: form.getFieldValue("userName"),
    //             phoneNumber: form.getFieldValue("phoneNumber"),
    //         },
    //         emailRequest: form.getFieldValue("email") || requestData.user?.email,
    //         isRequestDriver: form.getFieldValue("isRequestDriver") || false,
    //         startDate: dayjs(formatDate(dateValue[0]) + " " + timeValue[0]),
    //         endDate: dayjs(formatDate(dateValue[1]) + " " + timeValue[1]),
    //         requestStatus: "2",
    //         pickUpLocation,
    //         _id: requestData._id,
    //     };

    //     await axiosInstance
    //         .post("/request/userAcceptRequest", requestBookingAccept)
    //         .then((res) => {
    //             toast.success("Bạn đã thành công đặt xe !!");
    //         })
    //         .catch((err) => console.log(err));
    // };

    const onBooking = async () => {
        const dataCheckRequest = {
            driver: driverSelected,
            requestId: requestData._id,
            startDate: dayjs(formatDate(dateValue[0]) + " " + timeValue[0]),
            endDate: dayjs(formatDate(dateValue[1]) + " " + timeValue[1]),
        };
        console.log(dataCheckRequest)
        try {
            const dataDuplicate = await axiosInstance.post("/request/handleCheckAdminAcceptRequest", dataCheckRequest);
            setDataCheck(dataDuplicate.data);
            if (!dataDuplicate.data.isExisted) {
                setIsModalDepositOpen(true)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const arrPrice = requestData?.car.length > 0 ? requestData.car.map((item) => item.price).reduce((total, current) => total + current, 0) : 0;
    const [totalTime, setTotalTime] = useState(
        dayjs(formatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(formatDate(dateValue[0]) + " " + timeValue[0]), "hour")
    );
    const [totalPrice, setTotalPrice] = useState(arrPrice * totalTime);

    useEffect(() => {
        const val = dayjs(formatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(formatDate(dateValue[0]) + " " + timeValue[0]), "hour");
        setTotalTime(val);
        setTotalPrice(arrPrice * val);
        if (dayjs(dateValue[0]).isSame(dayjs())) {
            form.setFieldValue("isRequestDriver", false)
        }
    }, [timeValue, dateValue, arrPrice]);

    const onDeleteCarInRequest = async (carId: string) => {
        await axiosInstance
            .put("/request/userDeleteCarInRequest", {
                requestId: requestData?._id,
                car: carId,
            })
            .then((res) => {
                setRequestData(res.data);
                toast.success("Xóa xe thành công");
            })
            .catch((err) => toast.error("Fail to delete !!"));
    };

    const [isModalDepositOpen, setIsModalDepositOpen] = useState(false);

    const handleSubmit = async (amount: number) => {
        console.log(`Số tiền thanh toán: ${amount}`);
        setIsModalDepositOpen(false);
        // const requestBookingAccept: RequestAcceptForApi = {
        //     user: {
        //         ...requestData?.user,
        //         userName: form.getFieldValue("userName"),
        //         phoneNumber: form.getFieldValue("phoneNumber"),
        //     },
        //     emailRequest: form.getFieldValue("email") || requestData.user?.email,
        //     isRequestDriver: form.getFieldValue("isRequestDriver") || false,
        //     startDate: dayjs(formatDate(dateValue[0]) + " " + timeValue[0]),
        //     endDate: dayjs(formatDate(dateValue[1]) + " " + timeValue[1]),
        //     requestStatus: "2",
        //     pickUpLocation,
        //     _id: requestData._id,
        // };

        const dataUserBookingToBill: RequestUserBookingToBill = {
            request: {
                _id: requestData._id,
                requestStatus: "2",
                pickUpLocation,
                isRequestDriver: form.getFieldValue("isRequestDriver") || false,
                startDate: dayjs(formatDate(dateValue[0]) + " " + timeValue[0]),
                endDate: dayjs(formatDate(dateValue[1]) + " " + timeValue[1]),
                emailRequest: form.getFieldValue("email") || requestData.user?.email,
                dropLocation,
            },
            billData: {
                vatFee: totalPrice * 0.1,
                depositFee: amount,
                totalCarFee: totalPrice,
            },
            userName: requestData.user?.userName,
        };

        await axiosInstance
            .post("/bill/userBookingBill", dataUserBookingToBill)
            .then((res) => {
                toast.success("Bạn đã thành công đặt xe !!");
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="bg-white p-10 rounded-lg shadow-md">
            <div className="flex">
                {/* Phần Form */}
                <div className="w-2/5 pr-8 border-r border-gray-200">
                    <Form
                        className="w-full"
                        initialValues={initialValue}
                        form={form}
                        // onFinish={onBooking}
                        onValuesChange={validateForm} // Gọi validate mỗi khi giá trị thay đổi
                    >
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Họ và tên</span>}
                                name="userName"
                                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" />
                            </Form.Item>
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Email</span>}
                                name="email"
                                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" readOnly />
                            </Form.Item>
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Số điện thoại</span>}
                                name="phoneNumber"
                                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" />
                            </Form.Item>
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
                        <div className="w-full h-14 border border-blue-300 rounded-md flex items-center mb-8">
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
                        <div>
                            <Form.Item name="pickUp">
                                <AddressSearch addressBooking={setPickUpLocation} title="Vị trí nhận xe" isRequire={true} />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item name="drop">
                                <AddressSearch addressBooking={setDropLocation} title="Vị trí trả xe" isRequire={true} />
                            </Form.Item>
                        </div>
                        <div className="text-gray-700 font-medium">
                            <div className="flex justify-between">
                                Tổng thời gian thuê: <span className="text-blue-900">{totalTime}h</span>
                            </div>
                            <div className="flex justify-between">
                                Thuế VAT:{" "}
                                <span className="text-blue-900">
                                    {totalPrice && (totalPrice * 0.1).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                Tổng số tiền:{" "}
                                <span className="text-blue-900">
                                    {totalPrice && totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                </span>
                            </div>
                        </div>
                    </Form>

                    <div className="w-full flex justify-end mt-6">
                        <Button
                            onClick={onBooking}
                            type="primary"
                            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                            disabled={!isFormValid} // Disable nút nếu form không hợp lệ
                        >
                            Đặt xe
                        </Button>
                    </div>
                    <ModalDeposit
                        isOpen={isModalDepositOpen}
                        onCancel={() => setIsModalDepositOpen(false)}
                        onSubmit={handleSubmit}
                    />
                </div>

                {/* Phần List Item */}
                <div className="w-3/5 pl-8">
                    {requestData?.car && requestData.car.length > 0 ? (
                        <div className="flex flex-wrap">
                            {requestData.car.map((item, idx) => (
                                <div key={idx} className="flex items-center border-b border-blue-200 w-full mb-4 p-4 rounded-md shadow-sm">
                                    <img src={`http://localhost:3030${item?.images[0]}`} alt={item.carName} className="w-32 h-32 object-cover rounded-md" />
                                    <div className="ml-4 flex-grow">
                                        {dataCheck?.isExisted && dataCheck.duplicateCar.find((ele) => ele === item._id) ? (
                                            <p className="text-red-700">Xe này đã bận trong khoảng thời gian bạn đặt !!!</p>
                                        ) : null}
                                        <h6 className="text-sm font-semibold text-blue-800">
                                            {item.carName} {item.carVersion}
                                        </h6>
                                        <ul className="space-y-1">
                                            <li>
                                                Giá thuê:{" "}
                                                <span className="font-medium text-blue-700">
                                                    {item.price && item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}/ 1h
                                                </span>
                                            </li>
                                            <li>
                                                Biển số: <span className="font-medium text-blue-700">{item.licensePlateNumber}</span>
                                            </li>
                                            <li>
                                                Số chỗ: <span className="font-medium text-blue-700">{item.numberOfSeat}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="hover:text-blue-600 hover:text-xl cursor-pointer" onClick={() => onDeleteCarInRequest(item._id)}>
                                        <DeleteIcon />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 italic">Không có xe nào được chọn.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestInSelected;