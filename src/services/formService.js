import api, { apiUpload } from './api';
import { buildQueryString } from '@/utils/helpers';

const formService = {
  // Get all forms
  async getAll() {
    const response = await api.get('/forms');
    return response.data;
  },

  // Get single form
  async getById(id) {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },

  // Create form
  async create(data) {
    const response = await api.post('/forms', data);
    return response.data;
  },

  // Update form
  async update(id, data) {
    const response = await api.put(`/forms/${id}`, data);
    return response.data;
  },

  // Delete form
  async delete(id) {
    const response = await api.delete(`/forms/${id}`);
    return response.data;
  },

  // Toggle active status
  async toggleActive(id) {
    const response = await api.post(`/forms/${id}/toggle-active`);
    return response.data;
  },

  // Submit form
  async submit(formId, data, files = {}) {
    const formData = new FormData();
    
    // Append regular data
    Object.keys(data).forEach(key => {
      formData.append(`data[${key}]`, data[key]);
    });

    // Append files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(`files[${key}]`, files[key]);
      }
    });

    const response = await apiUpload(`/forms/${formId}/submit`, formData);
    return response.data;
  },

  // Get all submissions
  async getSubmissions(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/form-submissions${query}`);
    return response.data;
  },

  // Get submissions for specific form
  async getFormSubmissions(formId, params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/form-submissions/form/${formId}${query}`);
    return response.data;
  },

  // Get single submission
  async getSubmission(id) {
    const response = await api.get(`/form-submissions/${id}`);
    return response.data;
  },

  // Update submission status
  async updateSubmissionStatus(id, status) {
    const response = await api.put(`/form-submissions/${id}/status`, { status });
    return response.data;
  },

  // Get my submissions
  async getMySubmissions() {
    const response = await api.get('/my-submissions');
    return response.data;
  },
};

export default formService;