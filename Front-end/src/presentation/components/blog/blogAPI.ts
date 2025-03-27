import axios from 'axios';
import { toast } from 'react-toastify';

// Định nghĩa interface cho dữ liệu bài viết
interface Post {
  _id?: string;
  title: string;
  description: string;
  dateCreate: string;
  image?: string | File; // Có thể là URL (string) hoặc File khi upload
  dateUpdated?: string; // Thêm trường dateUpdated (tùy chọn)
}

// Hàm tạo bài viết
export const postBlog = async ({
  title,
  description,
  dateCreate,
  image,
}: Post): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dateCreate', dateCreate);

    // Nếu image là File (từ input file), thêm vào FormData
    if (image instanceof File) {
      formData.append('image', image);
    } else if (typeof image === 'string' && image) {
      formData.append('image', image); // Nếu là URL (ít xảy ra trong create)
    }

    const response = await axios.post('http://localhost:3030/postBlog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Bài viết đã được tạo:", response.data);
    toast.success("Tạo bài viết thành công!");
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi tạo bài viết:", error);
    toast.error(error.response?.data?.message || "Tạo bài viết thất bại!");
    throw error;
  }
};

// Hàm putBlog với type cụ thể hơn
export const putBlog = async (
  postId: string,
  { title, description, dateCreate, image }: Partial<Post>
): Promise<Post> => {
  try {
    const formData = new FormData();
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (dateCreate) formData.append('dateCreate', dateCreate);
    if (image instanceof File) {
      formData.append('image', image);
    } else if (typeof image === 'string' && image) {
      formData.append('image', image);
    }

    const response = await axios.put(`http://localhost:3030/putBlog/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const updatedPost = response.data;
    toast.success("Cập nhật bài viết thành công!");
    return updatedPost;
  } catch (error: any) {
    console.error("Lỗi khi cập nhật bài viết:", error);
    toast.error(error.response?.data?.message || "Cập nhật bài viết thất bại!");
    throw error;
  }
};

// Hàm lấy chi tiết bài viết
export const getBlogDetail = async (postId: string): Promise<any> => {
  try {
    const response = await axios.get(`http://localhost:3030/blog/${postId}`);
    return response.data; // Expected to return blog object
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

// Hàm lấy tất cả bài viết
export const getAllPosts = async (): Promise<any[]> => {
  try {
    const response = await axios.get("http://localhost:3030/blog");
    console.log("All Posts:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// Hàm xóa bài viết
export const deletePost = async (postId: string): Promise<any> => {
  try {
    const response = await axios.delete(`http://localhost:3030/blog/${postId}`);
    toast.success("Xóa bài viết thành công!");
    return response.data;
  } catch (error: any) {
    console.error("Error deleting posts:", error);
    toast.error(error.response?.data?.message || "Xóa bài viết thất bại!");
    throw error;
  }
};