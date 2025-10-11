import apiClient from './axiosClient';

export const getApplications = async () => {
  const response = await apiClient.get('/applications/me');
  return response.data;
};
