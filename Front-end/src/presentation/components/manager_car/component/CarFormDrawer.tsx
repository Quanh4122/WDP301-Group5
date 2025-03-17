import React, { useState } from "react";
import { Drawer, Form, Input, Select, Button, InputNumber, Radio, Upload, message } from "antd";
import GradeIcon from "@mui/icons-material/Grade";
import { InboxOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import { CarModelsNoId } from "../../car_list/model";
import { toast } from "react-toastify";

interface CarType {
    _id: string;
    bunkBed: boolean;
    flue: number;
    transmissionType: boolean;
}

interface Car {
    _id: string;
    carName: string;
    color: string;
    images: string[];
    carStatus: boolean;
    licensePlateNumber: string;
    price: number;
    carVersion: number;
    carType: CarType;
    numberOfSeat: number;
}

interface CarFormDrawerProps {
    isDrawerVisible: boolean;
    setIsDrawerVisible: (visible: boolean) => void;
    form: any; // Sử dụng any để tương thích với Form instance của Ant Design
    carEdit?: Car;
    setCarList: (cars: Car[] | undefined) => void;
}

const CarFormDrawer: React.FC<CarFormDrawerProps> = ({
    isDrawerVisible,
    setIsDrawerVisible,
    form,
    carEdit,
    setCarList,
}) => {
    const [arrFile, setArrFile] = useState<File[]>();
    const [isDisplayBunkbed, setIsDisplayBunkbed] = useState<boolean>(false);

    const radioBunkBed = [
        { label: "Giường nằm", value: true },
        { label: "Ghế ngồi", value: false },
    ];
    const radioTransmissionType = [
        { label: "Số tự động", value: true },
        { label: "Số sàn", value: false },
    ];
    const radioFlue = [
        { label: "Máy Xăng", value: 1 },
        { label: "Máy Dầu", value: 2 },
        { label: "Máy Điện", value: 3 },
    ];
    const numberOfSeat = [
        { label: 5, value: 5 },
        { label: 7, value: 7 },
        { label: 9, value: 9 },
    ];

    const iniateValue = {
        _id: carEdit?._id,
        carName: carEdit?.carName,
        color: carEdit?.color,
        images: carEdit?.images,
        carStatus: carEdit?.carStatus,
        licensePlateNumber: carEdit?.licensePlateNumber,
        price: carEdit?.price,
        carVersion: carEdit?.carVersion,
        carType: carEdit?.carType,
        numberOfSeat: carEdit?.numberOfSeat
    }

    const onFinish = (value: any) => {
        console.log(value.images);
        const listImage = value.images?.fileList?.map((item: any) => item.name) || [];
        const data: CarModelsNoId = {
            carName: form.getFieldValue("carName"),
            color: form.getFieldValue("color"),
            carStatus: false,
            licensePlateNumber: form.getFieldValue("licensePlateNumber"),
            price: form.getFieldValue("price"),
            carVersion: form.getFieldValue("carVersion"),
            numberOfSeat: form.getFieldValue("numberOfSeat"),
            carType: {
                bunkBed: form.getFieldValue("bunkBed") == true ? true : false,
                flue: form.getFieldValue("flue"),
                transmissionType: form.getFieldValue("transmissionType"),
            },
            images: arrFile,
        };
        console.log(data)
        createCar(data);
    };

    const createCar = async (value: CarModelsNoId) => {
        const formData = new FormData();
        formData.append("carName", value.carName);
        formData.append("color", value.color);
        formData.append("carStatus", String(value.carStatus));
        formData.append("licensePlateNumber", value.licensePlateNumber);
        formData.append("price", String(value.price));
        formData.append("carVersion", String(value.carVersion));
        formData.append("numberOfSeat", String(value.numberOfSeat));
        formData.append("bunkBed", String(value.carType.bunkBed));
        formData.append("flue", String(value.carType.flue));
        formData.append("transmissionType", String(value.carType.transmissionType));
        value.images?.forEach((element) => {
            formData.append("images", element);
        });
        await axiosInstance
            .post("/car/createCar", formData)
            .then((res) => {
                toast.success("Successfull !!");
                handleCancel();
            })
            .catch((err) => console.log(err));
    };

    const handleOk = async (values: any) => {
        try {
            await axiosInstance.post("/car/create", values);
            message.success("Xe đã được tạo thành công!");
            setIsDrawerVisible(false);
            form.resetFields();
            const res = await axiosInstance.get("/car/getAllCar");
            setCarList(res.data);
        } catch (err) {
            message.error("Có lỗi xảy ra khi tạo xe!");
            console.log(err);
        }
    };

    const onChangeGetFile = (files: any) => {
        const arr: File[] = files.fileList.map((item: any) => item.originFileObj);
        setArrFile(arr);
    };

    const handleCancel = () => {
        setIsDrawerVisible(false);
        form.resetFields();
    };

    return (
        <Drawer
            title={
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Tạo xe mới
                </h3>
            }
            placement="right"
            onClose={handleCancel}
            open={isDrawerVisible}
            width={600}
            className="rounded-lg"
        >
            <div className="bg-white p-4 rounded-lg shadow-lg overflow-hidden">
                <div className="text-2xl font-semibold text-sky-600 mb-4">Thêm xe</div>
                <Form
                    initialValues={iniateValue}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                    className="space-y-4"
                    labelCol={{ className: "text-gray-700 font-medium mb-1" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Form.Item
                            label="Tên xe"
                            rules={[{ required: true, message: "Vui lòng nhập tên xe!" }]}
                            name="carName"
                        >
                            <Input
                                className="w-full h-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                placeholder="Tên xe"
                                suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Màu xe"
                            rules={[{ required: true, message: "Vui lòng nhập màu xe!" }]}
                            name="color"
                        >
                            <Input
                                className="w-full h-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                placeholder="Màu xe"
                                suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Biển số xe"
                            rules={[{ required: true, message: "Vui lòng nhập biển số xe!" }]}
                            name="licensePlateNumber"
                        >
                            <Input
                                className="w-full h-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                placeholder="Biển số xe"
                                suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Đời xe"
                            rules={[{ required: true, message: "Vui lòng nhập đời xe!" }]}
                            name="carVersion"
                        >
                            <InputNumber
                                className="w-full h-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                placeholder="Đời xe"
                                suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Số chỗ"
                            rules={[{ required: true, message: "Vui lòng chọn số chỗ!" }]}
                            name="numberOfSeat"
                        >
                            <Select
                                options={numberOfSeat}
                                className="w-full h-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                placeholder="Số chỗ"
                                onChange={(val) => (val > 7 ? setIsDisplayBunkbed(true) : setIsDisplayBunkbed(false))}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá thuê 4h"
                            rules={[{ required: true, message: "Vui lòng nhập giá thuê 4h!" }]}
                            name="price"
                        >
                            <InputNumber
                                className="w-full h-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                placeholder="Giá thuê 4h"
                                suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Loại nhiên liệu"
                            rules={[{ required: true, message: "Vui lòng chọn nhiên liệu!" }]}
                            name="flue"
                            className="col-span-2"
                        >
                            <Radio.Group
                                options={radioFlue}
                                className="flex flex-wrap gap-2"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Loại truyền động"
                            rules={[{ required: true, message: "Vui lòng chọn loại truyền động!" }]}
                            name="transmissionType"
                            className="col-span-2"
                        >
                            <Radio.Group
                                options={radioTransmissionType}
                                className="flex flex-wrap gap-2"
                            />
                        </Form.Item>
                        {isDisplayBunkbed && (
                            <Form.Item
                                label="Loại giường"
                                rules={[{ required: true, message: "Vui lòng chọn loại giường!" }]}
                                name="bunkBed"
                                className="col-span-2"
                            >
                                <Radio.Group
                                    options={radioBunkBed}
                                    className="flex flex-wrap gap-2"
                                />
                            </Form.Item>
                        )}
                    </div>
                    <Form.Item
                        label="Thêm ảnh"
                        rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
                        name="images"
                        className="mt-4"
                    >
                        <Upload.Dragger
                            multiple
                            onChange={(files) => onChangeGetFile(files)}
                            className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-4 text-center hover:border-blue-500 transition duration-200"
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined className="text-blue-500 text-3xl" />
                            </p>
                            <p className="ant-upload-text text-gray-600 text-sm">
                                Click or drag file to this area to upload
                            </p>
                            <p className="text-xs text-gray-400">Support multiple files</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200 mt-4"
                        >
                            Tạo xe
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Drawer>
    );
};

export default CarFormDrawer;