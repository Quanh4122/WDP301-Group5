import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogDetail, putBlog } from "./blogAPI"; // Import API functions
import { toast } from "react-toastify";

const UpdateBlog = () => {
  const { id } = useParams(); // Lấy postId từ URL
  const navigate = useNavigate(); // Để điều hướng sau khi cập nhật
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateCreate: "",
    image: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);

  // Tải dữ liệu bài viết hiện tại
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getBlogDetail(id);
        if (post) {
          setFormData({
            title: post.title || "",
            description: post.description || "",
            dateCreate: post.dateCreate ? post.dateCreate.split("T")[0] : "", // Format date cho input
            image: post.image || "",
            content: post.content || "",
          });
        }
      } catch (error) {
        toast.error("Không tải được bài viết!");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await putBlog(id, formData);
      navigate("/app/dashboard/blogManager"); // Điều hướng về danh sách sau khi cập nhật
    } catch (error) {
      // Lỗi đã được xử lý bằng toast trong putBlog
    } finally {
      setLoading(false);
    }
  };

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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Chỉnh Sửa Bài Viết</h1>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập tiêu đề"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập mô tả"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">URL hình ảnh</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập URL hình ảnh"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nội dung</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 h-32"
                placeholder="Nhập nội dung bài viết"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-200"
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/app/dashboard/blogManager")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-200"
                disabled={loading}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlog;