// api.ts
import axios from "axios";
import { backendHost } from "./api-config";
import type { AxiosInstance } from "axios";
const api: AxiosInstance = axios.create({
  baseURL: backendHost, // replace with your API URL
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
