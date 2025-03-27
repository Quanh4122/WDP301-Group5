import axios from 'axios';

export const postBlog = async ({title, description, dateCreate, author, image, content} : any) => {
    try {
      const response = await axios.post('http://localhost:3030/postBlog', {
        title,
        description,
        dateCreate,
        author,
        image,
        content
    });
  
      console.log("Post Created:", response.data);
      alert("Post created successfully!");
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error || "Failed to create post");
    }
  };



export const getBlogDetail = async (postId : any) => {
    try {
        const response = await axios.get(`http://localhost:3030/blog/${postId}`);
        return response.data; // Expected to return blog object
    } catch (error) {
        console.error("Error fetching blog:", error);
    }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get("http://localhost:3030/blog");
    console.log("All Posts:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const deletePost = async (postId : any) => {
  try {
    const response = await axios.delete(`http://localhost:3030/blog/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting posts:", error);
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


  