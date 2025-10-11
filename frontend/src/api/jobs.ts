import axiosClient from './axiosClient';

interface JobCreatePayload {
  title: string;
  company_name: string;
  location: string;
  description: string;
  min_qualifications: string;
  expected_qualifications: string;
  deadline: string;
  stipend?: number;
}

interface Internship {
  id: number;
  title: string;
  company_name: string;
  location: string;
  stipend?: number;
  description: string;
  min_qualifications?: string;
  expected_qualifications?: string;
  deadline: string;
  posted_at: string;
  posted_by_name: string;
}

interface ApplicantInfo {
  applicant_name: string;
  resume_path: string;
  status: string;
  applied_at: string;
}

export const createJob = async (payload: JobCreatePayload): Promise<Internship> => {
  const response = await axiosClient.post('/hr/job/create', payload);
  return response.data;
};

export const listApplicants = async (jobId: number): Promise<ApplicantInfo[]> => {
  const response = await axiosClient.get(`/hr/job/${jobId}/applicants`);
  return response.data;
};

export const exportApplicants = async (jobId: number): Promise<Blob> => {
  const response = await axiosClient.get(`/hr/export/${jobId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const listMyJobs = async (): Promise<Internship[]> => {
  const response = await axiosClient.get('/hr/my_jobs');
  return response.data;
};
