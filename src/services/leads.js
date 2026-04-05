import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE,
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== LEAD TYPES API ====================
export const getLeadTypes = async () => {
  const response = await API.get("/api/lead-types");
  return response.data;
};

// ==================== SOURCES API ====================
export const getSources = async () => {
  const response = await API.get("/api/sources");
  return response.data;
};

// ==================== LEADS API ====================
export const getLeads = async (params = {}) => {
  const response = await API.get("/api/leads", { params });
  return response.data;
};

export const getLeadById = async (id) => {
  const response = await API.get(`/api/leads/${id}`);
  return response.data;
};

export const createLead = async (data) => {
  const response = await API.post("/api/leads", data);
  return response.data;
};

export const updateLeadStatus = async (id, status, notes = "") => {
  const response = await API.put(`/api/leads/${id}/status`, { status, notes });
  return response.data;
};

// ==================== DOCTORS API (from leads + lead_details) ====================
export const getDoctors = async () => {
  const response = await API.get("/api/leads?lead_type_id=2");
  return response.data;
};

// ==================== HOSPITALS API ====================
export const getHospitals = async () => {
  const response = await API.get("/api/leads?lead_type_id=3");
  return response.data;
};

// ==================== ACTIVITIES API ====================
export const getLeadActivities = async (leadId) => {
  const response = await API.get(`/api/leads/${leadId}/activity`);
  return response.data;
};


// ==================== FOLLOW-UP APIs ====================
export const updateLeadFollowUp = async (id, next_follow_up, follow_up_notes = "") => {
  const response = await API.put(`/api/leads/${id}/followup`, { next_follow_up, follow_up_notes });
  return response.data;
};

export const getTodayFollowUps = async () => {
  const response = await API.get("/api/followups/today");
  return response.data;
};

export const completeFollowUp = async (followUpId, notes = "") => {
  const response = await API.put(`/api/followups/${followUpId}/complete`, { notes });
  return response.data;
};

// Add these functions to your existing leads.js

// ==================== USER DASHBOARD ====================
export const getMyLeads = async (params = {}) => {
  const response = await API.get("/api/leads/my", { params });
  return response.data;
};

// ==================== VERIFIER DASHBOARD ====================
export const getPendingLeads = async (params = {}) => {
  const response = await API.get("/api/leads/pending", { params });
  return response.data;
};

export const assignLead = async (leadId, assignedTo, notes = "") => {
  const response = await API.put(`/api/leads/${leadId}/assign`, { assigned_to: assignedTo, notes });
  return response.data;
};

export const getMyAssignedLeads = async (params = {}) => {
  const response = await API.get("/api/leads/my-assigned", { params });
  return response.data;
};

export const verifyLead = async (leadId, isAuthentic, notes = "") => {
  const response = await API.put(`/api/leads/${leadId}/verify`, { is_authentic: isAuthentic, notes });
  return response.data;
};

// ==================== APPROVER DASHBOARD ====================
export const getVerifiedLeads = async (params = {}) => {
  const response = await API.get("/api/leads/verified", { params });
  return response.data;
};

export const approveLead = async (leadId, notes = "") => {
  const response = await API.put(`/api/leads/${leadId}/approve`, { notes });
  return response.data;
};

export const convertLead = async (leadId) => {
  const response = await API.post(`/api/leads/${leadId}/convert`);
  return response.data;
};

export const getConvertedLeads = async (params = {}) => {
  const response = await API.get("/api/leads/converted", { params });
  return response.data;
};

// ==================== ACTIVITY APIs ====================
export const addLeadActivity = async (leadId, activityData) => {
  const response = await API.post(`/api/leads/${leadId}/activity`, activityData);
  return response.data;
};


export const getWorkerActivities = async (params = {}) => {
  const response = await API.get("/api/worker-activities", { params });
  return response.data;
};
