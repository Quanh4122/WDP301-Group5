import React, { useState, useCallback } from "react";
import "ckeditor5/ckeditor5.css";
import { postBlog } from "../blog/blogAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Định nghĩa giao diện BlogFormData
interface BlogFormData {
  title: string;
  description: string;
  images?: File[]; // Thay đổi từ image thành images, là mảng File
}

// Thành phần tải dữ liệu
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500">
      <span className="sr-only">Đang tải...</span>
    </div>
  </div>
);

const CreateBlog: React.FC = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // Mảng các file ảnh
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Mảng xem trước ảnh
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi chọn nhiều file ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImageFiles((prev) => [...prev, ...newFiles]); // Thêm file mới vào mảng
      setImagePreviews((prev) => [...prev, ...newPreviews]); // Thêm preview mới vào mảng
    }
  };

  // Xóa một ảnh khỏi danh sách
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Thu hồi URL preview cũ để tránh rò rỉ bộ nhớ
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!formData.title.trim() || !formData.description.trim()) {
        toast.error("Tiêu đề và mô tả là các trường bắt buộc");
        return;
      }

      const blogData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dateCreate: new Date().toISOString(),
        images: imageFiles.length > 0 ? imageFiles : undefined, // Gửi mảng images
      };

      try {
        setLoading(true);

        await postBlog(blogData);

        // Reset form sau khi thành công
        setFormData({
          title: "",
          description: "",
        });
        setImageFiles([]);
        setImagePreviews((prev) => {
          prev.forEach((url) => URL.revokeObjectURL(url)); // Thu hồi tất cả URL preview
          return [];
        });
        navigate("/app/dashboard/blogManager");
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [formData, imageFiles]
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Tạo Bài Viết Mới
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              name="title" // Đã thêm name="title"
              onChange={handleInputChange}
              value={formData.title}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-gray-50 placeholder-gray-400"
              placeholder="Nhập tiêu đề bài viết"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-gray-50 placeholder-gray-400"
              placeholder="Nhập mô tả bài viết"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tải lên hình ảnh
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="file"
                id="imageUpload"
                name="imageUpload"
                accept="image/*"
                multiple // Thêm thuộc tính multiple để chọn nhiều ảnh
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 disabled:opacity-50"
                disabled={loading}
              />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Xem trước ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {imageFiles.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Đã chọn: {imageFiles.map((file) => file.name).join(", ")}
              </p>
            )}
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                  Đang gửi...
                </>
              ) : (
                "Tạo Bài Viết"
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;