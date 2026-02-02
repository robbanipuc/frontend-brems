import api, { apiDownload } from './api';
import { buildQueryString } from '@/utils/helpers';

const reportService = {
  // Employee statistics
  async getEmployeeStatistics() {
    const response = await api.get('/reports/employee-statistics');
    return response.data;
  },

  // Transfer report
  async getTransferReport(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/reports/transfers${query}`);
    return response.data;
  },

  // Promotion report
  async getPromotionReport(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/reports/promotions${query}`);
    return response.data;
  },

  // Profile request report
  async getProfileRequestReport(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/reports/profile-requests${query}`);
    return response.data;
  },

  // Office report
  async getOfficeReport(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/reports/offices${query}`);
    return response.data;
  },

  // Form submission report
  async getFormSubmissionReport(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/reports/form-submissions${query}`);
    return response.data;
  },

  // Export statistics PDF
  async exportStatisticsPdf() {
    return apiDownload('/reports/employee-statistics/pdf', `statistics_${Date.now()}.pdf`);
  },

  // Export transfers PDF
  async exportTransfersPdf(params = {}) {
    const query = buildQueryString(params);
    return apiDownload(`/reports/transfers/pdf${query}`, `transfers_${Date.now()}.pdf`);
  },

  // Export promotions PDF
  async exportPromotionsPdf(params = {}) {
    const query = buildQueryString(params);
    return apiDownload(`/reports/promotions/pdf${query}`, `promotions_${Date.now()}.pdf`);
  },

  // Export offices PDF
  async exportOfficesPdf(params = {}) {
    const query = buildQueryString(params);
    return apiDownload(`/reports/offices/pdf${query}`, `offices_${Date.now()}.pdf`);
  },

  // Export profile requests PDF
  async exportProfileRequestsPdf(params = {}) {
    const query = buildQueryString(params);
    return apiDownload(`/reports/profile-requests/pdf${query}`, `profile_requests_${Date.now()}.pdf`);
  },
};

export default reportService;