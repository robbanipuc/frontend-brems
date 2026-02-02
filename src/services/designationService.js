import api from './api';
import { buildQueryString } from '@/utils/helpers';

const designationService = {
  // Get all designations
  async getAll(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/designations${query}`);
    return response.data;
  },

  // Get single designation
  async getById(id) {
    const response = await api.get(`/designations/${id}`);
    return response.data;
  },

  // Create designation
  async create(data) {
    const response = await api.post('/designations', data);
    return response.data;
  },

  // Update designation
  async update(id, data) {
    const response = await api.put(`/designations/${id}`, data);
    return response.data;
  },

  // Delete designation
  async delete(id) {
    const response = await api.delete(`/designations/${id}`);
    return response.data;
  },
};

export default designationService;