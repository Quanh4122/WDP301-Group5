import React from "react";
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

interface props {
    requestData?: RequestModelFull
}

const RequestInSelected = ({ requestData }: props) => {
    const [isOpenModalN, setIsOpenModalN] = React.useState(false)
    const requestDriver = [
        { label: "Có", value: true },
        { label: "Không", value: false }
    ]
    const [form] = useForm()
    const initialValue = {
        userName: requestData?.user?.userName,
        email: requestData?.user?.email,
        phoneNumber: requestData?.user?.phoneNumber,
        address: requestData?.user?.address,
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

    return (
        <div className="m-4">
            <div className="flex items-center justify-center">
                <div className="w-2/5 h-auto flex items-center justify-center">
                    <div className="w-4/5 h-full">
                        <Form
                            className='w-full'
                            initialValues={initialValue}
                            form={form}
                            onFinish={onBooking}
                        >
                            <div className='flex w-full justify-between mb-2'>
                                <Form.Item
                                    label="Họ và tên"
                                    layout='vertical'
                                    name='userName'
                                    required
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Email"
                                    layout='vertical'
                                    name='email'
                                    required
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div className='flex w-full justify-between mb-2'>
                                <Form.Item
                                    label="Số điện thoại"
                                    layout='vertical'
                                    name='phoneNumber'
                                    required
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Địa chỉ"
                                    layout='vertical'
                                    name='address'
                                    required
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div className='flex w-full justify-between mb-8'>
                                <Form.Item
                                    label="Bạn muốn thuê tài xế : "
                                    layout='vertical'
                                    name='isRequestDriver'
                                    required
                                >
                                    <Radio.Group
                                        options={requestDriver}
                                    />
                                </Form.Item>
                            </div>
                            <div
                                className="w-80 border-2 h-16  rounded-md flex items-center mb-8">
                                <div
                                    className="h-full w-12 flex items-center justify-center text-sky-500"
                                    onClick={() => setIsOpenModalN(true)}
                                >
                                    <CalendarMonthIcon />
                                </div>
                                <div className="h-full w-auto flex items-center">
                                    <div>
                                        <div className="text-xs text-gray-500">Thời gian thuê</div>
                                        <div className="text-sm font-semibold">{timeValue[0]}, {dateValue[0]} đến {timeValue[1]}, {dateValue[1]}</div>
                                    </div>
                                </div>
                                <CarModal
                                    isOpen={isOpenModalN}
                                    onCancel={() => setIsOpenModalN(false)}
                                    title={"Thời gian thuê xe"}
                                    element={<CarCalendar setDateValue={getDateValue} setTimeValue={getTimeValue} onSubmit={() => setIsOpenModalN(false)} />}
                                />
                            </div>
                            <div className='text-gray-500 font-medium'>
                                <div className='w-1/2 flex justify-between'>Tổng thời gian thuê : <span className='text-gray-950'>{totalTime}h</span></div>
                                <div className='w-1/2 flex justify-between'>Thuế VAT : <span className='text-gray-950'>{totalPrice && totalPrice * 0.1} kđ</span></div>
                                <div className='w-1/2 flex justify-between'>Tổng số tiền thuê xe : <span className='text-gray-950'>{totalPrice} kđ</span></div>
                            </div>
                            <div className='w-full flex items-center justify-end'>
                                <Button htmlType='submit' type='primary'>Đặt xe</Button>
                            </div>
                        </Form>
                    </div>

                </div>
                <div className="w-3/5 h-auto flex justify-center">
                    {
                        requestData?.car.map((item) => (
                            <div className=' flex items-center border-b-2 w-1/3 ml-5'>

                                <img src={`http://localhost:3030${item.images[0]}`} className='w-32 h32' />
                                <List disablePadding>
                                    <Typography variant="h6" gutterBottom sx={{ fontSize: 15, fontWeight: 600 }}>
                                        {item.carName + " " + item.carVersion}
                                    </Typography>
                                    <ListItem sx={{ px: 0 }} >
                                        <ListItemText
                                            sx={{ mr: 2 }}
                                            primary={"Giá thuê: "}
                                        />
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {item.price}k / 1h
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={"Biển số : "}
                                        />
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {item.licensePlateNumber}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={"Số chỗ: "}
                                        />
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {item.numberOfSeat}
                                        </Typography>
                                    </ListItem>
                                </List>
                                <div className="h-full">
                                    <Icon><DeleteIcon /></Icon>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default RequestInSelected