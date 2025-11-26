import axios from "axios";
export const http = axios.create({
  baseURL: "/api/v1", 
  
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);