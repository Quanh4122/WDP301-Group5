import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getBlogDetail } from "./blogAPI";
import { toast } from "react-toastify";

interface Blog {
  _id: string;
  title: string;
  description: string;
  images: string[]; // Mảng ảnh
  dateCreate: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">
      <span className="sr-only">Đang tải...</span>
    </div>
  </div>
);

const NotFound: React.FC = () => (
  <div className="container mx-auto px-4 py-10 text-center">
    <h2 className="text-2xl font-bold text-red-600">Không tìm thấy bài viết!</h2>
    <p className="text-gray-500 mt-2">Bài viết bạn tìm không tồn tại!</p>
  </div>
);

const BlogDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]); // Mảng để theo dõi lỗi từng ảnh

  const BASE_URL = "http://localhost:3030";
  const FALLBACK_IMAGE = "/placeholder-image.jpg";
  const WORDS_PER_IMAGE = 150; // Số từ tối thiểu để chèn thêm một ảnh

  const fetchBlog = useCallback(async () => {
    if (!postId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setImageErrors([]); // Reset trạng thái lỗi ảnh

      // Check localStorage first
      const storedPosts = localStorage.getItem("posts");
      if (storedPosts) {
        const posts: Blog[] = JSON.parse(storedPosts);
        const localBlog = posts.find((post) => post._id === postId);
        if (localBlog) {
          const normalizedBlog = {
            ...localBlog,
            images: Array.isArray(localBlog.images) ? localBlog.images : [],
          };
          setBlog(normalizedBlog);
          setImageErrors(new Array(normalizedBlog.images.length).fill(false));
          setLoading(false);
          return;
        }
      }

      // Fetch from API if not in localStorage
      const blogData = await getBlogDetail(postId);
      const normalizedBlog = {
        ...blogData,
        images: Array.isArray(blogData.images)
          ? blogData.images
          : blogData.image
          ? [blogData.image]
          : [],
      };
      setBlog(normalizedBlog);
      setImageErrors(new Array(normalizedBlog.images.length).fill(false));
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

  // Hàm lấy URL ảnh
  const getImageUrl = (index: number): string => {
    if (!blog?.images || !blog.images[index] || imageErrors[index]) return FALLBACK_IMAGE;
    if (blog.images[index].startsWith("http")) return blog.images[index];
    return `${BASE_URL}${blog.images[index].startsWith("/") ? "" : "/"}${blog.images[index]}`;
  };

  // Hàm xử lý lỗi ảnh
  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  // Hàm chia nhỏ description thành các đoạn theo số từ và chèn ảnh
  const splitDescriptionWithImages = (text: string, images: string[], wordsPerImage: number = WORDS_PER_IMAGE) => {
    const words = text.trim().split(/\s+/); // Tách thành mảng các từ
    const totalWords = words.length;
    const segments: { text: string; imageIndex?: number }[] = [];
    let currentWordIndex = 0;
    let imageIndex = 1; // Bắt đầu từ ảnh thứ hai (ảnh đầu tiên hiển thị ở đầu bài)

    // Ảnh đầu tiên luôn hiển thị ở đầu bài, nên không cần chia đoạn cho nó
    while (currentWordIndex < totalWords) {
      const segmentWords = words.slice(currentWordIndex, currentWordIndex + wordsPerImage);
      segments.push({ text: segmentWords.join(" ") });
      
      currentWordIndex += wordsPerImage;
      
      // Nếu còn ảnh và chưa hết đoạn, chèn ảnh xen kẽ
      if (imageIndex < images.length && currentWordIndex < totalWords) {
        segments.push({ text: "", imageIndex });
        imageIndex++;
      }
    }

    return segments;
  };

  if (loading) return <LoadingSpinner />;
  if (!blog) return <NotFound />;

  const segments = splitDescriptionWithImages(blog.description, blog.images);
  const wordCount = blog.description.trim().split(/\s+/).length;

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
          </header>

          {/* Ảnh đầu tiên (luôn hiển thị ở đầu) */}
          {blog.images && blog.images.length > 0 && (
            <div className="relative mb-6 rounded-lg overflow-hidden shadow-md">
              <img
                src={getImageUrl(0)}
                alt={`${blog.title} - Ảnh 1`}
                className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                onError={() => handleImageError(0)}
              />
            </div>
          )}

          {/* Nội dung xen kẽ với ảnh */}
          {segments.map((segment, index) => (
            <div key={index}>
              {segment.text && (
                <p className="text-gray-600 text-lg mb-6">{segment.text}</p>
              )}
              {segment.imageIndex !== undefined && blog.images[segment.imageIndex] && (
                <div className="relative mb-6 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={getImageUrl(segment.imageIndex)}
                    alt={`${blog.title} - Ảnh ${segment.imageIndex + 1}`}
                    className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={() => handleImageError(segment.imageIndex ?? 0)}
                  />
                </div>
              )}
            </div>
          ))}

          <hr className="my-8 border-gray-200" />
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;