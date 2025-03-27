import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
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
import { getBlogDetail, updateBlog } from "../blog/blogAPI";

// Define the blog form data interface.
interface BlogFormData {
  title: string;
  description: string;
  image: string;
  content: string;
}

// Reusable error and success messages.
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl" role="alert">
    {message}
  </div>
);

const SuccessMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl" role="alert">
    {message}
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500">
      <span className="sr-only">Đang tải...</span>
    </div>
  </div>
);

// Custom upload adapter (for CKEditor inline images).
class MyUploadAdapter {
  loader: any;
  url: string;
  constructor(loader: any) {
    this.loader = loader;
    this.url = "http://localhost:3030/upload-blog-image";
  }
  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("avatar", file);

          fetch(this.url, {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                return Promise.reject("Upload failed");
              }
              return response.json();
            })
            .then((result) => {
              // Prepend the full URL for the uploaded image.
              resolve({ default: `http://localhost:3030${result.url}` });
            })
            .catch((error) => {
              console.error("Upload adapter error:", error);
              reject(error);
            });
        })
    );
  }
  abort() {
    // Optional: Implement abort functionality if needed.
  }
}

function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

const EditBlog: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // Expecting a route param, e.g., /edit-blog/:id

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    description: "",
    image: "",
    content: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch blog data on mount.
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setInitialLoading(true);
        const blog = await getBlogDetail(postId);
        setFormData({
          title: blog.title,
          description: blog.description,
          image: blog.image, // assume this is the full URL already.
          content: blog.content,
        });
      } catch (err) {
        setError("Không thể tải bài viết. Vui lòng thử lại.");
        console.error("Error fetching blog:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchBlog();
  }, [postId]);

  // Handler for text field changes.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for thumbnail file upload.
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataForUpload = new FormData();
      formDataForUpload.append("thumbnail", file);

      try {
        const response = await fetch("http://localhost:3030/upload-blog-thumbnail", {
          method: "POST",
          body: formDataForUpload,
        });
        if (!response.ok) {
          throw new Error("Thumbnail upload failed");
        }
        const result = await response.json();
        const fullImageUrl = `http://localhost:3030${result.url}`;
        setFormData((prev) => ({ ...prev, image: fullImageUrl }));
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        setError("Lỗi khi tải ảnh đại diện lên. Vui lòng thử lại.");
      }
    }
  };

  // Handle form submission.
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formData.title.trim() || !formData.description.trim()) {
        setError("Tiêu đề và mô tả là các trường bắt buộc");
        return;
      }

      const updatedBlogData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dateUpdate: new Date().toISOString(), // You might want to record update time.
        image: formData.image.trim(),
        content: formData.content,
      };

      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        await updateBlog(postId, updatedBlogData);
        setSuccess("Bài viết đã được cập nhật thành công!");

        
      } catch (err) {
        console.error("Lỗi khi cập nhật bài viết:", err);
        setError("Không thể cập nhật bài viết. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [formData, postId]
  );

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Chỉnh Sửa Bài Viết</h1>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={handleThumbnailUpload}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-gray-50"
              disabled={loading}
            />
            {formData.image && (
              <div className="mt-4">
                <img src={formData.image} alt="Thumbnail preview" className="max-w-xs rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
            <div className="rounded-lg border border-gray-300 shadow-sm">
              <CKEditor
                editor={ClassicEditor}
                config={{
                  extraPlugins: [MyCustomUploadAdapterPlugin],
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
                "Cập nhật Bài Viết"
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

export default EditBlog;
