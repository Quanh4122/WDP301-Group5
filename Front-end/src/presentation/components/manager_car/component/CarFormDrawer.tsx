import React, { useEffect, useState } from "react";
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
    form: any;
    carDetail?: Car | undefined;
    setCarList: (cars: Car[] | undefined) => void;
}

// Hàm chuyển URL thành File
const urlToFile = async (url: string, fileName: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
};

const CarFormDrawer: React.FC<CarFormDrawerProps> = ({
    isDrawerVisible,
    setIsDrawerVisible,
    form,
    carDetail,
    setCarList,
}) => {
    const [arrFile, setArrFile] = useState<File[]>([]);
    const [fileList, setFileList] = useState<any[]>([]);
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

    useEffect(() => {
        if (isDrawerVisible && carDetail) {
            form.setFieldsValue({
                carName: carDetail.carName,
                color: carDetail.color,
                licensePlateNumber: carDetail.licensePlateNumber,
                carVersion: carDetail.carVersion,
                numberOfSeat: carDetail.numberOfSeat,
                price: carDetail.price,
                flue: carDetail.carType.flue,
                transmissionType: carDetail.carType.transmissionType,
                bunkBed: carDetail.carType.bunkBed,
            });
            setIsDisplayBunkbed(carDetail.numberOfSeat > 7);

            const defaultFileList = carDetail.images.map((url, index) => ({
                uid: `-${index}`,
                name: `image-${index}`,
                status: "done",
                url: `http://localhost:3030${url}`,
            }));
            setFileList(defaultFileList);
            setArrFile([]);
        } else if (!carDetail) {
            form.resetFields();
            setFileList([]);
            setArrFile([]);
            setIsDisplayBunkbed(false);
        }
    }, [carDetail, form, isDrawerVisible]);

    const onFinish = (value: any) => {
        const val = form.getFieldValue("numberOfSeat") > 7 ? form.getFieldValue("bunkBed") : false;
        const data: CarModelsNoId = {
            carName: form.getFieldValue("carName"),
            color: form.getFieldValue("color"),
            carStatus: false,
            licensePlateNumber: form.getFieldValue("licensePlateNumber"),
            price: form.getFieldValue("price"),
            carVersion: form.getFieldValue("carVersion"),
            numberOfSeat: form.getFieldValue("numberOfSeat"),
            carType: {
                bunkBed: val,
                flue: form.getFieldValue("flue"),
                transmissionType: form.getFieldValue("transmissionType"),
            },
            images: arrFile.length > 0 ? arrFile : carDetail?.images, // Dùng arrFile nếu có tệp mới, nếu không giữ images cũ
        };
        if (carDetail) {
            updateCar(data, carDetail._id);
        } else {
            createCar(data);
        }
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
                toast.success("Tạo xe thành công !!");
                handleCancel();
            })
            .catch((err) => console.log(err));
    };

    const updateCar = async (value: CarModelsNoId, carId: string) => {
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

        if (value.images && value.images.length > 0) {
            const imageFiles = await Promise.all(
                value.images.map(async (element, index) => {
                    if (typeof element === "string") {
                        const fullUrl = `http://localhost:3030${element}`;
                        return await urlToFile(fullUrl, `image-${index}.jpg`);
                    } else {
                        return element;
                    }
                })
            );
            imageFiles.forEach((file) => {
                formData.append("images", file);
            });
        }

        await axiosInstance
            .put(`/car/updateCar/${carId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                toast.success("Cập nhật xe thành công !!");
                handleCancel();
            })
            .catch((err) => console.log(err));
    };

    const onChangeGetFile = (info: any) => {
        const newFileList = info.fileList;
        setFileList(newFileList);

        const newFiles: File[] = newFileList
            .filter((file: any) => file.originFileObj)
            .map((file: any) => file.originFileObj);
        setArrFile(newFiles);
    };

    const handleCancel = () => {
        setIsDrawerVisible(false);
    };

    return (
        <Drawer
            title={
                <h3 className="text-xl font-semibold text-gray-800 border-gray-200 pb-2">
                    {carDetail ? "Chỉnh sửa xe" : "Tạo xe mới"}
                </h3>
            }
            placement="right"
            onClose={handleCancel}
            open={isDrawerVisible}
            width={600}
            className="rounded-lg"
        >
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <Form
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                        className="space-y-4"
                        labelCol={{ className: "text-gray-700 font-medium mb-1" }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Form.Item
                                rules={[{ required: true, message: "Vui lòng nhập tên xe!" }]}
                                label="Tên xe"
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
                                label="Giá thuê 1h"
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
                                <Radio.Group options={radioFlue} className="flex flex-wrap gap-2" />
                            </Form.Item>
                            <Form.Item
                                label="Loại truyền động"
                                rules={[{ required: true, message: "Vui lòng chọn loại truyền động!" }]}
                                name="transmissionType"
                                className="col-span-2"
                            >
                                <Radio.Group options={radioTransmissionType} className="flex flex-wrap gap-2" />
                            </Form.Item>
                            {isDisplayBunkbed && (
                                <Form.Item
                                    label="Loại giường"
                                    rules={[{ required: true, message: "Vui lòng chọn loại giường!" }]}
                                    name="bunkBed"
                                    className="col-span-2"
                                >
                                    <Radio.Group options={radioBunkBed} className="flex flex-wrap gap-2" />
                                </Form.Item>
                            )}
                        </div>
                        <Form.Item
                            label="Thêm ảnh"
                            rules={[{ required: !carDetail, message: "Vui lòng tải lên hình ảnh!" }]}
                            name="images"
                            className="mt-4"
                        >
                            <Upload.Dragger
                                multiple
                                fileList={fileList}
                                onChange={onChangeGetFile}
                                beforeUpload={() => false}
                                className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-4 text-center hover:border-blue-500 transition duration-200 max-h-40 overflow-y-auto"
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
                        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
                                >
                                    {carDetail ? "Lưu" : "Tạo xe"}
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </Drawer>
    );
};

export default CarFormDrawer;