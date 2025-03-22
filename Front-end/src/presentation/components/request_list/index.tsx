import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { RequestModelFull } from "../checkout/models";
import RequestItem from "./component/RequestItem";
import { useLocation, useNavigate } from "react-router-dom";
import RequestInSelected from "./component/RequestInSelected";
import { Button } from "antd";
import { AlertTriangle } from "lucide-react";
import { PRIVATE_ROUTES } from "../../routes/CONSTANTS";
import { RootState } from "../redux/Store";
import { useSelector } from "react-redux";

const RequestList: React.FC = () => {
    const [requestInSelected, setRequestInSelected] = useState<RequestModelFull | undefined>(undefined);
    const [requestInPending, setRequestPending] = useState<RequestModelFull[] | undefined>(undefined);
    const [display, setDisplay] = useState<boolean>(false);
    const [isDisplayReject, setIsDisplayReject] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1); // State cho phân trang
    const itemsPerPage: number = 5; // Số lượng request trên mỗi trang
    const location = useLocation();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => (state.auth?.user as { userId: string } | null)?.userId);

    useEffect(() => {
        getListCar(userId)
    }, [])

    // Reset trang về 1 khi danh sách requestInPending thay đổi
    useEffect(() => {

        setCurrentPage(1);
    }, [requestInPending]);

    const getListCar = async (id: any) => {
        try {
            const res = await axiosInstance.get("/request/getListRequest", {
                params: { key: id },
            });
            onCategoryTypeByRequestList(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const onCategoryTypeByRequestList = (list: RequestModelFull[]) => {
        setRequestInSelected(list.filter((item) => item.requestStatus === "1")[0] || undefined);
        setRequestPending(list.filter((item) => item.requestStatus === "2" || item.requestStatus === "3"));
    };

    // Tính toán phân trang
    const totalItems: number = requestInPending?.length || 0;
    const totalPages: number = Math.ceil(totalItems / itemsPerPage);
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const endIndex: number = startIndex + itemsPerPage;
    const currentItems: RequestModelFull[] = requestInPending?.slice(startIndex, endIndex) || [];

    // Hàm điều hướng phân trang
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    // Tạo mảng số trang
    const pageNumbers: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <section className="w-full min-h-screen pt-12 bg-gray-50">
            {/* Header với nút toggle */}
            <div className="w-full px-6 md:px-20 py-4">
                <Button
                    type="primary"
                    onClick={() => setDisplay(!display)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    <span>{display ? "Xem danh sách" : "Xem chi tiết đang đặt"}</span>
                </Button>
            </div>

            {/* Nội dung chính */}
            <div className="w-full px-6 md:px-20 py-6">
                {display === false ? (
                    requestInSelected ? (
                        <RequestInSelected requestModal={requestInSelected} />
                    ) : (
                        <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-white">
                            <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md transform transition-all duration-300 hover:shadow-3xl">
                                <AlertTriangle className="text-red-500 w-20 h-20 mx-auto animate-pulse" />
                                <h1 className="text-3xl font-bold text-gray-900 mt-6">Opps !!</h1>
                                <p className="text-gray-600 mt-4 text-lg">
                                    Hiện tại bạn chưa thêm xe nào vào giỏ hàng
                                </p>
                                <div className="mt-8 flex gap-6 justify-center">
                                    <Button
                                        onClick={() => navigate(-1)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg shadow transition duration-300"
                                    >
                                        Quay lại
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            navigate(PRIVATE_ROUTES.PATH + "/" + PRIVATE_ROUTES.SUB.CAR_LIST)
                                        }
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow transition duration-300"
                                    >
                                        Xem xe
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="w-full h-auto space-y-6">
                        {requestInPending && requestInPending.length > 0 ? (
                            <>
                                {/* Hiển thị danh sách request của trang hiện tại */}
                                {currentItems.map((item) => (
                                    <RequestItem key={item._id} requestModel={item} />
                                ))}

                                {/* Phân trang */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 py-6">
                                        {/* Nút Previous */}
                                        <button
                                            onClick={handlePrevious}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200 ${currentPage === 1
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-blue-500 text-white"
                                                }`}
                                        >
                                            Previous
                                        </button>

                                        {/* Số trang */}
                                        {pageNumbers.map((number) => (
                                            <button
                                                key={number}
                                                onClick={() => handlePageClick(number)}
                                                className={`px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition duration-200 ${currentPage === number ? "bg-blue-700 text-white" : "bg-gray-200"
                                                    }`}
                                            >
                                                {number}
                                            </button>
                                        ))}

                                        {/* Nút Next */}
                                        <button
                                            onClick={handleNext}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200 ${currentPage === totalPages
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-blue-500 text-white"
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
                                Không có yêu cầu nào đang chờ xử lý
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default RequestList;