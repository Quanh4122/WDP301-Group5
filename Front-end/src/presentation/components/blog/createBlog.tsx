import React, { useState, useCallback } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  CKBox,
  CKBoxImageEdit,
  CloudServices,
  Emoji,
  Essentials,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Mention,
  Paragraph,
  PasteFromOffice,
  PictureEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { postBlog } from "../blog/blogAPI";
import { toast } from "react-toastify";

// Định nghĩa giao diện BlogFormData
interface BlogFormData {
  title: string;
  description: string;
  content: string; // Không cần trường image trong formData nữa vì dùng File riêng
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
    content: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu file ảnh
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Xem trước ảnh

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi chọn file ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file); // Tạo URL tạm để xem trước
      setImagePreview(previewUrl);
    }
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
        image: imageFile || "", // Gửi File hoặc chuỗi rỗng nếu không có ảnh
        content: formData.content,
      };

      try {
        setLoading(true);

        await postBlog(blogData);

        // Reset form sau khi thành công
        setFormData({
          title: "",
          description: "",
          content: "",
        });
        setImageFile(null);
        setImagePreview(null);
      } catch (err) {
        toast.error("Không thể tạo bài viết. Vui lòng thử lại.");
        console.error("Lỗi khi tạo bài viết:", err);
      } finally {
        setLoading(false);
      }
    },
    [formData, imageFile]
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
              name="title"
              value={formData.title}
              onChange={handleChange}
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
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
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
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="imageUpload"
                name="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 disabled:opacity-50"
                disabled={loading}
              />
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Xem trước"
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            {imageFile && (
              <p className="text-sm text-gray-500 mt-2">
                Đã chọn: {imageFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung
            </label>
            <div className="rounded-lg border border-gray-300 shadow-sm">
              <CKEditor
                editor={ClassicEditor}
                config={{
                  licenseKey: "GPL",
                  plugins: [
                    Autoformat,
                    AutoImage,
                    Autosave,
                    BlockQuote,
                    Bold,
                    CKBox,
                    CKBoxImageEdit,
                    CloudServices,
                    Emoji,
                    Essentials,
                    Heading,
                    ImageBlock,
                    ImageCaption,
                    ImageInline,
                    ImageInsert,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    MediaEmbed,
                    Mention,
                    Paragraph,
                    PasteFromOffice,
                    PictureEditing,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TextTransformation,
                    TodoList,
                    Underline,
                  ],
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "emoji",
                    "link",
                    "insertImage",
                    "ckbox",
                    "insertTable",
                    "blockQuote",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "todoList",
                    "outdent",
                    "indent",
                  ],
                }}
                data={formData.content}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData((prev) => ({ ...prev, content: data }));
                }}
                disabled={loading}
              />
            </div>
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