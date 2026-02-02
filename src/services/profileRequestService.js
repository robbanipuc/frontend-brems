import api, { apiUpload, apiDownload } from './api';
import { buildQueryString } from '@/utils/helpers';

const profileRequestService = {
  // Get all requests (admin)
  async getAll(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/profile-requests${query}`);
    return response.data;
  },

  // Get pending requests
  async getPending() {
    const response = await api.get('/profile-requests/pending');
    return response.data;
  },

  // Get my requests
  async getMyRequests() {
    const response = await api.get('/profile-requests/my');
    return response.data;
  },

  // Get single request
  async getById(id) {
    const response = await api.get(`/profile-requests/${id}`);
    return response.data;
  },

  // Submit request
  async submit(data, files = {}) {
    const formData = new FormData();
    formData.append('request_type', data.request_type);
    formData.append('details', data.details || '');
    formData.append('proposed_changes', JSON.stringify(data.proposed_changes));

    // Append files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    const response = await apiUpload('/profile-requests', formData);
    return response.data;
  },

  // Process request (approve/reject)
  async process(id, data) {
    const response = await api.put(`/profile-requests/${id}`, data);
    return response.data;
  },

  // Cancel request
  async cancel(id) {
    const response = await api.delete(`/profile-requests/${id}/cancel`);
    return response.data;
  },

  // Download report
  async downloadReport(id) {
    return apiDownload(`/profile-requests/${id}/report`, `request_${id}_report.pdf`);
  },
};

export default profileRequestService;