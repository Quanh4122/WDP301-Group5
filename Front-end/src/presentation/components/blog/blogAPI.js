import axios from 'axios';

const postBlog = async ({title, description, dateCreate, author, image, content}) => {
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

  export default postBlog
  