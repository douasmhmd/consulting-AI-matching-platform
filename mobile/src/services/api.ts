import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Cross-platform token storage
const tokenStorage = {
  getToken: async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("jwt_token");
    }
    return await SecureStore.getItemAsync("jwt_token");
  },
  setToken: async (token: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem("jwt_token", token);
    } else {
      await SecureStore.setItemAsync("jwt_token", token);
    }
  },
  removeToken: async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("jwt_token");
    } else {
      await SecureStore.deleteItemAsync("jwt_token");
    }
  },
};

const API = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // ✅ increase from 10s to 30s
});

API.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenStorage.removeToken();
    }
    return Promise.reject(error);
  }
);

export { tokenStorage };
export default API;