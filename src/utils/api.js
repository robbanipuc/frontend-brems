import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data?.message);
    }

    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      console.error('Validation error:', error.response.data?.errors);
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data?.message);
    }

    return Promise.reject(error);
  }
);

// API Helper Methods
export const apiGet = (url, config = {}) => api.get(url, config);
export const apiPost = (url, data = {}, config = {}) =>
  api.post(url, data, config);
export const apiPut = (url, data = {}, config = {}) =>
  api.put(url, data, config);
export const apiPatch = (url, data = {}, config = {}) =>
  api.patch(url, data, config);
export const apiDelete = (url, config = {}) => api.delete(url, config);

// File upload helper
export const apiUpload = (url, formData, onProgress) => {
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Download file helper - rejects on non-2xx and parses error blob as JSON when possible
export const apiDownload = async (url, filename) => {
  const response = await api
    .get(url, {
      responseType: 'blob',
      validateStatus: (status) => status >= 200 && status < 300,
    })
    .catch(async (err) => {
      if (err.response?.data instanceof Blob) {
        let message = 'Download failed';
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          err.response.data = json;
        } catch (_) {
          try {
            message = (await err.response.data.text()) || message;
          } catch (__) {}
          err.response.data = { message };
        }
      }
      throw err;
    });

  const blob = new Blob([response.data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);

  return response;
};

export default api;
