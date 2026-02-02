import api from './api';
import { STORAGE_KEYS } from '@/utils/constants';

const authService = {
  /**
   * Login user
   */
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    const { access_token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    
    return { token: access_token, user };
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/user');
    const user = response.data;
    
    // Update stored user data
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    
    return user;
  },

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword, newPasswordConfirmation) {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
    return response.data;
  },

  /**
   * Check if user is authenticated (local check)
   */
  isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Get stored user data
   */
  getStoredUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Clear auth data
   */
  clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};

export default authService;