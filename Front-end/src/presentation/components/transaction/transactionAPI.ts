import axios from 'axios';


export const getAllPosts = async () => {
  try {
    const response = await axios.get("http://localhost:3030/bill");
    console.log("All Bills:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    alert(error || "Failed to fetch posts");
    return [];
  }
};


export const switchBillStatus = async (billId : any) => {
    try {
        const response = await axios.patch(`http://localhost:3030/bill/${billId}`);
        return response.data; // Expected to return blog object
    } catch (error) {
        console.error("Error fetching blog:", error);
    }
};




  