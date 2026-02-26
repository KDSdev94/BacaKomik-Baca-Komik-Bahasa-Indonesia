import axios from "axios";

export const api = axios.create({
  baseURL: "https://shivraapi.my.id/komikid",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
