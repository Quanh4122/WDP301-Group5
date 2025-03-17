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

// Define BlogFormData interface for TypeScript type safety
interface BlogFormData {
  title: string;
  description: string;
  image: string;
  content: string;
}

// Error component for better error handling
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    {message}
  </div>
);

// Loading component for better UX
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const CreateBlog: React.FC = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    description: "",
    image: "",
    content: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Basic form validation
      if (!formData.title.trim() || !formData.description.trim()) {
        setError("Title and description are required fields");
        return;
      }

      const blogData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dateCreate: new Date().toISOString(),
        author: "67bb8e06a5fe4f4fe85dc19f", // Consider making this dynamic
        image: formData.image.trim(),
        content: formData.content,
      };

      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        await postBlog(blogData);
        setSuccess("Blog post created successfully!");
        
        // Reset form after successful submission
        setFormData({
          title: "",
          description: "",
          image: "",
          content: "",
        });
      } catch (err) {
        setError("Failed to create blog post. Please try again.");
        console.error("Error creating blog:", err);
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create New Blog Post
        </h1>

        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
              placeholder="Enter blog title"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
              placeholder="Enter blog description"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
              placeholder="Enter image URL"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <div className="rounded-md border border-gray-300">
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-all duration-200 hover:shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                  Submitting...
                </>
              ) : (
                "Create Post"
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