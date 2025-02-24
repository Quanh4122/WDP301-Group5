import axios from 'axios';

export const postBlog = async ({title, description, dateCreate, author, image, content}) => {
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
      console.error("Error creating post:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create post");
    }
  };



export const getBlogDetail = async (postId) => {
    try {
        const response = await axios.get(`http://localhost:3030/blog/${postId}`);
        return response.data; // Expected to return blog object
    } catch (error) {
        console.error("Error fetching blog:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch blog");
    }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get("http://localhost:3030/blog");
    console.log("All Posts:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to fetch posts");
    return [];
  }
};



  