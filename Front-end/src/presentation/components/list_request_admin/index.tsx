import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { RequestModelFull } from '../checkout/models';
import axiosInstance from '../utils/axios';
import ListRequestPending from './components/ListRequestPending';
import { statusRequestAdminView } from '../../../constants';

const AdminRequest = () => {
    const [requestst2, setRequestSt2] = useState<RequestModelFull[]>([]);
    const [requestst3, setRequestSt3] = useState<RequestModelFull[]>([]);
    const [requestst4, setRequestSt4] = useState<RequestModelFull[]>([]);
    const [requestst5, setRequestSt5] = useState<RequestModelFull[]>([]);
    const [requestst6, setRequestSt6] = useState<RequestModelFull[]>([]);
    const [requestst7, setRequestSt7] = useState<RequestModelFull[]>([]);
    const [requestst8, setRequestSt8] = useState<RequestModelFull[]>([]);
    const [requestDataInAdminFee, setRequestInAdminFee] = useState<RequestModelFull[]>([]);
    const [requestDataInAdminWaitToPay, setRequestInAdminWaitToPay] = useState<RequestModelFull[]>([]);
    const [requestDataDoneBill, setRequestDoneBill] = useState<RequestModelFull[]>([]);
    const [dataDisplay, setDataDisplay] = useState<RequestModelFull[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('Đã cọc tiền giữ chỗ'); // Quản lý trạng thái chọn

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
        const requestSt2 = listRequest.filter((item) => item.requestStatus == '2');
        const requestSt3 = listRequest.filter((item) => item.requestStatus == '3');
        const requestSt4 = listRequest.filter((item) => item.requestStatus == '4');
        const requestSt5 = listRequest.filter((item) => item.requestStatus == '5');
        const requestSt6 = listRequest.filter((item) => item.requestStatus == '6');
        const requestSt7 = listRequest.filter((item) => item.requestStatus == '7');
        const requestSt8 = listRequest.filter((item) => item.requestStatus == '8');

        setRequestSt2(requestSt2)
        setRequestSt3(requestSt3)
        setRequestSt4(requestSt4)
        setRequestSt5(requestSt5)
        setRequestSt6(requestSt6)
        setRequestSt7(requestSt7)
        setRequestSt8(requestSt8)

    };

    const onChangeValue = (value: string) => {
        setSelectedFilter(value);
        if (value === 'Đã cọc tiền giữ chỗ') {
            setDataDisplay(requestst2);
        } else if (value === 'Đến thời gian giao xe') {
            setDataDisplay(requestst3);
        } else if (value === 'Đã giao xe và nhận tiền') {
            setDataDisplay(requestst4);
        } else if (value === "Khách hàng bỏ thuê xe") {
            setDataDisplay(requestst5);
        } else if (value === 'Đến thời gian trả xe') {
            setDataDisplay(requestst6);
        } else if (value == 'Đã trả xe chờ đánh giá') {
            setDataDisplay(requestst7);
        } else {
            setDataDisplay(requestst8);
        }
    };

    return (
        <div className="w-full min-h-screen p-5 bg-gray-100">
            <div className="mb-4 bg-white shadow-md p-4 rounded-md">
                <Select
                    options={statusRequestAdminView}
                    defaultValue={'Đã cọc tiền giữ chỗ'}
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