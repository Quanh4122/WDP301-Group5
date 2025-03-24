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

export const getRequestTrend = async () => {
  try {
    const response = await axios.get("http://localhost:3030/requestTrend");
    console.log("Request trend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching trend:", error);
    alert(error || "Failed to fetch trend");
    return [];
  }
};

export const getCarAvailability = async () => {
  try {
    const response = await axios.get("http://localhost:3030/getCarAvailability");
    console.log("Request trend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching trend:", error);
    alert(error || "Failed to fetch trend");
    return [];
  }
};

export const getIncomeData = async () => {
  try {
    const response = await axios.get("http://localhost:3030/getIncomeData");
    console.log("Request IncomeData:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching IncomeData:", error);
    alert(error || "Failed to fetch IncomeData");
    return [];
  }
};




  