import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { RequestAcceptForApi, RequestModalForCallApi, RequestModelFull, UserModel } from '../models';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CarModal from '../../car_detail/component/CarModal';
import CarCalendar from '../../car_detail/component/CarCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { FormControl } from '@mui/material';
import { Button, Form, Input, Radio } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axiosInstance from '../../utils/axios';
import { statusRequest } from '../../../../constants';

interface props {
  requestData: RequestModelFull,
}

const AddressForm = ({ requestData }: props) => {


  const [isOpenModalN, setIsOpenModalN] = React.useState(false)
  const [dateValue, setDateValue] = React.useState<any[]>([dayjs().format('DD/MM/YYYY'), dayjs().add(1, 'day').format('DD/MM/YYYY')]);
  const requestDriver = [
    { label: "Có", value: true },
    { label: "Không", value: false }
  ]
  const [form] = useForm()

  const initialValue = {
    userName: requestData.user?.userName,
    email: requestData.user?.email,
    phoneNumber: requestData.user?.phoneNumber,
    address: requestData.user?.address,
  }

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
        ...requestData.user,
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

  const arrprice = requestData.car.map((item) => item.price).reduce((total, current) => {
    return total + current
  })
  const [totalTime, setTotalTime] = React.useState(dayjs(fomatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(fomatDate(dateValue[0]) + " " + timeValue[0]), 'hour'))
  const [totalPrice, setTotalPrice] = React.useState(arrprice * totalTime)
  React.useEffect(() => {
    const val = dayjs(fomatDate(dateValue[1]) + " " + timeValue[1]).diff(dayjs(fomatDate(dateValue[0]) + " " + timeValue[0]), 'hour')
    setTotalTime(val)
    setTotalPrice(arrprice * totalTime)
    console.log()
  }, [timeValue, dateValue])

  return (
    <Grid container spacing={1}>
      {
        requestData.requestStatus == "1" ?
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
              <div className='w-1/2 flex justify-between'>Thuế VAT : <span className='text-gray-950'>{totalPrice * 0.1} kđ</span></div>
              <div className='w-1/2 flex justify-between'>Tổng số tiền thuê xe : <span className='text-gray-950'>{totalPrice} kđ</span></div>
            </div>
            <div className='w-full flex items-center justify-end'>
              <Button htmlType='submit' type='primary'>Đặt xe</Button>
            </div>
          </Form>
          :
          <div className='w-full h-screen flex justify-center'>
            <div className='text-gray-500 font-medium w-2/3'>
              <div className='w-full flex justify-between'>Họ và tên : <span className='text-gray-950'>{requestData.user?.userName}</span></div>
              <div className='w-full flex justify-between'>Email : <span className='text-gray-950'>{requestData.user?.email}</span></div>
              <div className='w-full flex justify-between'>Số điện thoại : <span className='text-gray-950'>{requestData.user?.phoneNumber}</span></div>
              <div className='w-full flex justify-between'>Địa chỉ : <span className='text-gray-950'>{requestData.user?.address}</span></div>
              <div className='w-full flex justify-between'>Trạng thái : <span className='text-gray-950'>{statusRequest.filter((item) => item.value == requestData.requestStatus)[0].lable}</span></div>
              <div className='w-full flex justify-between'>Thời gian : <span className='text-gray-950'>Từ: {dayjs(requestData.startDate).format("HH:mm, DD/MM/YYYY")} đến {dayjs(requestData.endDate).format("HH:mm, DD/MM/YYYY")}</span></div>
              <div className='w-full flex justify-between'>Tổng thời gian thuê : <span className='text-gray-950'>{totalTime}h</span></div>
              <div className='w-full flex justify-between'>Thuế VAT : <span className='text-gray-950'>{totalPrice * 0.1} kđ</span></div>
              <div className='w-full flex justify-between'>Tổng số tiền thuê xe : <span className='text-gray-950'>{totalPrice} kđ</span></div>
            </div>
          </div>
      }
    </Grid>
  );
}

export default AddressForm
