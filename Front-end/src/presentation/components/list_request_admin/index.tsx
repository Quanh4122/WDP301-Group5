import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { RequestModelFull } from '../checkout/models';
import axiosInstance from '../utils/axios';
import ListRequestPending from './components/ListRequestPending';

const AdminRequest = () => {
    const [requestDataPending, setRequestDataPending] = useState<RequestModelFull[] | []>([]);
    const [requestDataAccepted, setRequestDataAccepted] = useState<RequestModelFull[] | []>([]);
    const [requestDataDenied, setRequestDataDenied] = useState<RequestModelFull[] | []>([]);
    const [dataDisplay, setDataDisplay] = useState<RequestModelFull[] | []>(requestDataPending); // Initialize with pending data

    const optionRequest = [
        { label: "Đang thực hiện", value: "Đang thực hiện" },
        { label: "Chờ xác nhận thanh toán", value: "Chờ xác nhận thanh toán" },
        { label: "Hoàn thành thanh toán", value: "Hoàn thành thanh toán" },
    ];

    useEffect(() => {
        getListRequest();
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
        setRequestDataPending(listRequest.filter((item) => item.requestStatus === '2'));
        setRequestDataAccepted(listRequest.filter((item) => item.requestStatus === '4'));
        setRequestDataDenied(listRequest.filter((item) => item.requestStatus === '5'));
    };

    const onChangeValue = (value: string) => {
        if (value === 'Đang thực hiện') {
            setDataDisplay(requestDataPending);
        } else if (value === 'Chờ xác nhận thanh toán') {
            setDataDisplay(requestDataAccepted);
        } else {
            setDataDisplay(requestDataDenied);
        }
    };

    return (
        <div className="w-full min-h-screen p-5 bg-gray-100">
            <div className="mb-4 bg-white shadow-md p-4 rounded-md">
                <Select
                    options={optionRequest}
                    defaultValue={'Pending'}
                    onChange={(value) => onChangeValue(value)}
                    className="w-48"
                // Các style của select

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