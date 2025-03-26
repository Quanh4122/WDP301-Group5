import axios from 'axios';
import { toast } from 'react-toastify';

// Định nghĩa interface cho dữ liệu bài viết
interface Post {
  _id?: string;
  title: string;
  description: string;
  dateCreate: string;
  author: string;
  image: string;
  content: string;
}

// Hàm tạo bài viết
export const postBlog = async ({
  title,
  description,
  dateCreate,
  author,
  image,
  content,
}: Post): Promise<any> => {
  try {
    const response = await axios.post('http://localhost:3030/postBlog', {
      title,
      description,
      dateCreate,
      author,
      image,
      content,
    });

    console.log("Post Created:", response.data);
    toast.success("Tạo bài viết thành công!");
    return response.data;
  } catch (error: any) {
    console.error("Error creating post:", error);
    toast.error(error.response?.data?.message || "Tạo bài viết thất bại!");
    throw error;
  }
};

// Hàm cập nhật bài viết
export const putBlog = async (
  postId: string,
  {
    title,
    description,
    dateCreate,
    author,
    image,
    content,
  }: Partial<Post> // Partial để các trường là tùy chọn
): Promise<any> => {
  try {
    const response = await axios.put(`http://localhost:3030/putBlog/${postId}`, {
      title,
      description,
      dateCreate,
      author,
      image,
      content,
    });

    console.log("Post Updated:", response.data);
    toast.success("Cập nhật bài viết thành công!");
    return response.data;
  } catch (error: any) {
    console.error("Error updating post:", error);
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