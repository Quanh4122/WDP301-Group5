import { Select, Input } from 'antd';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { RequestModelFull } from '../checkout/models'; // Giả định đây là file định nghĩa kiểu
import axiosInstance from '../utils/axios'; // Giả định đây là axios instance đã được cấu hình
import ListRequestPending from './components/ListRequestPending';
import { statusRequestAdminView } from '../../../constants'; // Giả định đây là danh sách các trạng thái

const { Option } = Select;

const AdminRequest: React.FC = () => {
    const [requestst2, setRequestSt2] = useState<RequestModelFull[]>([]);
    const [requestst3, setRequestSt3] = useState<RequestModelFull[]>([]);
    const [requestst4, setRequestSt4] = useState<RequestModelFull[]>([]);
    const [requestst5, setRequestSt5] = useState<RequestModelFull[]>([]);
    const [requestst6, setRequestSt6] = useState<RequestModelFull[]>([]);
    const [requestst7, setRequestSt7] = useState<RequestModelFull[]>([]);
    const [requestst8, setRequestSt8] = useState<RequestModelFull[]>([]);
    const [dataDisplay, setDataDisplay] = useState<RequestModelFull[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('Đã cọc tiền giữ chỗ');
    const [searchEmail, setSearchEmail] = useState<string>('');

    const optionRequest = [
        { label: 'Đang thực hiện', value: 'Đang thực hiện' },
        { label: 'Đang chờ đánh giá', value: 'Đang chờ đánh giá' },
        { label: 'Đang chờ người dùng thanh toán', value: 'Đang chờ người dùng thanh toán' },
        { label: 'Hoàn thành thanh toán', value: 'Hoàn thành thanh toán' },
    ];

    useEffect(() => {
        getListRequest();
    }, []);

    const getListRequest = async (): Promise<void> => {
        try {
            const res = await axiosInstance.get<RequestModelFull[]>('/request/getListAdminRequest');
            setListRequest(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const setListRequest = (listRequest: RequestModelFull[]): void => {
        const requestSt2 = listRequest.filter((item) => item.requestStatus === '2');
        const requestSt3 = listRequest.filter((item) => item.requestStatus === '3');
        const requestSt4 = listRequest.filter((item) => item.requestStatus === '4');
        const requestSt5 = listRequest.filter((item) => item.requestStatus === '5');
        const requestSt6 = listRequest.filter((item) => item.requestStatus === '6');
        const requestSt7 = listRequest.filter((item) => item.requestStatus === '7');
        const requestSt8 = listRequest.filter((item) => item.requestStatus === '8');

        setRequestSt2(requestSt2);
        setRequestSt3(requestSt3);
        setRequestSt4(requestSt4);
        setRequestSt5(requestSt5);
        setRequestSt6(requestSt6);
        setRequestSt7(requestSt7);
        setRequestSt8(requestSt8);

        // Khởi tạo dataDisplay ban đầu
        setDataDisplay(requestSt2); // Mặc định hiển thị requestSt2
    };

    const onChangeValue = (value: string): void => {
        setSelectedFilter(value);
        let filteredData: RequestModelFull[] = [];
        if (value === 'Đã cọc tiền giữ chỗ') {
            filteredData = requestst2;
        } else if (value === 'Đến thời gian giao xe') {
            filteredData = requestst3;
        } else if (value === 'Đã giao xe và nhận tiền') {
            filteredData = requestst4;
        } else if (value === 'Khách hàng bỏ thuê xe') {
            filteredData = requestst5;
        } else if (value === 'Đến thời gian trả xe') {
            filteredData = requestst6;
        } else if (value === 'Đã trả xe chờ đánh giá') {
            filteredData = requestst7;
        } else {
            filteredData = requestst8;
        }

        // Lọc dữ liệu theo email nếu có giá trị tìm kiếm
        if (searchEmail) {
            filteredData = filteredData.filter((item) =>
                item.emailRequest && item.emailRequest.toLowerCase().includes(searchEmail.toLowerCase())
            );
        }
        setDataDisplay(filteredData);
    };

    const handleSearchEmail = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setSearchEmail(value);

        // Lọc lại dataDisplay dựa trên email
        let filteredData = [...dataDisplay];
        if (value) {
            filteredData = filteredData.filter((item) =>
                item.emailRequest?.toLowerCase().includes(value.toLowerCase())
            );
        } else {
            // Nếu không có giá trị tìm kiếm, hiển thị lại dữ liệu theo selectedFilter
            onChangeValue(selectedFilter);
            return;
        }
        setDataDisplay(filteredData);
    };

    return (
        <div className="w-full min-h-screen p-5 bg-gray-100">
            <div className="mb-4 bg-white shadow-md p-4 rounded-md flex space-x-4">
                <Select
                    options={statusRequestAdminView}
                    defaultValue={'Đã cọc tiền giữ chỗ'}
                    onChange={onChangeValue}
                    className="w-48"
                />
                <Input
                    placeholder="Tìm kiếm theo email"
                    value={searchEmail}
                    onChange={handleSearchEmail}
                    className="w-64"
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