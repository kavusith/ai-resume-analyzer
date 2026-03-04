import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',  // ← hardcoded directly
});

export const analyzeResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  const response = await API.post('/api/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await API.get('/api/resume/history');
  return response.data;
};

export const getAnalysis = async (id) => {
  const response = await API.get(`/api/resume/${id}`);
  return response.data;
};