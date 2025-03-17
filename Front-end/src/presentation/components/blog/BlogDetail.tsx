import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getBlogDetail } from "./blogAPI";

// Define Blog interface for TypeScript type safety
interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  dateCreate: string;
}

// Error component for better error handling
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    {message}
  </div>
);

// Loading component for better UX
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

// Not found component
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
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = useCallback(async () => {
    if (!postId) {
      setError("Invalid post ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const blogData = await getBlogDetail(postId);
      setBlog(blogData);
    } catch (err) {
      setError("Failed to fetch blog post. Please try again later.");
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!blog) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <article className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
              {blog.title}
            </h1>
            <p className="text-gray-600 text-center text-lg">
              {blog.description}
            </p>
          </header>

          <div className="relative mb-6 rounded-lg overflow-hidden shadow-md">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.jpg";
              }}
            />
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          <hr className="my-8 border-gray-200" />

          <footer className="text-center">
            <p className="text-gray-500 text-sm">
              <span className="font-semibold">Published on:</span>{" "}
              {new Date(blog.dateCreate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;