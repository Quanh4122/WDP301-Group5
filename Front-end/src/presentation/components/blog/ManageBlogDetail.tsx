import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getBlogDetail } from "./blogAPI";

interface Post {
  _id: string;
  title: string;
  description: string;
  images: string[];
  dateCreate: string;
}

const ManageBlogDetail = () => {
  const { id } = useParams<{ id: string }>(); // Khai báo kiểu cho useParams
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchPost = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const blogData = await getBlogDetail(id);
      if (blogData) {
        const normalizedPost = {
          ...blogData,
          images: Array.isArray(blogData.images)
            ? blogData.images
            : blogData.image
            ? [blogData.image]
            : [],
        };
        setPost(normalizedPost);
      } else {
        setPost(null);
        toast.error("Không tìm thấy bài viết với ID này.");
      }
    } catch (err) {
      toast.error("Lỗi khi tải chi tiết bài viết. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handlePrevImage = () => {
    if (post && post.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? post.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (post && post.images) {
      setCurrentImageIndex((prev) =>
        prev === post.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
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
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Chi Tiết Bài Viết</h1>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="relative w-full h-64">
                <img
                  src={
                    post.images && post.images.length > 0
                      ? `http://localhost:3030${post.images[currentImageIndex]}`
                      : "/placeholder-image.jpg"
                  }
                  alt={`${post.title} - Hình ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.jpg";
                  }}
                />
                {post.images && post.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-700 text-white flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-700 text-white flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {post.images && post.images.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {post.images.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3030${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                        currentImageIndex === index ? "border-blue-500" : "border-gray-300"
                      } hover:border-blue-400 transition-all duration-200`}
                      onClick={() => handleThumbnailClick(index)}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Ngày tạo:</span>{" "}
                  {new Date(post.dateCreate).toLocaleString("vi-VN")}
                </p>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.description}</p>

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