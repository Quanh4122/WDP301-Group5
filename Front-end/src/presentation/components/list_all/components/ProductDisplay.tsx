import { Button, Image, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { dataCategory, dataProduct } from "../CONSTANTS";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../routes/CONSTANTS";

const ProductDisplay = () => {
    const [category, setCategory] = useState<dataCategory[]>();
    const [listProduct, setListProduct] = useState<dataProduct[]>();
    const navigate = useNavigate()

    const viewProductDetai = (id: number) => {
        navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.PRODUCT_DETAIL, {
            state: {
                id: id
            }
        })
    }

    useEffect(() => {
        axios.get("http://localhost:3030/category")
            .then((res) => setCategory(res.data))
            .catch((error) => console.log(error))

        console.log(category)

        axios.get(`http://localhost:3030/products`, {
            params: {
                categoryId: 1
            }
        })
            .then((res) => setListProduct(res.data))
            .catch((err) => console.log(err))
        console.log(listProduct)

    }, [])

    const getProductByCategoryId = (id: number) => {
        axios.get(`http://localhost:3030/products`, {
            params: {
                categoryId: id
            }
        })
            .then((res) => setListProduct(res.data))
            .catch((err) => console.log(err))
        console.log(listProduct)
    }

    return (
        <section className="w-full px-24">
            <div className="w-full h-36 flex items-center text-3xl font-bold font-sans">Category</div>
            <div className="w-full h-auto flex justify-between">
                {
                    category?.map((item) => {
                        return (
                            <div key={item.id} className="bg-white w-36 h-36 rounded-full flex justify-center items-center"
                                onClick={() => getProductByCategoryId(item.id)}
                            >
                                <div>
                                    <Image src={item.image} width={100} />
                                    <div className="w-full flex justify-center font-bold">
                                        {item.label}
                                    </div>

                                </div>
                            </div>
                        )
                    })
                }

            </div>
            <div className="w-full h-36 flex items-center text-3xl font-bold font-sans">Product</div>
            <div className="flex flex-wrap">
                {
                    listProduct?.map((item) => {
                        console.log(item.images.shift())
                        return (
                            <>
                                <div className="w-1/4 h-auto flex items-center justify-center m">
                                    <div className="w-5/6 h-auto shadow-md px-2 py-8" onClick={() => viewProductDetai(item.id)}>
                                        <div className="w-40 h-56" >
                                            <Image src={item.images.shift()} className="w-full h-28" />
                                        </div>
                                        <div>
                                            <div className="font-bold font-sans py-2">
                                                {item.name}
                                            </div>
                                            <div className="py-2 font-sans text-stone-400">
                                                {item.price} $
                                            </div>
                                        </div>
                                        {/* <Button type="primary" className="w-full">Buy</Button > */}
                                    </div>

                                </div>
                            </>

                        )

                    })
                }
            </div>
        </section>
    )
}

export default ProductDisplay