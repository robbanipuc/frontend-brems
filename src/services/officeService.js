import api from './api';
import { buildQueryString } from '@/utils/helpers';

const officeService = {
  // Get all offices
  async getAll(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/offices${query}`);
    return response.data;
  },

  // Get office tree
  async getTree() {
    const response = await api.get('/offices/tree');
    return response.data;
  },

  // Get managed offices
  async getManaged() {
    const response = await api.get('/offices/managed');
    return response.data;
  },

  // Get single office
  async getById(id) {
    const response = await api.get(`/offices/${id}`);
    return response.data;
  },

  // Create office
  async create(data) {
    const response = await api.post('/offices', data);
    return response.data;
  },

  // Update office
  async update(id, data) {
    const response = await api.put(`/offices/${id}`, data);
    return response.data;
  },

  // Delete office
  async delete(id) {
    const response = await api.delete(`/offices/${id}`);
    return response.data;
  },
};

export default officeService;