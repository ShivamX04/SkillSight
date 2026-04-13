import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Clean axios instance
const api = axios.create({
  baseURL: API_URL,
});

// ✅ 🔥 INTERCEPTOR (AUTO ADD TOKEN)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("🔥 INTERCEPTOR TOKEN:", token); // debug

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================== APIs ================== //

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview", formData);

  return response.data;
};

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(
    `/api/interview/report/${interviewId}`
  );

  return response.data;
};

export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview");

  return response.data;
};

// ✅ FIXED (GET + blob)
export const generateResumePdf = async (interviewReportId) => {
  const response = await api.get(
    `/api/interview/resume/pdf/${interviewReportId}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};