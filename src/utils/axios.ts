import axios from "axios";
import config from "../envConfig";

const axiosClient = axios.create({
  baseURL: config.endpoint,
});

const getLocalUserData = () => {
  const userData = localStorage.getItem("qa-user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user?.token;
    } catch (error) {}
  }
  return null;
};

axiosClient.interceptors.request.use((config) => {
  const token = getLocalUserData();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
    }
    throw error;
  }
);

export default axiosClient;
