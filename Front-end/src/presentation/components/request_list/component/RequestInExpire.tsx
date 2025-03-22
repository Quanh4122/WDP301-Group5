import React, { useEffect, useState } from 'react';
import { RequestModelFull } from '../../checkout/models';
import { Button, Form, Upload, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import AddressSearch from './AddressSearch';
import dayjs from 'dayjs';

const RequestInExpire: React.FC = () => {
    const [requestData, setRequestData] = useState<RequestModelFull | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [requestId, setRequestId] = useState<string | null>(null);
    const [billId, setBillId] = useState<string | null>(null);
    const [form] = useForm();
    const [addressBooking, setAddressBooking] = useState<string>('');
    const [arrFile, setArrFile] = useState<File[]>([]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const requestId = queryParams.get('requestId');
        const billId = queryParams.get('billId');
        setRequestId(requestId);
        setBillId(billId);
        getRequestById(requestId);
    }, [location.search]);

    const getRequestById = async (requestId?: string | null) => {
        if (requestId) {
            try {
                setLoading(true);
                const res = await axiosInstance.get<RequestModelFull>('/request/getRequestById', {
                    params: { key: requestId },
                });
                setRequestData(res.data);
            } catch (err) {
                console.log(err);
                toast.error('Không thể tải thông tin yêu cầu');
            } finally {
                setLoading(false);
            }
        }
    };

    const onChangeGetFile = ({ fileList }: any) => {
        const files: File[] = fileList.map((item: any) => item.originFileObj);
        setArrFile(files);
    };

    const onBooking = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('request', requestId || '');
            formData.append('bill', billId || '');
            formData.append('realDropLocation', addressBooking);
            const dateNow = dayjs().format("YYYY/MM/DD HH:mm")
            formData.append('realTimeDrop', dateNow);
            arrFile.forEach((file) => formData.append('images', file));

            // Gửi request lên server (thêm logic API nếu cần)
            await axiosInstance.post('/bill/userConfirmDoneBill', formData)
                .then(res => console.log(res.data))
                .catch(err => console.log(err))

            // toast.success('Xác nhận trả xe thành công!');
            // form.resetFields();
            // setAddressBooking('');
            // setArrFile([]);

        } catch (error) {
            console.log(error);
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Xác Nhận Trả Xe
                </h2>

                {loading && (
                    <div className="flex justify-center mb-6">
                        <Spin size="large" />
                    </div>
                )}

                <Form
                    form={form}
                    onFinish={onBooking}
                    layout="vertical"
                    className="space-y-6"
                >
                    {/* Input địa chỉ */}
                    <Form.Item
                        name="addressSearch"
                        label={<span className="font-medium text-gray-700">Vị trí nhận xe</span>}
                        rules={[{ required: true, message: 'Vui lòng chọn vị trí nhận xe' }]}
                    >
                        <AddressSearch
                            addressBooking={setAddressBooking}
                            isRequire={true}
                            value={addressBooking}
                        />
                    </Form.Item>

                    {/* Upload hình ảnh */}
                    <Form.Item
                        name="images"
                        label={<span className="font-medium text-gray-700">Ảnh xác nhận</span>}
                        rules={[{ required: true, message: 'Vui lòng tải lên ít nhất một ảnh' }]}
                    >
                        <Upload.Dragger
                            multiple
                            onChange={onChangeGetFile}
                            beforeUpload={() => false} // Ngăn upload tự động
                            className="border-gray-300 rounded-md hover:border-blue-500 transition"
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined className="text-blue-500 text-4xl" />
                            </p>
                            <p className="ant-upload-text text-gray-600">
                                Kéo thả hoặc nhấn để tải ảnh xe lên
                            </p>
                            <p className="ant-upload-hint text-gray-400">
                                Hỗ trợ nhiều file ảnh
                            </p>
                        </Upload.Dragger>
                    </Form.Item>

                    {/* Nút hành động */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={() => navigate(-1)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md px-6 py-2 transition"
                        >
                            Hủy
                        </Button>
                        <Button
                            htmlType="submit"
                            type="primary"
                            loading={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 transition"
                        >
                            Hoàn thành
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default RequestInExpire;