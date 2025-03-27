import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogDetail, putBlog } from "./blogAPI";
import { toast } from "react-toastify";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateCreate: "",
    dateUpdated: "",
  });
  const [imageFiles, setImageFiles] = useState([]); // Ảnh mới upload
  const [existingImages, setExistingImages] = useState([]); // Ảnh cũ từ server
  const [imagePreviews, setImagePreviews] = useState([]); // Preview cho cả ảnh cũ và mới
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) {
          throw new Error("ID is required to fetch the blog details.");
        }
        const post = await getBlogDetail(id);
        console.log("Dữ liệu từ getBlogDetail:", post);

        if (post && typeof post === "object" && post !== null) {
          setFormData({
            title: post.title || "",
            description: post.description || "",
            dateCreate: post.dateCreate ? post.dateCreate.split("T")[0] : "",
            dateUpdated: post.dateUpdated ? new Date(post.dateUpdated).toLocaleString("vi-VN") : "",
          });
          if (post.images && Array.isArray(post.images)) {
            const fullImageUrls = post.images.map((img) =>
              img.startsWith("http") ? img : `http://localhost:3030${img}`
            );
            setExistingImages(fullImageUrls);
            setImagePreviews(fullImageUrls);
          }
        } else {
          throw new Error("Dữ liệu bài viết không hợp lệ hoặc không tìm thấy");
        }
      } catch (error) {
        toast.error("Không tải được bài viết!");
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Thay đổi ${name}: ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImageFiles((prev) => [...prev, ...newFiles]); // Thêm ảnh mới
      setImagePreviews((prev) => [...prev, ...newPreviews]); // Thêm preview ảnh mới
    }
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      // Xóa ảnh cũ
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Xóa ảnh mới
      const newIndex = index - existingImages.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
      setImagePreviews((prev) => {
        const newPreviews = prev.filter((_, i) => i !== index);
        URL.revokeObjectURL(prev[index]); // Thu hồi URL của ảnh mới
        return newPreviews;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const blogData = {
        title: formData.title,
        description: formData.description,
        images: imageFiles.length > 0 ? imageFiles : undefined, // Ảnh mới
        existingImages: existingImages.length > 0 ? JSON.stringify(existingImages) : undefined, // Ảnh cũ
      };

      console.log("Dữ liệu gửi lên:", blogData);

      if (!id) {
        throw new Error("ID is required to update the blog.");
      }
      const updatedPost = await putBlog(id, blogData);
      setFormData((prev) => ({
        ...prev,
        dateUpdated: new Date(updatedPost.dateUpdated).toLocaleString("vi-VN"),
      }));
      navigate("/app/dashboard/blogManager");
    } catch (error) {
      toast.error("Không thể cập nhật bài viết. Vui lòng thử lại!");
      console.error("Lỗi khi cập nhật bài viết:", error);
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
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Chỉnh Sửa Bài Viết</h1>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Cập nhật: {formData.dateUpdated || new Date().toLocaleString("vi-VN")}
          </div>
        </header>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tải lên hình ảnh
              </label>
              <div className="flex items-center gap-4 flex-wrap">
                <input
                  type="file"
                  name="imageUpload"
                  accept="image/*"
                  multiple // Hỗ trợ chọn nhiều ảnh
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
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