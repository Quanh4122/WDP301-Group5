import React, { useEffect, useState } from "react";
import { RequestAcceptForApi, RequestModelFull } from "../../checkout/models";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { CarModels } from '../../car_list/model';
import { Button, Form, Input, Radio } from "antd";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useForm } from "antd/es/form/Form";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from '@mui/x-date-pickers-pro/models';
import axiosInstance from "../../utils/axios";
import CarModal from "../../car_detail/component/CarModal";
import CarCalendar from "../../car_detail/component/CarCalendar";
import DeleteIcon from '@mui/icons-material/Delete';
import { Icon } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";

interface props {
    requestModal: RequestModelFull
}

const RequestInReject = ({ requestModal }: props) => {

    const [isOpenModalN, setIsOpenModalN] = React.useState(false)
    const [requestData, setRequestData] = useState<RequestModelFull>(requestModal)
    const navigate = useNavigate()
    const requestDriver = [
        { label: "Có", value: true },
        { label: "Không", value: false }
    ]
    console.log("inreject", requestModal)
    const [form] = useForm()
    const initialValue = {
        userName: requestData?.user?.userName,
        email: requestData?.user?.email,
        phoneNumber: requestData?.user?.phoneNumber,
        address: requestData?.user?.address,
        isRequestDriver: requestData.isRequestDriver
    }
    const [dateValue, setDateValue] = React.useState<any[]>([dayjs(requestData.startDate).format('DD/MM/YYYY'), dayjs(requestData.endDate).format('DD/MM/YYYY')]);
    const getDateValue = (value: DateRange<Dayjs>) => {
        setDateValue([
            value && value[0] ? dayjs(value[0].toLocaleString()).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
            value && value[1] ? dayjs(value[1].toLocaleString()).format('DD/MM/YYYY') : dayjs().add(1, 'day').format('DD/MM/YYYY')
        ])
    }

    const [timeValue, setTimeValue] = React.useState<any[]>([dayjs(requestData.startDate).hour() + ":" + "00", dayjs(requestData.endDate).hour() + ":" + "00"]);

    const getTimeValue = (value: any[]) => {
        setTimeValue([
            value && value[0] ? value[0] : dayjs().hour() + ":" + "00",
            value && value[1] ? value[1] : dayjs().hour() + ":" + "00"
        ])
    }

    const fomatDate = (date: string) => {
        const arr = date.split('/')
        return arr[1] + "/" + arr[0] + "/" + arr[2]
    }

    const onBooking = async () => {
        const requestBookingAccept: RequestAcceptForApi = {
            user: {
                ...requestData?.user,
                userName: form.getFieldValue("userName"),
                email: form.getFieldValue("email"),
                phoneNumber: form.getFieldValue("phoneNumber"),
                address: form.getFieldValue("address")
            },
            // user: requestData.user,
            isRequestDriver: form.getFieldValue("isRequestDriver") || false,
            startDate: dayjs(fomatDate(dateValue[0]) + " " + timeValue[0]),
            endDate: dayjs(fomatDate(dateValue[1]) + " " + timeValue[1]),
            requestStatus: "2",
        }

        await axiosInstance.post("/request/userAcceptRequest", requestBookingAccept)
            .then(res => {
                toast.success("Bạn đã thành công đặt xe !!")
                navigate("/")
            })
            .catch(err => console.log(err))
    }
    const arrprice = requestData?.car.length > 0 ? requestData?.car.map((item) => item.price).reduce((total, current) => {
        return total + current
    }) : 0
    const [totalTime, setTotalTime] = React.useState(dayjs(fomatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(fomatDate(dateValue[0]) + " " + timeValue[0]), 'hour'))
    const [totalPrice, setTotalPrice] = React.useState(arrprice && arrprice * totalTime)

    React.useEffect(() => {
        const val = dayjs(fomatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(fomatDate(dateValue[0]) + " " + timeValue[0]), 'hour')
        setTotalTime(val)
        setTotalPrice(arrprice && arrprice * totalTime)
    }, [timeValue, dateValue])

    const onDeleteCarInRequest = async (carId: any) => {
        await axiosInstance.put("/request/userDeleteCarInRequest", {
            requestId: requestData?._id,
            car: carId
        })
            .then((res) => {
                setRequestData(res.data)
                toast.success("Delete Succesfull")
            })
            .catch((err) => toast.error("Fail to delete !!"))
    }

    return (
        <div className="bg-white p-10    rounded-lg shadow-md">
            <div className="flex">
                {/* Phần Form */}
                <div className="w-2/5 pr-8 border-r border-gray-200">
                    <Form
                        className="w-full"
                        initialValues={initialValue}
                        form={form}
                        onFinish={onBooking}
                    >
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Họ và tên</span>}
                                name="userName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" />
                            </Form.Item>
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Email</span>}
                                name="email"
                                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" />
                            </Form.Item>
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Số điện thoại</span>}
                                name="phoneNumber"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" />
                            </Form.Item>
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Địa chỉ</span>}
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" />
                            </Form.Item>
                        </div>
                        <div className="mb-8">
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Bạn muốn thuê tài xế:</span>}
                                name="isRequestDriver"
                                rules={[{ required: true, message: 'Vui lòng chọn tùy chọn!' }]}
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
                        <div className="text-gray-700 font-medium">
                            <div className="flex justify-between">Tổng thời gian thuê: <span className="text-blue-900">{totalTime}h</span></div>
                            <div className="flex justify-between">
                                Thuế VAT: <span className="text-blue-900">
                                    {totalPrice && (totalPrice * 0.1 * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                Tổng số tiền: <span className="text-blue-900">
                                    {totalPrice && (totalPrice * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </span>
                            </div>
                        </div>
                        <div className="w-full flex justify-end mt-6">
                            <Button htmlType="submit" type="primary" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
                                Đặt xe
                            </Button>
                        </div>
                    </Form>
                </div>

                {/* Phần List Item */}
                <div className="w-3/5 pl-8">
                    {requestData?.car && requestData.car.length > 0 ? (
                        <div className="flex flex-wrap">
                            {requestData.car.map((item, idx) => (
                                <div key={idx} className="flex items-center border-b border-blue-200 w-full mb-4 p-4 rounded-md shadow-sm">
                                    <img src={`http://localhost:3030${item?.images[0]}`} alt={item.carName} className="w-32 h-32 object-cover rounded-md" />
                                    <div className="ml-4 flex-grow">
                                        <h6 className="text-sm font-semibold text-blue-800">{item.carName} {item.carVersion}</h6>
                                        <ul className="space-y-1">
                                            <li>Giá thuê: <span className="font-medium text-blue-700">{item.price}k / 1h</span></li>
                                            <li>Biển số: <span className="font-medium text-blue-700">{item.licensePlateNumber}</span></li>
                                            <li>Số chỗ: <span className="font-medium text-blue-700">{item.numberOfSeat}</span></li>
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
    )
}

export default RequestInReject