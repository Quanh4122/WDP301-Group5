import { Button, Image } from "antd";
import React from "react";
import Carimage from "../../assets/car-image1.png"
import MapBanner from "../../assets/map-banner.png"
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PersonIcon from '@mui/icons-material/Person';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import MapIcon from '@mui/icons-material/Map';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import ErrorIcon from '@mui/icons-material/Error';
import { Typography } from "@mui/material";
import UsbIcon from '@mui/icons-material/Usb';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CableIcon from '@mui/icons-material/Cable';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AddHomeIcon from '@mui/icons-material/AddHome';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const CarDetail = () => {
    return (
        <section className="w-ful h-auto bg-gray-100">
            <div className="w-full h-20 bg-black mb-8">
                <img src={MapBanner} className="w-40 h-20" />
            </div>
            <div className="flex items-center px-36">
                <div className="flex items-center px-2">
                    <Image src={Carimage} width={600} height={315} className="rounded-lg" />
                </div>
                <div className="flex flex-wrap justify-between">
                    <div className="mb-2"><Image src={Carimage} width={300} height={150} className="rounded-lg" /></div>
                    <div className="mb-2"><Image src={Carimage} width={300} height={150} className="rounded-lg" /></div>
                    <Image src={Carimage} width={300} height={150} className="rounded-lg" />
                    <Image src={Carimage} width={300} height={150} className="rounded-lg" />
                </div>
            </div>
            <div className="w-ful h-auto px-36 py-10 flex">
                <div className="w-2/3 h-fit">
                    <div className="block border-b-2 border-gray-300 h-24 py-3">
                        Ford Territory 2023
                        <div className="text-lime-500 w-16 flex items-center h-8">
                            <WatchLaterIcon />
                            24/7
                        </div>
                    </div>
                    <div className="h-24 py-3 mt-5">
                        <div className="font-bold text-lg">
                            Đặc điểm
                            <div className="w-7 border-b-4 border-sky-500"></div>
                        </div>
                        <div className="flex items-center justify-between mt-2 w-2/3">
                            <div className="flex items-center text-sky-500">
                                <PersonIcon />
                                <Typography variant="body2" color="textSecondary">
                                    số ghế
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500">
                                <UsbIcon />
                                <Typography variant="body2" color="textSecondary">
                                    chuyển động
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500">
                                <LocalGasStationIcon />
                                <Typography variant="body2" color="textSecondary">
                                    nhiên liệu
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="h-52 py-3 mt-5">
                        <div className="font-bold text-lg">
                            Các tiện nghi khác
                            <div className="w-7 border-b-4 border-sky-500"></div>
                        </div>
                        <div className="flex flex-wrap items-center justify-start mt-2 w-full h-auto">
                            <div className="flex items-center text-sky-500 w-1/4 mt-5">
                                <MapIcon />
                                <Typography variant="body2" color="textSecondary">
                                    Bản đồ
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500 w-1/4 mt-5">
                                <BluetoothIcon />
                                <Typography variant="body2" color="textSecondary">
                                    Bluetooth
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500 w-1/4 mt-5">
                                <FilterCenterFocusIcon />
                                <Typography variant="body2" color="textSecondary">
                                    Camera 360
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500 w-1/4 mt-5">
                                <ErrorIcon />
                                <Typography variant="body2" color="textSecondary">
                                    Cảm biến lốp
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500 w-1/4 mt-5">
                                <LocationOnIcon />
                                <Typography variant="body2" color="textSecondary">
                                    GPS
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500 w-1/4 mt-5">
                                <CableIcon />
                                <Typography variant="body2" color="textSecondary">
                                    Khe cắm USB
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500 w-1/4 mt-5">
                                <OndemandVideoIcon />
                                <Typography variant="body2" color="textSecondary">
                                    Màn hình DVD
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500 w-1/4 mt-5">
                                <AddHomeIcon />
                                <Typography variant="body2" color="textSecondary">
                                    ETC
                                </Typography>
                            </div>
                            <div className="flex items-center text-sky-500 w-1/4 mt-5">
                                <MedicalServicesIcon />
                                <Typography variant="body2" color="textSecondary">
                                    Túi khí an toàn
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="h-auto py-3 mt-5">
                        <div className="font-bold text-lg">
                            Điều khoản
                            <div className="w-7 border-b-4 border-sky-500"></div>
                        </div>
                        <div className="mt-5">
                            Quy định khác: <br />

                            - Sử dụng xe đúng mục đích.<br />

                            - Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.<br />

                            - Không sử dụng xe thuê để cầm cố, thế chấp.<br />

                            - Không hút thuốc, nhả kẹo cao su, xả rác trong xe.<br />

                            - Không chở hàng quốc cấm dễ cháy nổ.<br />

                            - Không chở hoa quả, thực phẩm nặng mùi trong xe.<br />

                            - Khi trả xe, nếu xe bẩn hoặc có mùi trong xe, khách hàng vui lòng vệ sinh xe sạch sẽ hoặc gửi phụ thu phí vệ sinh xe.<br />

                            - Xe được giới hạn di chuyển ở mức 400km cho 24h, và lần lượt là 250km, 300km, 350 km cho gói 4h, 8h, 12h.<br />

                            Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt vời !
                        </div>
                        {/* <div className="font-bold text-lg my-5">
                            Chính sách hủy chuyến
                        </div>
                        <div>

                        </div> */}
                    </div>
                </div>
                <div className="w-1/3 h-fit p-2">
                    <div className="w-full h-auto shadow-lg p-3 rounded-lg border">
                        <div className="w-3/4 flex flex-wrap items-center">
                            <div className="text-2xl font-semibold text-sky-500 w-1/2">500k/4 giờ</div>
                            <div className="text-gray-500 w-1/2">700K/8 giờ</div>
                            <div className="text-gray-500 w-1/2">800K/12 giờ</div>
                            <div className="text-gray-500 w-1/2" >1100K/24 giờ</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-5">
                            Đơn giá gói chỉ áp dụng cho ngày thường. Giá ngày Lễ/Tết có thể điều chỉnh theo nhu cầu.
                        </p>
                        <div className="mt-5 flex justify-between border-b-2 h-10">
                            <p className="font-semibold text-sm text-gray-600">
                                Phí thuê xe
                                <span></span>
                            </p>
                            <div className="font-semibold text-sm text-gray-700">2.700.000₫</div>
                        </div>
                        <div className="mt-5 flex justify-between h-10">
                            <p className="font-semibold text-sm text-gray-600">
                                Phí thuê xe
                                <span></span>
                            </p>
                            <div className="font-semibold text-sm text-gray-700">2.700.000₫</div>
                        </div>
                        <div className="flex justify-between h-10">
                            <p className="font-semibold text-sm text-gray-600">
                                Tổng cộng tiền thuê
                            </p>
                            <div className="font-semibold text-sm text-gray-700">2.592.000₫</div>
                        </div>
                        <div className="flex justify-between h-5 items-end">
                            <p className="font-semibold text-sm text-gray-600">
                                Tiền giữ chỗ
                                <span></span>
                            </p>
                            <div className="font-semibold text-sm text-gray-700">500.000₫</div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Tiền giữ chỗ không phải phụ phí và sẽ được hoàn lại sau chuyến đi. Lưu ý: Tham khảo chính sách hoàn giữ chỗ khi huỷ chuyến.
                        </p>
                        <div className="flex justify-between h-10 items-end">
                            <p className="font-semibold text-sm text-gray-600">
                                Cọc xe
                                <span></span>
                            </p>
                            <div className="font-semibold text-sm text-gray-700">3.000.000₫</div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Thanh toán sau khi nhận và kiểm tra xe, không nhận cọc xe máy.
                            Lưu ý: Bằng lái mới được cấp dưới 1 năm, mức cọc là 8 triệu VND
                        </p>

                        <Button className="w-full h-10 mt-10" type="primary">Thuê xe</Button>
                    </div>
                    <div className="mt-10 w-full h-auto shadow-lg rounded-lg border">
                        <div className="bg-sky-100 p-3 text-sky-700 font-semibold">
                            Các chi phí khác
                        </div>
                        <div className="p-3  border-b-2 ">
                            <div className="flex justify-between h-auto items-end">
                                <p className="font-semibold text-sm text-gray-600">
                                    Phụ phí xăng
                                </p>
                                <div className="font-semibold text-sm text-gray-700">30,000₫ / lít</div>
                            </div>
                            <p className="text-xs text-gray-500">
                                Bonbon chỉ thu khi vạch xăng thấp hơn lúc nhận xe. Trả lại đúng vạch xăng như lúc nhận để không phải trả phí này.
                            </p>
                        </div>
                        <div className="p-3  border-b-2 ">
                            <div className="flex justify-between h-auto items-end">
                                <p className="font-semibold text-sm text-gray-600">
                                    Phí vệ sinh
                                </p>
                                <div className="font-semibold text-sm text-gray-700">120,000₫ - 150,000₫</div>
                            </div>
                            <p className="text-xs text-gray-500">
                                Vui lòng trả lại hiện trạng xe được vệ sinh như lúc nhận để không mất phí này.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CarDetail