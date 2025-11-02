import axios, { AxiosError } from 'axios';
import axiosClient from './axiosClient';

// Centralized API client with all endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      try {
        // Use URLSearchParams for form data
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        
        const response = await axiosClient.post('/auth/login', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        return response;
      } catch (error: unknown) {
        console.error('Login error:', error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.error('Response data:', axiosError.response.data);
            console.error('Response status:', axiosError.response.status);
            console.error('Response headers:', axiosError.response.headers);
          } else if (axiosError.request) {
            console.error('No response received:', axiosError.request);
            throw new Error('No response received from server. Please check your network connection.');
          }
          throw new Error(axiosError.message);
        }
        throw new Error('An unexpected error occurred during login');
      }
    },
    register: (userData: any) => 
      axiosClient.post('/auth/register', userData),
    getMe: () => 
      axiosClient.get('/auth/me'),
    updateProfile: (data: { name: string }) => 
      axiosClient.put('/auth/me', data),
  },

  // Internship endpoints
  internships: {
    getAll: (params?: any) => 
      axiosClient.get('/internships/', { params }),
    getById: (id: number) => 
      axiosClient.get(`/internships/${id}`),
    create: (data: any) => 
      axiosClient.post('/internships/', data),
  },

  // Application endpoints
  applications: {
    getMyApplications: () => 
      axiosClient.get('/applications/me'),
    apply: (internshipId: number, resumeId: number, coverLetter?: string) => 
      axiosClient.post('/applications/', { 
        internship_id: internshipId, 
        resume_id: resumeId,
        cover_letter: coverLetter 
      }),
    getJobApplications: (jobId: number) => 
      axiosClient.get(`/hr/applications/${jobId}`),
  },

  // Resume endpoints
  resumes: {
    upload: (formData: FormData) => 
      axiosClient.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    getMyResumes: () => 
      axiosClient.get('/resumes/me'),
    delete: (id: number) => 
      axiosClient.delete(`/resumes/${id}`),
    download: (id: number) => 
      axiosClient.get(`/resumes/${id}/download`, { responseType: 'blob' }),
  },

  // HR endpoints
  hr: {
    getMyJobs: () => 
      axiosClient.get('/hr/my_jobs'),
    getJobApplications: (jobId: number) => 
      axiosClient.get(`/hr/applications/${jobId}`),
    updateApplicationStatus: (applicationId: number, status: string) => 
      axiosClient.put(`/hr/applications/${applicationId}/status`, { status }),
  },

  // Export endpoints
  export: {
    jobCandidates: (jobId: number) => 
      axiosClient.get(`/hr/export/${jobId}`, { responseType: 'blob' }),
  }
};

export default api;
