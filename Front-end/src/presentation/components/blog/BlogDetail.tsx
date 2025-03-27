import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getBlogDetail } from "./blogAPI";
import { toast } from "react-toastify";

interface Blog {
  _id: string;
  title: string;
  description: string;
  image?: string; // Optional image field
  dateCreate: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const NotFound: React.FC = () => (
  <div className="container mx-auto px-4 py-10 text-center">
    <h2 className="text-2xl font-bold text-red-600">Blog not found!</h2>
    <p className="text-gray-500 mt-2">The blog post you're looking for doesn't exist.</p>
  </div>
);

const BlogDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  const BASE_URL = "http://localhost:3030"; // Define base URL as constant
  const FALLBACK_IMAGE = "/placeholder-image.jpg"; // Define fallback image

  const fetchBlog = useCallback(async () => {
    if (!postId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setImageError(false); // Reset image error state

      // Check localStorage first
      const storedPosts = localStorage.getItem("posts");
      if (storedPosts) {
        const posts: Blog[] = JSON.parse(storedPosts);
        const localBlog = posts.find((post) => post._id === postId);
        if (localBlog) {
          setBlog(localBlog);
          setLoading(false);
          return;
        }
      }

      // Fetch from API if not in localStorage
      const blogData = await getBlogDetail(postId);
      setBlog(blogData);
    } catch (err) {
      console.error("Failed to fetch blog:", err);
      toast.error("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  // Function to get the correct image URL
  const getImageUrl = (): string => {
    if (!blog?.image || imageError) return FALLBACK_IMAGE;
    
    // If image is already a full URL, return it
    if (blog.image.startsWith("http")) return blog.image;
    
    // Construct full URL if it's a relative path
    return `${BASE_URL}${blog.image.startsWith("/") ? "" : "/"}${blog.image}`;
  };

  if (loading) return <LoadingSpinner />;
  if (!blog) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-10">
      <article className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <p className="text-gray-500 text-sm text-right p-3">
          <span className="font-semibold">Ngày tạo: </span>
          {new Date(blog.dateCreate).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        
        <div className="p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
              {blog.title}
            </h1>
            <p className="text-gray-600 text-center text-lg">{blog.description}</p>
          </header>

          <div className="relative mb-6 rounded-lg overflow-hidden shadow-md">
            <img
              src={getImageUrl()}
              alt={blog.title}
              className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={() => {
                console.log(`Failed to load image: ${getImageUrl()}`);
                setImageError(true);
              }}
            />
          </div>
          <hr className="my-8 border-gray-200" />
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;