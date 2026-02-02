import api from './api';

const dashboardService = {
  // Get dashboard data
  async getDashboard() {
    const response = await api.get('/dashboard');
    return response.data;
  },
};

export default dashboardService;