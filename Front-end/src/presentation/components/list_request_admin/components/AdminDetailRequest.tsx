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
import { useLocation, useNavigate } from "react-router-dom";
import ModalDriverSelect from "./ModalDriverSelect";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";

const AdminDetailRequest = () => {
    const location = useLocation()
    const [isOpenModalN, setIsOpenModalN] = React.useState(false)
    const [requestData, setRequestData] = useState<RequestModelFull>(location.state)
    const [driverList, setDriverList] = useState<any[]>()
    const requestDriver = [
        { label: "Có", value: true },
        { label: "Không", value: false }
    ]
    const [form] = useForm()
    const initialValue = {
        fullName: requestData?.user?.fullName,
        email: requestData?.user?.email,
        phoneNumber: requestData?.user?.phoneNumber,
        address: requestData?.user?.address,
        isRequestDriver: requestData.isRequestDriver ? true : false
    }

    useEffect(() => {
        getListDriver()
        console.log(initialValue)
    }, [])

    const getListDriver = async () => {
        await axiosInstance.get("/driverFree")
            .then(res => setDriverList(res.data))
            .catch(err => console.log(err))
    }

    const [dateValue, setDateValue] = React.useState<any[]>([dayjs().format('DD/MM/YYYY'), dayjs().add(1, 'day').format('DD/MM/YYYY')]);
    const getDateValue = (value: DateRange<Dayjs>) => {
        setDateValue([
            value && value[0] ? dayjs(value[0].toLocaleString()).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
            value && value[1] ? dayjs(value[1].toLocaleString()).format('DD/MM/YYYY') : dayjs().add(1, 'day').format('DD/MM/YYYY')
        ])
    }

    const [timeValue, setTimeValue] = React.useState<any[]>([dayjs().hour() + ":" + "00", dayjs().hour() + ":" + "00"]);

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
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
    const arrprice = requestData?.car.map((item) => item.price).reduce((total, current) => {
        return total + current
    })
    const [totalTime, setTotalTime] = React.useState(dayjs(fomatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(fomatDate(dateValue[0]) + " " + timeValue[0]), 'hour'))
    const [totalPrice, setTotalPrice] = React.useState(arrprice && arrprice * totalTime)

    React.useEffect(() => {
        const val = dayjs(fomatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(fomatDate(dateValue[0]) + " " + timeValue[0]), 'hour')
        setTotalTime(val)
        setTotalPrice(arrprice && arrprice * totalTime)
        console.log()
    }, [timeValue, dateValue])

    const [driverSelected, setDriverSelected] = useState<any[]>([])
    const onSelectedValue = (value: any) => {
        if (value.isSelect == true) {
            let dt = [...driverSelected, value.value]
            setDriverSelected(dt)
            dt.length >= requestData.car.length && setIsOpenModalN(false)
        } else {
            const data = driverSelected.filter(item => item != value.value)
            setDriverSelected(data)
        }

    }

    const navigate = useNavigate()
    const [dpRequest, setDpRequest] = useState<boolean>()
    const [dpRequestC, setDpRequestC] = useState<boolean>(true)
    const onCheckRequest = async () => {
        const dataSubmit = {
            driver: driverSelected,
            requestId: requestData._id,
            car: requestData.car
        }
        await axiosInstance.post('/request/handleCheckAdminAcceptRequest', dataSubmit)
            .then(res => {
                setDpRequest(res.data ? true : false)
                setDpRequestC(false)
            })
            .catch(err => console.log(err))
    }

    const onSubmitData = async (isAccept: boolean) => {
        const dataSubmit = {
            driver: driverSelected,
            requestId: requestData._id,
            isAccept: isAccept,
            car: requestData.car
        }

        await axiosInstance.post('/request/handleAdminAcceptRequest', dataSubmit)
            .then(res => console.log(res.status))
            .catch(err => console.log(err))
        navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.ADMIN_REQUEST)
    }
    return (
        <div className="m-4 bg-blue-50 min-h-screen"> {/* Light blue background */}
            <div className="flex items-center justify-center">
                <div className="w-2/5 h-auto flex items-center justify-center">
                    <div className="w-4/5 h-full bg-white rounded-lg shadow p-6"> {/* White background, rounded corners, shadow, padding */}
                        <Form className='w-full' initialValues={initialValue}>
                            <div className='flex w-full justify-between mb-4'>
                                <Form.Item label="Họ và tên" layout='vertical' name='userName' required className="w-1/2 mr-2">
                                    <Input disabled className="border-blue-200" />
                                </Form.Item>
                                <Form.Item label="Email" layout='vertical' name='email' required className="w-1/2 ml-2">
                                    <Input disabled className="border-blue-200" />
                                </Form.Item>
                            </div>
                            <div className='flex w-full justify-between mb-4'>
                                <Form.Item label="Số điện thoại" layout='vertical' name='phoneNumber' required className="w-1/2 mr-2">
                                    <Input disabled className="border-blue-200" />
                                </Form.Item>
                                <Form.Item label="Địa chỉ" layout='vertical' name='address' required className="w-1/2 ml-2">
                                    <Input disabled className="border-blue-200" />
                                </Form.Item>
                            </div>
                            <div className='flex w-full justify-between mb-8'>
                                <Form.Item label="Bạn muốn thuê tài xế :" layout='vertical' name='isRequestDriver' required className="w-full">
                                    <Radio.Group disabled options={requestDriver} />
                                </Form.Item>
                            </div>
                            <div className="w-full border border-blue-200 rounded-md p-3 mb-8 flex items-center"> {/* Light blue border, flex items-center */}
                                <div className="w-12 flex items-center justify-center text-blue-500"> {/* Blue icon */}
                                    <CalendarMonthIcon />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-500">Thời gian thuê</div>
                                    <div className="text-sm font-semibold text-blue-700">{timeValue[0]}, {dateValue[0]} đến {timeValue[1]}, {dateValue[1]}</div> {/* Blue text */}
                                </div>
                            </div>
                            {requestData?.isRequestDriver && (
                                <div className="w-full border border-blue-200 rounded-md p-3 mb-8 flex items-center">
                                    <div className="w-12 flex items-center justify-center text-blue-500 cursor-pointer" onClick={() => setIsOpenModalN(true)}>
                                        <CalendarMonthIcon />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500">Danh sách tài xế</div>
                                    </div>
                                    <ModalDriverSelect isOpen={isOpenModalN} onCancel={() => setIsOpenModalN(false)} listDriver={driverList} onSelectedValue={onSelectedValue} />
                                </div>
                            )}
                            <div className='text-gray-500 font-medium mb-8'>
                                <div className='flex justify-between'>Tổng thời gian thuê : <span className='text-blue-700'>{totalTime}h</span></div> {/* Blue text */}
                                <div className='flex justify-between'>Thuế VAT : <span className='text-blue-700'>{totalPrice && (totalPrice * 0.1 * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                                <div className='flex justify-between'>Tổng số tiền : <span className='text-blue-700'>{totalPrice && (totalPrice * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                            </div>
                            <div className='w-full flex items-center justify-end mt-5'>
                                {
                                    dpRequestC ? <Button
                                        type='primary'
                                        onClick={onCheckRequest}
                                        className="mr-5 bg-blue-500 hover:bg-blue-600 border-blue-600"
                                    > {/* Blue buttons */}
                                        Kiểm tra
                                    </Button>
                                        :
                                        <Button type='primary' onClick={() => onSubmitData(dpRequest ? false : true)} className="mr-5 bg-blue-500 hover:bg-blue-600 border-blue-600"> {/* Blue buttons */}
                                            {dpRequest ? "Từ chối" : "Đồng ý"}
                                        </Button>
                                }



                                {/* <Button type='primary' onClick={() => onSubmitData(false)} className="bg-blue-500 hover:bg-blue-600 border-blue-600">
                                    Từ chối
                                </Button> */}
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="w-3/5 h-auto flex flex-wrap">
                    {requestData?.car.map((item, index) => (
                        <div className='flex items-center border-b border-blue-200 w-full p-4' key={index}> {/* Light blue border, padding */}
                            <img src={`http://localhost:3030${item?.images[0]}`} alt={item.carName} className='w-32 h-32 rounded-md mr-4' /> {/* Rounded image, margin right */}
                            <List disablePadding className="flex-1">
                                <Typography variant="h6" gutterBottom sx={{ fontSize: 15, fontWeight: 600 }} className="text-blue-500">
                                    {item.carName + " " + item.carVersion}
                                </Typography>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemText primary={"Giá thuê: "} />
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {item.price}k / 1h
                                    </Typography>
                                </ListItem>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemText primary={"Biển số : "} />
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {item.licensePlateNumber}
                                    </Typography>
                                </ListItem>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemText primary={"Số chỗ: "} />
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {item.numberOfSeat}
                                    </Typography>
                                </ListItem>
                                {driverSelected.length > 0 && (
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemText primary={"Tài xế: "} />
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {driverList?.find(d => driverSelected[0] === d._id)?.name}
                                        </Typography>
                                    </ListItem>
                                )}
                            </List>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminDetailRequest