import axios from 'axios';
import { toast } from 'react-toastify';

// Định nghĩa interface cho dữ liệu bài viết
interface Post {
  _id?: string;
  title: string;
  description: string;
  dateCreate: string;
  images?: (string | File)[]; // Thay đổi từ image thành images, là mảng
  dateUpdated?: string;
}

// Hàm tạo bài viết
export const postBlog = async ({
  title,
  description,
  dateCreate,
  images, // Thay đổi từ image thành images
}: Post): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dateCreate", dateCreate);

    // Xử lý mảng images
    if (images && Array.isArray(images)) {
      images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img); // Thêm từng file vào FormData
        } else if (typeof img === "string" && img) {
          formData.append("images", img); // Nếu là URL (ít xảy ra trong create)
        }
      });
    }

    const response = await axios.post("http://localhost:3030/postBlog", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
  { title, description, dateCreate, images }: Partial<Post> // Thay đổi từ image thành images
): Promise<Post> => {
  try {
    const formData = new FormData();
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (dateCreate) formData.append("dateCreate", dateCreate);

    // Xử lý mảng images
    if (images && Array.isArray(images)) {
      images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img); // Thêm file mới
        } else if (typeof img === "string" && img) {
          formData.append("existingImages", img); // Gửi ảnh cũ dưới dạng chuỗi
        }
      });
    }

    const response = await axios.put(`http://localhost:3030/putBlog/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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


export const updateBlog = async (postId : any, updatedBlogData :any) => {
  try {
    const response = await axios.put(`http://localhost:3030/update-blog/${postId}`, updatedBlogData);
    return response.data;
  } catch (error) {
    console.error("Error updating posts:", error);
  }
};


  
