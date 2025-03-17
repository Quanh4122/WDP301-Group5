import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, deletePost } from "./blogAPI";

// Define Post interface for TypeScript type safety
interface Post {
  _id: string;
  title: string;
  description: string;
  image: string;
  dateCreate: string;
  author: string;
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
    <p className="text-gray-400 mt-2">Click "Add New" to create your first blog post!</p>
  </div>
);

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts using useCallback for better performance
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      setError("Error loading posts. Please try again later.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle deleting a blog post with better error handling
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post._id !== id));
      // Optional: Add success notification here
    } catch (err) {
      setError("Error deleting post. Please try again.");
      console.error("Error deleting post:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Blog Manager</h2>
        <Link
          to="/app/createBlog"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-200 hover:shadow-md"
        >
          Add New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {post.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(post.dateCreate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-16 w-16 object-cover rounded-md"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.jpg";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all duration-200 hover:shadow-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;