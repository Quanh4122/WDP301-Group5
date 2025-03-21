import React, { useEffect, useState } from 'react';
import { CarModel, RequestAcceptForApi, RequestModelFull } from '../../checkout/models';
import { Button, Form, Input, Radio } from 'antd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useForm } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import axiosInstance from '../../utils/axios';
import CarModal from '../../car_detail/component/CarModal';
import CarCalendar from '../../car_detail/component/CarCalendar';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from '../../../routes/CONSTANTS';
import ModalSelectCar from './ModalSelectCar';
import AddressSearch from './AddressSearch';

interface RequestDriverOption {
    label: string;
    value: boolean;
}

const RequestInExpire: React.FC = () => {
    const [isOpenModalN, setIsOpenModalN] = useState<boolean>(false);
    const [requestData, setRequestData] = useState<RequestModelFull | undefined>(undefined);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [form] = useForm();
    const [addressBooking, setAddressBooking] = useState<string>('');

    const requestDriver: RequestDriverOption[] = [
        { label: 'Có', value: true },
        { label: 'Không', value: false },
    ];

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const requestId = queryParams.get('requestId');
        getRequestById(requestId);
    }, [location.search]);

    const getRequestById = async (requestId?: string | null) => {
        if (requestId) {
            try {
                const res = await axiosInstance.get<RequestModelFull>('/request/getRequestById', {
                    params: {
                        key: requestId,
                    },
                });
                console.log('API Response:', res.data);
                setRequestData(res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const [dateValue, setDateValue] = useState<string[]>([
        dayjs().format('DD/MM/YYYY'),
        dayjs().add(1, 'day').format('DD/MM/YYYY'),
    ]);

    const [timeValue, setTimeValue] = useState<string[]>([
        dayjs().format('HH:00'),
        dayjs().format('HH:00'),
    ]);

    useEffect(() => {
        if (requestData) {
            console.log('RequestInExpire - requestData:', requestData);
            console.log('Setting addressBooking:', requestData.pickUpLocation || 'Không có pickUpLocation');

            form.setFieldsValue({
                userName: requestData.user?.userName,
                email: requestData.user?.email,
                phoneNumber: requestData.user?.phoneNumber,
                address: requestData.user?.address,
                isRequestDriver: requestData.isRequestDriver,
            });

            setDateValue([
                requestData.startDate ? dayjs(requestData.startDate).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
                requestData.endDate ? dayjs(requestData.endDate).format('DD/MM/YYYY') : dayjs().add(1, 'day').format('DD/MM/YYYY'),
            ]);

            setTimeValue([
                requestData.startDate ? dayjs(requestData.startDate).format('HH:00') : dayjs().format('HH:00'),
                requestData.endDate ? dayjs(requestData.endDate).format('HH:00') : dayjs().format('HH:00'),
            ]);

            setAddressBooking(requestData.pickUpLocation || '');
        }
    }, [requestData, form]);

    // Log giá trị addressBooking sau khi cập nhật
    useEffect(() => {
        console.log('Updated addressBooking:', addressBooking);
    }, [addressBooking]);

    const getDateValue = (value: DateRange<Dayjs>) => {
        setDateValue([
            value && value[0] ? dayjs(value[0].toLocaleString()).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
            value && value[1] ? dayjs(value[1].toLocaleString()).format('DD/MM/YYYY') : dayjs().add(1, 'day').format('DD/MM/YYYY'),
        ]);
    };

    const getTimeValue = (value: string[] | null) => {
        setTimeValue([
            value && value[0] ? value[0] : dayjs().format('HH:00'),
            value && value[1] ? value[1] : dayjs().format('HH:00'),
        ]);
    };

    const fomatDate = (date: string): string => {
        const arr = date.split('/');
        return `${arr[1]}/${arr[0]}/${arr[2]}`;
    };

    const onBooking = async () => {
        // Logic cho nút "Gia hạn thêm" hoặc "Từ chối" có thể thêm sau
    };

    const arrprice: number =
        requestData?.car && requestData.car.length > 0
            ? requestData.car.map((item) => item.price).reduce((total, current) => total + current, 0)
            : 0;

    const [totalTime, setTotalTime] = useState<number>(
        dayjs(fomatDate(dateValue[1]) + ' ' + timeValue[1]).diff(dayjs(fomatDate(dateValue[0]) + ' ' + timeValue[0]), 'hour')
    );
    const [totalPrice, setTotalPrice] = useState<number | undefined>(arrprice && arrprice * totalTime);

    useEffect(() => {
        const val = dayjs(fomatDate(dateValue[1]) + ' ' + timeValue[1]).diff(
            dayjs(fomatDate(dateValue[0]) + ' ' + timeValue[0]),
            'hour'
        );
        setTotalTime(val);
        setTotalPrice(arrprice && arrprice * val);
    }, [timeValue, dateValue, arrprice]);

    const onDeleteCarInRequest = async (carId: string) => {
        try {
            const res = await axiosInstance.put<RequestModelFull>('/request/userDeleteCarInRequest', {
                requestId: requestData?._id,
                car: carId,
            });
            setRequestData(res.data);
            toast.success('Delete Successful');
        } catch (err) {
            toast.error('Fail to delete !!');
        }
    };

    console.log('Render - addressBooking:', addressBooking);

    return (
        <div className="bg-white p-10 rounded-lg shadow-md">
            <div className="flex">
                {/* Phần Form */}
                <div className="w-2/5 pr-8 border-r border-gray-200">
                    <Form className="w-full" form={form} onFinish={onBooking}>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Họ và tên</span>}
                                name="userName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" disabled />
                            </Form.Item>
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Email</span>}
                                name="email"
                                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" disabled />
                            </Form.Item>
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Số điện thoại</span>}
                                name="phoneNumber"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" disabled />
                            </Form.Item>
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Địa chỉ</span>}
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input className="border border-blue-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200" disabled />
                            </Form.Item>
                        </div>
                        <div className="mb-8">
                            <Form.Item
                                label={<span className="text-blue-600 font-semibold">Bạn muốn thuê tài xế:</span>}
                                name="isRequestDriver"
                                rules={[{ required: true, message: 'Vui lòng chọn tùy chọn!' }]}
                            >
                                <Radio.Group className="text-blue-600" options={requestDriver} disabled />
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
                                element={
                                    <CarCalendar
                                        setDateValue={getDateValue}
                                        setTimeValue={getTimeValue}
                                        onSubmit={() => setIsOpenModalN(false)}
                                    />
                                }
                            />
                        </div>
                        <div>
                            <Form.Item
                                name="addressSearch"
                                rules={[{ required: true, message: 'Vui lòng chọn vị trí nhận xe!' }]}
                            >
                                {/* <AddressSearch
                                    addressBooking={setAddressBooking}
                                    title="Vị trí nhận xe"
                                    isRequire={true}
                                    value={addressBooking} // Sử dụng addressBooking thay vì requestData?.pickUpLocation
                                /> */}
                                <Input value={requestData?.pickUpLocation} disabled /> {/* Giữ để debug */}
                            </Form.Item>
                        </div>
                        <div className="text-gray-700 font-medium">
                            <div className="flex justify-between">
                                Tổng thời gian thuê: <span className="text-blue-900">{totalTime}h</span>
                            </div>
                            <div className="flex justify-between">
                                Thuế VAT:{' '}
                                <span className="text-blue-900">
                                    {totalPrice && (totalPrice * 0.1 * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                Tổng số tiền:{' '}
                                <span className="text-blue-900">
                                    {totalPrice && (totalPrice * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </span>
                            </div>
                        </div>
                    </Form>

                    <div className="w-full flex justify-end mt-6 gap-4">
                        {/* <Button
                            type="primary"
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
                            onClick={() => {
                                toast.info('Đã từ chối yêu cầu');
                            }}
                        >
                            Từ chối
                        </Button> */}
                        <Button
                            type="primary"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                            onClick={() => {
                                toast.success('Đã gia hạn thêm');
                            }}
                        >
                            Gia hạn thêm
                        </Button>
                    </div>
                </div>

                {/* Phần List Item */}
                <div className="w-3/5 pl-8">
                    {requestData?.car && requestData.car.length > 0 ? (
                        <div className="flex flex-wrap">
                            {requestData.car.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center border-b border-blue-200 w-full mb-4 p-4 rounded-md shadow-sm"
                                >
                                    <img
                                        src={`http://localhost:3030${item?.images[0]}`}
                                        alt={item.carName}
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <h6 className="text-sm font-semibold text-blue-800">
                                            {item.carName} {item.carVersion}
                                        </h6>
                                        <ul className="space-y-1">
                                            <li>
                                                Giá thuê: <span className="font-medium text-blue-700">{item.price}k / 1h</span>
                                            </li>
                                            <li>
                                                Biển số: <span className="font-medium text-blue-700">{item.licensePlateNumber}</span>
                                            </li>
                                            <li>
                                                Số chỗ: <span className="font-medium text-blue-700">{item.numberOfSeat}</span>
                                            </li>
                                        </ul>
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

export default RequestInExpire;