import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, deletePost } from "./blogAPI";
import { Modal } from "antd";
import Pagination from "../../components/home/components/Pagination";
import { toast } from "react-toastify";

interface Post {
  _id: string;
  title: string;
  description: string;
  image: string;
  dateCreate: string;
  author: string;
}

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 5;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPosts();
      setPosts(data);
      setFilteredPosts(data);
      localStorage.setItem("posts", JSON.stringify(data));
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

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1);
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
        } catch (err) {
          setError("Lỗi khi xóa bài viết. Vui lòng thử lại.");
          console.error("Lỗi khi xóa bài viết:", err);
          toast.error("Đã xảy ra lỗi khi xóa bài viết!");
        }
      },
    });
  };

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex items-center gap-3 p-5 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
          <span className="text-lg text-gray-700 font-semibold">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Quản Lý Bài Viết</h1>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/app/dashboard/createBlog"
            className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-200"
          >
            <button>Thêm Bài Viết Mới</button>
          </Link>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm tiêu đề, mô tả hoặc tác giả..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
        </div>

        {/* Table */}
        {paginatedPosts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">Không tìm thấy bài viết phù hợp.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="py-4 px-6 w-[120px]">Hình ảnh</th>
                    <th className="py-4 px-6 w-[300px]">Tiêu đề</th>
                    <th className="py-4 px-6 w-[400px]">Mô tả</th>
                    <th className="py-4 px-6 w-[150px]">Ngày tạo</th>
                    <th className="py-4 px-6 w-[200px]">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-center">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-20 object-cover rounded-lg mx-auto"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-image.jpg";
                          }}
                        />
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-medium text-center">
                        <Link
                          to={`/app/dashboard/blogManager/${post._id}`}
                          className="hover:text-sky-400"
                        >
                          <button>{post.title}</button>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-gray-700 text-center">
                        <div className="line-clamp-2">{post.description}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-700 text-center">
                        {new Date(post.dateCreate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/app/dashboard/blogManager/edit/${post._id}`}
                            className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-lg transition-all duration-200"
                          >
                            <button>Sửa</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-all duration-200"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default BlogManager;