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
import dayjs from 'dayjs';

const RequestList: React.FC = () => {
    const [requestInSelected, setRequestInSelected] = useState<RequestModelFull | undefined>(undefined);
    const [requestInPending, setRequestPending] = useState<RequestModelFull[] | undefined>(undefined);
    const [display, setDisplay] = useState<boolean>(false);
    const [isDisplayReject, setIsDisplayReject] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isLoading, setIsLoading] = useState<boolean>(true); // Thêm state loading
    const itemsPerPage: number = 5;
    const location = useLocation();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => (state.auth?.user as { userId: string } | null)?.userId);

    useEffect(() => {
        getListCar(userId);
        if (requestInSelected) {
            setDisplay(false)
        }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [requestInPending]);

    const getListCar = async (id: any) => {
        try {
            setIsLoading(true); // Bắt đầu loading
            const res = await axiosInstance.get("/request/getListRequest", {
                params: { key: id },
            });
            onCategoryTypeByRequestList(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const onCategoryTypeByRequestList = (list: RequestModelFull[]) => {

        setRequestInSelected(list.filter((item) => item.requestStatus === "1")[0] || undefined);
        setRequestPending(list.filter((item) => item.requestStatus !== '1'));

    };

    const handleSortByTime = () => {
        if (!requestInPending) return;

        const sortedRequests = [...requestInPending].sort((a, b) => {
            const dateA = dayjs(a.timeCreated);
            const dateB = dayjs(b.timeCreated);
            return sortOrder === 'asc'
                ? dateA.isBefore(dateB) ? -1 : 1
                : dateB.isBefore(dateA) ? -1 : 1;
        });

        setRequestPending(sortedRequests);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setCurrentPage(1);
    };

    const totalItems: number = requestInPending?.length || 0;
    const totalPages: number = Math.ceil(totalItems / itemsPerPage);
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const endIndex: number = startIndex + itemsPerPage;
    const currentItems: RequestModelFull[] = requestInPending?.slice(startIndex, endIndex) || [];

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

    const pageNumbers: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <section className="w-full min-h-screen pt-12 bg-gray-50">
            <div className="w-full px-6 md:px-20 py-4 flex justify-between items-center">
                <Button
                    type="primary"
                    onClick={() => setDisplay(!display)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    <span>{display ? "Xem danh sách" : "Xem chi tiết đang đặt"}</span>
                </Button>
                {display && requestInPending && requestInPending.length > 0 && (
                    <Button
                        onClick={handleSortByTime}
                        className="!bg-green-600 !hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                    >
                        Sắp xếp theo thời gian {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                )}
            </div>

            <div className="w-full px-6 md:px-20 py-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                            <p className="mt-4 text-lg text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : display === false ? (
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
                                {currentItems.map((item) => (
                                    <RequestItem key={item._id} requestModel={item} />
                                ))}

                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 py-6">
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