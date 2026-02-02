import api, { apiUpload, apiDownload } from './api';
import { buildQueryString } from '@/utils/helpers';

const employeeService = {
  // Get all employees with filters
  async getAll(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/employees${query}`);
    return response.data;
  },

  // Get single employee
  async getById(id) {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create employee
  async create(data) {
    const response = await api.post('/employees', data);
    return response.data;
  },

  // Update employee basic info
  async update(id, data) {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  // Update full profile (with family, address, academics)
  async updateFullProfile(id, data) {
    const response = await api.post(`/employees/${id}/update-full`, data);
    return response.data;
  },

  // Delete employee
  async delete(id) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Verify employee
  async verify(id) {
    const response = await api.put(`/employees/${id}/verify`);
    return response.data;
  },

  // Release employee for transfer
  async release(id, data) {
    const response = await api.post(`/employees/${id}/release`, data);
    return response.data;
  },

  // Transfer employee
  async transfer(id, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    const response = await apiUpload(`/employees/${id}/transfer`, formData);
    return response.data;
  },

  // Promote employee
  async promote(id, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    const response = await apiUpload(`/employees/${id}/promote`, formData);
    return response.data;
  },

  // Retire employee
  async retire(id) {
    const response = await api.post(`/employees/${id}/retire`);
    return response.data;
  },

  // Get released employees
  async getReleased() {
    const response = await api.get('/employees/released');
    return response.data;
  },

  // Upload photo
  async uploadPhoto(id, file, onProgress) {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await apiUpload(`/employees/${id}/photo`, formData, onProgress);
    return response.data;
  },

  // Upload document
  async uploadDocument(id, documentType, file, onProgress) {
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('document', file);
    const response = await apiUpload(`/employees/${id}/document`, formData, onProgress);
    return response.data;
  },

  // Manage user access
  async manageAccess(id, data) {
    const response = await api.post(`/employees/${id}/access`, data);
    return response.data;
  },

  // Export CSV
  async exportCSV(params = {}) {
    const query = buildQueryString(params);
    return apiDownload(`/employees/export-csv${query}`, `employees_${Date.now()}.csv`);
  },

  // Export PDF
  async exportPDF(params = {}) {
    const query = buildQueryString(params);
    return apiDownload(`/employees/export-pdf${query}`, `employees_${Date.now()}.pdf`);
  },

  // Download profile PDF
  async downloadProfilePdf(id) {
    return apiDownload(`/employees/${id}/download-pdf`, `employee_${id}_profile.pdf`);
  },

  // Get employee transfers
  async getTransfers(id) {
    const response = await api.get(`/employees/${id}/transfers`);
    return response.data;
  },

  // Get employee promotions
  async getPromotions(id) {
    const response = await api.get(`/employees/${id}/promotions`);
    return response.data;
  },

  // Get employee timeline
  async getTimeline(id) {
    const response = await api.get(`/employees/${id}/timeline`);
    return response.data;
  },
};

export default employeeService;