import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "./blogAPI";

// Định nghĩa giao diện Bài viết
interface Post {
  _id: string;
  title: string; // tiêu đề
  description: string; // mô tả
  image: string; // hình ảnh
  createdAt?: string; // ngày tạo (tuỳ chọn)
}

// Thành phần thông báo lỗi
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    {message} {/* Thông báo lỗi */}
  </div>
);

// Thành phần tải dữ liệu
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">
      <span className="sr-only">Đang tải...</span>
    </div>
  </div>
);

// Thành phần trạng thái trống
const EmptyState: React.FC = () => (
  <div className="text-center py-10">
    <h3 className="text-gray-500 text-xl font-semibold">Không tìm thấy bài viết</h3>
    <p className="text-gray-400 mt-2">Hãy kiểm tra lại sau để xem nội dung mới!</p>
  </div>
);

// Thành phần phân trang
const Pagination: React.FC<{
  currentPage: number; // trang hiện tại
  totalPages: number; // tổng số trang
  onPageChange: (page: number) => void; // hàm thay đổi trang
}> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => currentPage > 1 && onPageChange(currentPage - 1); // xử lý trang trước
  const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1); // xử lý trang sau

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // số trang tối đa hiển thị
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
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300 hover:bg-blue-700 transition-all duration-200 disabled:cursor-not-allowed"
      >
        Trước
      </button>
      {getPageNumbers().pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } transition-all duration-200`}
        >
          {page}
        </button>
      ))}
      {totalPages > 5 && getPageNumbers().endPage < totalPages && (
        <span className="px-4 py-2">...</span>
      )}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300 hover:bg-blue-700 transition-all duration-200 disabled:cursor-not-allowed"
      >
        Sau
      </button>
    </div>
  );
};

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // danh sách bài viết
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // danh sách bài viết đã lọc
  const [loading, setLoading] = useState<boolean>(true); // trạng thái tải
  const [error, setError] = useState<string | null>(null); // lỗi
  const [searchTerm, setSearchTerm] = useState<string>(""); // từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState<number>(1); // trang hiện tại
  const postsPerPage = 6; // số bài viết mỗi trang

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPosts(); // lấy tất cả bài viết
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      console.error("Lỗi khi tải bài viết:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1); // đặt lại về trang đầu khi lọc
  }, [searchTerm, posts]);

  // Logic phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // cuộn mượt lên đầu trang
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* Tiêu đề và thanh tìm kiếm nâng cao */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Danh Sách Bài Viết Chỉ Có Tại B-Car
        </h1>
        <div className="max-w-2xl mx-auto">
          <div className="relative shadow-sm rounded-full overflow-hidden border border-gray-200 bg-white">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : filteredPosts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-56 overflow-hidden rounded-t-xl bg-gray-100">
                  <img
                    src={post.image}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    alt={post.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col">
                  <h5 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">
                    {post.title}
                  </h5>
                  <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-4">
                    {post.description}
                  </p>
                  <Link
                    to={`/app/blog/${post._id}`}
                    className="block w-full bg-sky-500 hover:bg-sky-600 text-white text-center py-2.5 rounded-lg transition-all duration-200 font-medium no-underline"
                  >
                    Đọc Thêm
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default BlogList;