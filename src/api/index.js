import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

// PRIZES
export const getPrizes = () => api.get("/prizes");
export const createPrize = (data) => api.post("/prizes", data);
export const updatePrize = (id, data) => api.put(`/prizes/${id}`, data);
export const deletePrize = (id) => api.delete(`/prizes/${id}`);

// HISTORY / SPIN
export const getHistory = () => api.get("/history");
export const addHistory = (data) => api.post("/history", data);

export default api;
