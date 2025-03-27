import { useEffect, useState } from "react";
import { features } from "../../../../constants";
import axiosInstance from "../../utils/axios";
import CarItem from "./CarItem";
import { CarModel } from "../../checkout/models";

interface props {
  listContent: String
}

const FeatureSection = ({ listContent }: props) => {
  const listCarItem = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    // { id: 4 },
    // { id: 5 },
  ]

  const [listFavoriteCar, setListFavoriteCar] = useState<CarModel[]>()

  useEffect(() => {
    getListFavoritCar()
  }, [])

  const getListFavoritCar = async () => {
    await axiosInstance.get("/request/selectFavoriteCar")
      .then(res => setListFavoriteCar(res.data))
      .catch(err => console.log(err))
  }
  return (
    <div className="relative my-10 min-h-[500px]">
      <div className="text-center">
        <span className=" text-sky-500 rounded-full h-6 text-2xl font-medium px-2 py-1 uppercase">
          {listContent}
        </span>
      </div>
      <div className="flex flex-wrap mt-10 lg:mt-20 items-center justify-center">
        {/* {features.map((feature, index) => (
          <div key={index} className="w-full sm:1/2 lg:w-1/3">
            <div className="flex">
              <div className="flex mx-6 h-10 w-10 p-2 text-orange-700 justify-center items-center rounded-full">
                {feature.icon}
              </div>
              <div>
                <h5 className="mt-1 mb-6 text-xl">{feature.text}</h5>
                <p className="text-md p-2 mb-20 text-neutral-500">{feature.description}</p>
              </div>
            </div>
          </div>
        ))} */}
        {
          listFavoriteCar?.map((item, indx) => (
            <div key={indx}>
              <CarItem carModel={item} />
            </div>

          ))
        }
      </div>
    </div>
  );
}

export default FeatureSection;
