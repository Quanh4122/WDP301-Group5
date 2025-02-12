import { Button, Divider, Form, Image, Input, InputNumber, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dataBill, dataProduct } from "../CONSTANTS";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
import BillProduct from "./BillProduct";

const ProductDetai = () => {
    const location = useLocation()
    const [productDetail, setProductDetail] = useState<dataProduct[]>()
    const [dataBill, setDataBill] = useState<dataBill>()
    const [form] = useForm()
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        axios.get(`http://localhost:3030/products`, {
            params: {
                id: location.state.id
            }
        })
            .then((res) => setProductDetail(res.data))
            .catch((err) => console.log(err))

        console.log("Data : ", productDetail)
    }, [])

    const onFinish = () => {
        const sizeProduct = form.getFieldValue("size")
        const quantityProduct = form.getFieldValue("quantity")
        const dataBill: dataBill = {
            id: productDetail?.at(0)?.id,
            name: productDetail?.at(0)?.name,
            price: productDetail?.at(0)?.price,
            size: sizeProduct,
            quantityProduct: quantityProduct,
            image: productDetail?.at(0)?.images
        }
        setDataBill(dataBill)
        showModal()
        console.log(dataBill)
    }

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <section className="w-full h-screen overflow-hidden flex justify-center">
            <div className="bg-white">
                <div className="w-full px-5 py-2 h-auto flex items-center justify-center">
                    {
                        productDetail?.at(0)?.images.map((item) => {
                            return (
                                <Image src={item} width={200} />
                            )
                        })
                    }
                </div>
                <Divider />
                <div className="w-full h-full py-2 px-40 flex justify-center">
                    <div>
                        <div className="font-bold font-sans py-2">
                            {productDetail?.at(0)?.name}
                        </div>
                        <div className="py-2 font-sans">
                            {productDetail?.at(0)?.price} $
                        </div>
                        <div>
                            <Form
                                form={form}
                                onFinish={onFinish}
                                style={{ maxWidth: 600 }}
                                initialValues={{ remember: true }}
                                autoComplete="off"
                            >
                                <Form.Item label="Sizes" name="size" rules={[{ required: true, message: "Please select you size !!!" }]}>
                                    <Radio.Group>
                                        {
                                            productDetail?.at(0)?.size.map((item) => {
                                                return (
                                                    <Radio value={item}>{item}</Radio>
                                                )
                                            })
                                        }
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: "Please select you quantity !!!" }]}>
                                    <InputNumber />
                                </Form.Item>
                                <Button htmlType="submit" type="primary" className="w-full">Buy Now</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <BillProduct
                dataBill={dataBill}
                handleCancel={handleCancel}
                handleOk={handleOk}
                isOpen={isModalOpen}
            />
        </section>
    )
}

export default ProductDetai