import api from './api';
import { buildQueryString } from '@/utils/helpers';

const userService = {
  // Get all users
  async getAll(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`/users${query}`);
    return response.data;
  },

  // Get single user
  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  async create(data) {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Update user
  async update(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  async delete(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Reset password
  async resetPassword(id, newPassword) {
    const response = await api.post(`/users/${id}/reset-password`, { new_password: newPassword });
    return response.data;
  },

  // Toggle active status
  async toggleActive(id) {
    const response = await api.post(`/users/${id}/toggle-active`);
    return response.data;
  },

  // Get office admins
  async getOfficeAdmins() {
    const response = await api.get('/users/office-admins');
    return response.data;
  },

  // Assign office admin
  async assignOfficeAdmin(userId, officeId) {
    const response = await api.post('/users/assign-office-admin', {
      user_id: userId,
      office_id: officeId,
    });
    return response.data;
  },
};

export default userService;