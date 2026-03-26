import { request } from './client';

export const getDashboardStats = () => {
  return request('/dashboard/stats');
};
