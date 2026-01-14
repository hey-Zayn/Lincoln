import axios from "axios";


const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "production"
        ? "https://lincoln-backend.vercel.app/api"
        : "http://localhost:3000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
