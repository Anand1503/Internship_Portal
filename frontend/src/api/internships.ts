import axiosClient from './axiosClient';

interface SearchParams {
  q?: string;
  company?: string;
  location?: string;
  page?: number;
  per_page?: number;
}

interface ApplyPayload {
  internship_id: number;
  resume_id: number;
  cover_letter?: string;
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

interface Application {
  id: number;
  internship_id: number;
  internship_title: string;
  internship_company: string;
  resume_id: number;
  resume_title: string;
  cover_letter?: string;
  status: string;
  applied_at: string;
}

export const searchInternships = async (params: SearchParams): Promise<Internship[]> => {
  const response = await axiosClient.get('/internships/search', { params });
  return response.data;
};

export const applyForInternship = async (payload: ApplyPayload): Promise<Application> => {
  const response = await axiosClient.post('/internships/apply', payload);
  return response.data;
};
