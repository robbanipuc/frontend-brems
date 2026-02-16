import api, { apiUpload, apiDownload } from './api';

const punishmentService = {
  getTypes() {
    return api.get('/punishments/types').then((res) => res.data.types);
  },

  getByEmployee(employeeId) {
    return api.get(`/employees/${employeeId}/punishments`).then((res) => res.data);
  },

  getById(id) {
    return api.get(`/punishments/${id}`).then((res) => res.data);
  },

  create(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] != null && data[key] !== undefined) {
        if (key === 'order_copy' && data[key] instanceof File) {
          formData.append(key, data[key]);
        } else if (key !== 'order_copy') {
          formData.append(key, data[key]);
        }
      }
    });
    return apiUpload('/punishments', formData).then((res) => res.data);
  },

  update(id, data) {
    const hasFile = data.order_copy instanceof File;
    if (hasFile) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] != null && data[key] !== undefined) {
          if (key === 'order_copy') formData.append(key, data[key]);
          else formData.append(key, data[key]);
        }
      });
      return apiUpload(`/punishments/${id}`, formData).then((res) => res.data);
    }
    return api.put(`/punishments/${id}`, data).then((res) => res.data);
  },

  delete(id) {
    return api.delete(`/punishments/${id}`).then((res) => res.data);
  },

  downloadOrderCopy(url) {
    return apiDownload(url, 'punishment_order.pdf');
  },
};

export default punishmentService;
