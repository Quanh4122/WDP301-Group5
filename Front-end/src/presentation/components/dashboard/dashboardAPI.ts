import axios from 'axios';

export const getUserTrend = async () => {
  try {
    const response = await axios.get("http://localhost:3030/userTrend");
    console.log("User trend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching trend:", error);
    alert(error || "Failed to fetch trend");
    return [];
  }
};



  