import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// Danh sách bài viết mẫu (giả định lấy từ localStorage hoặc state toàn cục)
const samplePosts = JSON.parse(localStorage.getItem("posts")) || [];

const ManageBlogDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tìm bài viết dựa trên ID
  useEffect(() => {
    const fetchPost = () => {
      try {
        setLoading(true);
        setError(null);

        // Tìm bài viết trong danh sách
        const foundPost = samplePosts.find((post) => post._id === id);

        if (foundPost) {
          setPost(foundPost);
        } else {
          setError("Không tìm thấy bài viết với ID này.");
        }
      } catch (err) {
        setError("Lỗi khi tải chi tiết bài viết. Vui lòng thử lại sau.");
        console.error("Lỗi khi tìm bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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

  if (error) {
    return (
      <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">Không tìm thấy bài viết.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 mb-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Chi Tiết Bài Viết</h1>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        {/* Blog Detail */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hình ảnh */}
            <div className="md:col-span-1">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.jpg";
                }}
              />
            </div>

            {/* Thông tin chi tiết */}
            <div className="md:col-span-2">
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Ngày tạo:</span>{" "}
                  {new Date(post.dateCreate).toLocaleString("vi-VN")}
                </p>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.description}</p>

              {/* Nút hành động */}
              <div className="mt-6 flex gap-4">
                <Link
                  to={`/app/dashboard/editBlog/${post._id}`}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-200"
                >
                  <button>Sửa</button>
                </Link>
                <Link
                  to="/app/dashboard/blogManager"
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-200"
                >
                  <button>Quay lại</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBlogDetail;