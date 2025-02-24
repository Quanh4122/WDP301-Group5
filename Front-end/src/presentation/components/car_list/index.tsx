import React from "react";
import CarItem from "./components/CarItem";

const CarList = () => {

    const Item = [
        { id: 1 },
        { id: 1 },
        { id: 1 },
        { id: 1 },
        { id: 1 },
    ]

    return (
        <div className="flex flex-wrap tems-center justify-between p-10">
            {
                Item.map((item) => (
                    <CarItem />
                ))
            }
        </div>
    )
}

export default CarList