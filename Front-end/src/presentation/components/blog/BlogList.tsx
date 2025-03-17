import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "./blogAPI";

// Define Post interface for TypeScript type safety
interface Post {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt?: string;
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

// Empty state component
const EmptyState: React.FC = () => (
  <div className="text-center py-10">
    <h3 className="text-gray-500 text-xl font-semibold">No posts found</h3>
    <p className="text-gray-400 mt-2">Check back later for new content!</p>
  </div>
);

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      setError("Failed to fetch posts. Please try again later.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Blog Posts</h1>

      {error && <ErrorMessage message={error} />}
      
      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
                <img
                  src={post.image}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  alt={post.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
              <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                <h5 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">
                  {post.title}
                </h5>
                <p className="text-gray-600 text-sm flex-grow line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-4">
                  <Link
                    to={`/app/blog/${post._id}`}
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-md transition-all duration-200 hover:shadow-md"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;