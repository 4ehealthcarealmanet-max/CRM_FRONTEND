import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL,
});

// LOGIN API
export const loginApi = async (data) => {
  const res = await API.post("/api/login", data);
  return res.data;
};

// REGISTER API 
export const registerApi = async (data) => {
  const res = await API.post("/api/register", data);
  return res.data;
};