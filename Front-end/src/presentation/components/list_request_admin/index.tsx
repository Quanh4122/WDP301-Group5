import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { RequestModelFull } from '../checkout/models';
import axiosInstance from '../utils/axios';
import ListRequestPending from './components/ListRequestPending';

const AdminRequest = () => {
    const [requestDataPending, setRequestDataPending] = useState<RequestModelFull[] | []>([]);
    const [requestDataAccepted, setRequestDataAccepted] = useState<RequestModelFull[] | []>([]);
    const [requestDataDenied, setRequestDataDenied] = useState<RequestModelFull[] | []>([]);
    const [requestDataInBooking, setRequestInBooking] = useState<RequestModelFull[] | []>([]);
    const [requestDataInAdminFee, setRequestInAdminFee] = useState<RequestModelFull[] | []>([]);
    const [requestDataInAdminWatiToPay, setRequestInAdminWatiToPay] = useState<RequestModelFull[] | []>([]);
    const [requestDataDoneBill, setRequestDoneBill] = useState<RequestModelFull[] | []>([]);
    const [dataDisplay, setDataDisplay] = useState<RequestModelFull[] | []>(requestDataInBooking); // Initialize with pending data

    const optionRequest = [
        { label: "Đang thực hiện", value: "Đang thực hiện" },
        { label: "Đang chờ đánh giá", value: "Đang chờ đánh giá" },
        { label: "Đang chờ người dùng thanh toán", value: "Đang chờ người dùng thanh toán" },
        { label: "Hoàn thành thanh toán", value: "Hoàn thành thanh toán" },
    ];

    useEffect(() => {
        getListRequest();
        setDataDisplay(requestDataInBooking)
    }, []);

    useEffect(() => {
        setDataDisplay(requestDataPending);
    }, [requestDataPending])

    const getListRequest = async () => {
        try {
            const res = await axiosInstance.get('request/getListAdminRequest');
            setListRequest(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const setListRequest = (listRequest: RequestModelFull[]) => {
        // Sửa
        setRequestInBooking(listRequest.filter((item) => item.requestStatus == '2'))
        setRequestInAdminFee(listRequest.filter((item) => item.requestStatus == '4' || item.requestStatus == '3'))
        setRequestInAdminWatiToPay(listRequest.filter((item) => item.requestStatus == '5'))
        setRequestDoneBill(listRequest.filter((item) => item.requestStatus == '6'))
    };

    const onChangeValue = (value: string) => {
        if (value === 'Đang thực hiện') {
            setDataDisplay(requestDataInBooking);
        } else if (value === 'Đang chờ đánh giá') {
            setDataDisplay(requestDataInAdminFee);
        } else if (value === 'Đang chờ người dùng thanh toán') {
            setDataDisplay(requestDataInAdminWatiToPay);
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
                    onChange={(value) => onChangeValue(value)}
                    className="w-48"
                />
            </div>
            <div className="bg-white shadow-md p-4 rounded-md">
                {dataDisplay && dataDisplay.length > 0 ? (
                    <ListRequestPending requestList={dataDisplay || []} />
                ) : (
                    <div className="text-center text-gray-500">Không có dữ liệu</div>
                )}
            </div>
        </div>
    );
};

export default AdminRequest;