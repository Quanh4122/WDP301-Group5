import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { RequestModelFull } from '../checkout/models';
import axiosInstance from '../utils/axios';
import ListRequestPending from './components/ListRequestPending';

const AdminRequest = () => {
    const [requestDataInBooking, setRequestInBooking] = useState<RequestModelFull[]>([]);
    const [requestDataInAdminFee, setRequestInAdminFee] = useState<RequestModelFull[]>([]);
    const [requestDataInAdminWaitToPay, setRequestInAdminWaitToPay] = useState<RequestModelFull[]>([]);
    const [requestDataDoneBill, setRequestDoneBill] = useState<RequestModelFull[]>([]);
    const [dataDisplay, setDataDisplay] = useState<RequestModelFull[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('Đang thực hiện'); // Quản lý trạng thái chọn

    const optionRequest = [
        { label: 'Đang thực hiện', value: 'Đang thực hiện' },
        { label: 'Đang chờ đánh giá', value: 'Đang chờ đánh giá' },
        { label: 'Đang chờ người dùng thanh toán', value: 'Đang chờ người dùng thanh toán' },
        { label: 'Hoàn thành thanh toán', value: 'Hoàn thành thanh toán' },
    ];

    useEffect(() => {
        getListRequest();
    }, []);

    const getListRequest = async () => {
        try {
            const res = await axiosInstance.get('request/getListAdminRequest');
            setListRequest(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const setListRequest = (listRequest: RequestModelFull[]) => {
        const inBooking = listRequest.filter((item) => item.requestStatus === '2');
        const inAdminFee = listRequest.filter((item) => item.requestStatus === '4' || item.requestStatus === '3');
        const inAdminWaitToPay = listRequest.filter((item) => item.requestStatus === '5');
        const doneBill = listRequest.filter((item) => item.requestStatus === '6');

        setRequestInBooking(inBooking);
        setRequestInAdminFee(inAdminFee);
        setRequestInAdminWaitToPay(inAdminWaitToPay);
        setRequestDoneBill(doneBill);

        // Cập nhật dataDisplay dựa trên selectedFilter hiện tại
        updateDataDisplay(selectedFilter, {
            inBooking,
            inAdminFee,
            inAdminWaitToPay,
            doneBill,
        });
    };

    const updateDataDisplay = (
        value: string,
        data: {
            inBooking: RequestModelFull[];
            inAdminFee: RequestModelFull[];
            inAdminWaitToPay: RequestModelFull[];
            doneBill: RequestModelFull[];
        }
    ) => {
        if (value === 'Đang thực hiện') {
            setDataDisplay(data.inBooking);
        } else if (value === 'Đang chờ đánh giá') {
            setDataDisplay(data.inAdminFee);
        } else if (value === 'Đang chờ người dùng thanh toán') {
            setDataDisplay(data.inAdminWaitToPay);
        } else {
            setDataDisplay(data.doneBill);
        }
    };

    const onChangeValue = (value: string) => {
        setSelectedFilter(value);
        if (value === 'Đang thực hiện') {
            setDataDisplay(requestDataInBooking);
        } else if (value === 'Đang chờ đánh giá') {
            setDataDisplay(requestDataInAdminFee);
        } else if (value === 'Đang chờ người dùng thanh toán') {
            setDataDisplay(requestDataInAdminWaitToPay);
        } else {
            setDataDisplay(requestDataDoneBill);
        }
    };

    return (
        <div className="w-full min-h-screen p-5 bg-gray-100">
            <div className="mb-4 bg-white shadow-md p-4 rounded-md">
                <Select
                    options={optionRequest}
                    defaultValue={'Đang thực hiện'}
                    onChange={onChangeValue}
                    className="w-48"
                />
            </div>
            <div className="bg-white shadow-md p-4 rounded-md">
                {dataDisplay && dataDisplay.length > 0 ? (
                    <ListRequestPending requestList={dataDisplay} />
                ) : (
                    <div className="text-center text-gray-500">Không có dữ liệu</div>
                )}
            </div>
        </div>
    );
};

export default AdminRequest;