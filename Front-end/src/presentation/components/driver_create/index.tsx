import { Button, Form, Input, InputNumber, Radio, Upload } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import BannerCreateCar from '../../assets/banner-created-car.jpg'
import GradeIcon from '@mui/icons-material/Grade';
import { useForm } from "antd/es/form/Form";
import { CarModels, CarModelsNoId } from "../car_list/model";
import axiosInstance from "../utils/axios";


const CreateDriver = () => {

    const [form] = useForm()

    const onFinish = () => {

    }

    return (
        <div className="w-full h-auto flex px-10">
            <div className="w-2/5 p-10">
                <div className="w-full font-bold text-lg text-sky-500">
                    Thêm tài xế
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

                            />
                        </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                        <Form.Item
                            rules={[{ required: true }]}
                            name="transmissionType"
                        >
                            <Radio.Group

                            />
                        </Form.Item>
                        <Form.Item
                            rules={[{ required: true }]}
                            name="bunkBed"
                        >
                            <Radio.Group

                            />
                        </Form.Item>
                    </div>

                    <Button type="primary" htmlType="submit" className="w-full h-12 text-lg font-bold">Tạo xe</Button>
                </Form>

            </div>
            <div className="w-3/5 h-full">
                <img src={BannerCreateCar} alt="banner-create-car" className="w-full h-full" />
            </div>
        </div>
    )
}

export default CreateDriver