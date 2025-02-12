import { Button, Form, Input, Layout } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROOT } from "../../../routes/CONSTANTS";
import { ZoomInOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import Bill from "./Bill";
import axios from "axios";

const { Content, Header, Footer } = Layout

interface props {
    children?: string | JSX.Element | JSX.Element[];
}

const LayoutContainer = ({ children }: props) => {

    const navigate = useNavigate()
    const [form] = useForm()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bill, setBill] = useState()

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const onFinish = () => {
        const phoneNumber = form.getFieldValue("phoneNumber")
        axios.get(`http://localhost:3030/carts?phoneNumber=${phoneNumber}`)
            .then((res) => {
                console.log("tp", res.data)
                setBill(res.data.at(0))
            })
            .catch((err) => console.log(err))
        showModal()
    }

    return (
        <Layout style={{ minWidth: '700px' }}>
            <Header className="w-full flex items-center justify-between bg-white">
                <div className="font-medium text-xl" onClick={() => navigate(ROOT)}>WELCOM TO OUR SHOP</div>
                <Form className="flex pt-7 w-72"
                    form={form}
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"

                >
                </Form>
            </Header>
            <Content className="py-10">
                {children}
            </Content>
            <Bill
                isOpen={isModalOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                bill={bill}
            />
        </Layout>
    )
}

export default LayoutContainer