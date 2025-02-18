import axios from 'axios';

const API_URL = 'http://localhost:3030';
axios.defaults.withCredentials = true;


// User login
export const login = async (data: { email: string, password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  return axios.get(`${API_URL}/logout`);
};

// User registration
export const register = async (data: { userName: string, phoneNumber: string, email: string, password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = () => {
  return axios.get(`${API_URL}/users`);
};
