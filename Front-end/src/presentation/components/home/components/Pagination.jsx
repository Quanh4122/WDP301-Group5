import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  // Xử lý chuyển đến trang trước
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Xử lý chuyển đến trang sau
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Số trang tối đa hiển thị
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return { pages, endPage };
  };

  return (
    <div
      className={`flex justify-center items-center text-gray-600 text-base ${className}`}
    >
      <div className="flex space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="bg-blue-600 text-white px-6 py-3 rounded-md disabled:bg-gray-300 hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Trước
        </button>
        {getPageNumbers().pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-all duration-200`}
          >
            {page}
          </button>
        ))}
        {totalPages > 5 && getPageNumbers().endPage < totalPages && (
          <span className="px-4 py-2 text-gray-600">...</span>
        )}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="bg-blue-600 text-white px-6 py-3 rounded-md disabled:bg-gray-300 hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default Pagination;