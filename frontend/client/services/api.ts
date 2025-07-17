// client/services/api.ts
import axios from "axios";

const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://your-backend-domain.com/api"
    : "/api"; // thanks to Vite proxy in dev

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
