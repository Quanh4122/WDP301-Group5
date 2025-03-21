import { Button, Form, Input, InputNumber, Radio, Select, Upload } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import BannerCreateCar from '../../assets/banner-created-car.jpg'
import GradeIcon from '@mui/icons-material/Grade';
import { useForm } from "antd/es/form/Form";
import { CarModels, CarModelsNoId } from "../../car_list/model";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";

const CarCreate = () => {

    const [form] = useForm()
    const [arrFile, setArrFile] = useState<File[]>()
    const navigate = useNavigate()

    const radioBunkBed = [
        { label: "Giường nằm", value: true },
        { label: "Ghế ngồi", value: false }
    ]
    const radioTransmissionType = [
        { label: "Số tự động", value: true },
        { label: "Số sàn", value: false }
    ]

    const radioFlue = [
        { label: 'Máy Xăng', value: 1 },
        { label: 'Máy Dầu', value: 2 },
        { label: 'Máy Điện', value: 3 }
    ]

    const numberOfSeat = [
        { label: 5, value: 5 },
        { label: 7, value: 7 },
        { label: 9, value: 9 },
    ]
    const onFinish = (value: any) => {
        const data: CarModelsNoId = {
            carName: form.getFieldValue("carName"),
            color: form.getFieldValue("color"),
            carStatus: false,
            licensePlateNumber: form.getFieldValue("licensePlateNumber"),
            price: form.getFieldValue("price"),
            carVersion: form.getFieldValue("carVersion"),
            numberOfSeat: form.getFieldValue("numberOfSeat"),
            carType: {
                bunkBed: form.getFieldValue("bunkBed"),
                flue: form.getFieldValue("flue"),
                transmissionType: form.getFieldValue("transmissionType")
            },
            images: arrFile
        }
        createCar(data)
    }

    const createCar = async (value: CarModelsNoId) => {
        const formData = new FormData()
        formData.append("carName", value.carName)
        formData.append("color", value.color)
        formData.append("carStatus", String(value.carStatus))
        formData.append("licensePlateNumber", value.licensePlateNumber)
        formData.append("price", String(value.price))
        formData.append("carVersion", String(value.carVersion))
        formData.append("numberOfSeat", value.numberOfSeat)
        formData.append("bunkBed", String(value.carType.bunkBed))
        formData.append("flue", String(value.carType.flue))
        formData.append("transmissionType", String(value.carType.transmissionType))
        value.images?.forEach(element => {
            formData.append("images", element)
        });
        await axiosInstance.post("/car/createCar", formData)
            .then(res => {
                toast.success("Successfull !!")
                navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_LIST)
            })
            .catch(err => console.log(err))
    }

    const onChangeGetFile = (files: any) => {
        const arr: File[] = files.fileList.map((item: any) => (
            item.originFileObj
        ))
        setArrFile(arr)
    }
    return (
        <div className="w-full min-h-screen flex p-4 md:p-8 bg-gray-100">
            <div className="w-full md:w-2/5 px-4 md:px-8">
                <div className="text-2xl font-semibold text-sky-600 mb-4 md:mb-6">
                    Thêm xe
                </div>
                <Form
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            rules={[{ required: true }]}
                            name="carName"
                        >
                            <Input className="w-full" placeholder="Tên xe" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="color"
                        >
                            <Input className="w-full" placeholder="Màu xe" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="licensePlateNumber"
                        >
                            <Input className="w-full" placeholder="Biển số xe" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="carVersion"
                        >
                            <InputNumber className="w-full" placeholder="Đời xe" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="numberOfSeat"
                        >
                            <Select
                                options={numberOfSeat}
                                placeholder="Số chỗ"
                            />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="price"
                        >
                            <InputNumber className="w-full" placeholder="Giá thuê 4h" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="flue"
                            className="col-span-2"
                        >
                            <Radio.Group options={radioFlue} className="flex flex-wrap gap-2" />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="transmissionType"
                            className="col-span-2"
                        >
                            <Radio.Group options={radioTransmissionType} className="flex flex-wrap gap-2" />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="bunkBed"
                            className="col-span-2"
                        >
                            <Radio.Group options={radioBunkBed} className="flex flex-wrap gap-2" />
                        </Form.Item>
                    </div>
                    <Form.Item
                        rules={[{ required: true }]}
                        name="images"
                        className="mt-4"
                    >
                        <Upload.Dragger
                            multiple
                            onChange={(files) => onChangeGetFile(files)}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload car image</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full h-12 text-lg font-semibold mt-4 md:mt-6">
                        Tạo xe
                    </Button>
                </Form>
            </div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0 flex justify-center items-center">
                <img src={BannerCreateCar} alt="banner-create-car" className="max-w-full" />
            </div>
        </div>
    )
}

export default CarCreate