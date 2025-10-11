import axiosClient from './axiosClient';

interface UploadPayload {
  title: string;
  file: File;
}

interface Resume {
  id: number;
  title: string;
  file_path: string;
  created_at: string;
}

export const uploadResume = async (formData: FormData): Promise<Resume> => {
  const response = await axiosClient.post('/resumes/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const listMyResumes = async (): Promise<Resume[]> => {
  const response = await axiosClient.get('/resumes/me');
  return response.data;
};
