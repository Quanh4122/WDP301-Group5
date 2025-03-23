import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, deletePost } from "./blogAPI";
import { Modal, message } from "antd"; // Import Modal and message from Ant Design

// Định nghĩa giao diện Bài viết
interface Post {
  _id: string;
  title: string;
  description: string;
  image: string;
  dateCreate: string;
  author: string;
}

// Thành phần thông báo lỗi
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
    {message}
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
  <div className="text-center py-16 bg-white rounded-xl shadow-lg">
    <h3 className="text-gray-600 text-2xl font-semibold">Không tìm thấy bài viết</h3>
    <p className="text-gray-400 mt-2">Nhấn "Thêm mới" để tạo bài viết đầu tiên của bạn!</p>
  </div>
);

// Thành phần phân trang
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
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
        className="px-4 py-2 rounded-lg bg-sky-500 text-white disabled:bg-gray-300 hover:bg-sky-600 transition-all duration-200 disabled:cursor-not-allowed"
      >
        Trước
      </button>
      {getPageNumbers().pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } transition-all duration-200`}
        >
          {page}
        </button>
      ))}
      {totalPages > 5 && getPageNumbers().endPage < totalPages && (
        <span className="px-4 py-2 text-gray-500">...</span>
      )}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-sky-500 text-white disabled:bg-gray-300 hover:bg-sky-600 transition-all duration-200 disabled:cursor-not-allowed"
      >
        Sau
      </button>
    </div>
  );
};

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const postsPerPage = 5;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError("Lỗi khi tải bài viết. Vui lòng thử lại sau.");
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
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1); // Đặt lại về trang đầu khi lọc
  }, [searchTerm, posts]);

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa bài viết",
      content: "Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePost(id);
          setPosts(posts.filter((post) => post._id !== id));
          setFilteredPosts(filteredPosts.filter((post) => post._id !== id));
          message.success("Bài viết đã được xóa thành công!"); // Toast message in Vietnamese
        } catch (err) {
          setError("Lỗi khi xóa bài viết. Vui lòng thử lại.");
          console.error("Lỗi khi xóa bài viết:", err);
          message.error("Đã xảy ra lỗi khi xóa bài viết!");
        }
      },
      onCancel: () => {
        // Do nothing if canceled
      },
    });
  };

  // Logic phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Quản Lý Bài Viết</h2>
          <Link
            to="/app/createBlog"
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg no-underline"
          >
            Thêm Bài Viết Mới
          </Link>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="relative shadow-sm rounded-full overflow-hidden border border-gray-200 bg-white">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề, mô tả hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
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

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : filteredPosts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Hình ảnh
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {post.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {new Date(post.dateCreate).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-16 w-16 object-cover rounded-lg shadow-sm"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-image.jpg";
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <Link
                          to={`/app/editBlog/${post._id}`}
                          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-lg text-sm transition-all duration-200 no-underline"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition-all duration-200"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default BlogManager;