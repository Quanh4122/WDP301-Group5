import { Button, Form, Input, InputNumber, Radio, Upload } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import BannerCreateCar from '../../assets/banner-created-car.jpg'
import GradeIcon from '@mui/icons-material/Grade';
import { useForm } from "antd/es/form/Form";
import { CarModels, CarModelsNoId } from "../car_list/model";
import axiosInstance from "../utils/axios";

const CarCreate = () => {

    const [form] = useForm()
    const [arrFile, setArrFile] = useState<File[]>()

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
    const onFinish = (value: any) => {
        console.log(value.images)
        const listImage = value.images.fileList.map((item: any) => {
            return (item.name + "")
        })
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
        console.log(data)
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
            .then(res => res.data)
            .catch(err => console.log(err))

    }

    const onChangeGetFile = (files: any) => {
        const arr: File[] = files.fileList.map((item: any) => (
            item.originFileObj
        ))
        setArrFile(arr)
    }
    return (
        <div className="w-full h-auto flex p-10">
            <div className="w-2/5 px-20">
                <div className="w-full font-bold text-lg text-sky-500">
                    Thêm xe
                </div>
                <Form
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <div className="w-full flex justify-between">
                        <Form.Item
                            rules={[{ required: true }]}
                            name="carName"
                        >
                            <Input className="w-48" placeholder="Tên xe" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="color"
                        >
                            <Input className="w-48" placeholder="Màu xe" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                        <Form.Item
                            rules={[{ required: true }]}
                            name="licensePlateNumber"
                        >
                            <Input className="w-48" placeholder="Biển số xe" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="carVersion"
                        >
                            <InputNumber className="w-48" placeholder="Đời xe" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                        <Form.Item
                            rules={[{ required: true }]}
                            name="numberOfSeat"
                        >
                            <InputNumber className="w-48" placeholder="Số chỗ" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="price"
                        >
                            <InputNumber className="w-48" placeholder="Giá thuê 4h" suffix={<GradeIcon className="text-red-600" style={{ fontSize: 10 }} />} />
                        </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                        <Form.Item
                            rules={[{ required: true }]}
                            name="flue"
                        >
                            <Radio.Group
                                options={radioFlue}
                            />
                        </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                        <Form.Item
                            rules={[{ required: true }]}
                            name="transmissionType"
                        >
                            <Radio.Group
                                options={radioTransmissionType}
                            />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="bunkBed"
                        >
                            <Radio.Group
                                options={radioBunkBed}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="images"
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
                    </div>
                    <Button type="primary" htmlType="submit" className="w-full h-12 text-lg font-bold">Tạo xe</Button>
                </Form>

            </div>
            <div className="w-1/2">
                <img src={BannerCreateCar} alt="banner-create-car" />
            </div>
        </div>
    )
}

export default CarCreate