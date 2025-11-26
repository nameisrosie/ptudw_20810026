import axios from "axios";
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);