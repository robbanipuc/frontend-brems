import axios from 'axios';

const BD_API_BASE = 'https://bdapis.vercel.app';

const bdApi = axios.create({
  baseURL: BD_API_BASE,
  headers: { Accept: 'application/json' },
  timeout: 15000,
});

/**
 * Fetch all divisions (Bangladesh)
 * @returns {Promise<Array<{id: string, name: string, bn_name?: string}>>}
 */
export const getDivisions = async () => {
  const { data } = await bdApi.get('/geo/v2.0/divisions');
  if (!data?.success || !Array.isArray(data.data)) return [];
  return data.data.map((d) => ({
    id: String(d.id),
    name: d.name,
    bn_name: d.bn_name,
  }));
};

/**
 * Fetch districts by division id
 * @param {string} divisionId
 * @returns {Promise<Array<{id: string, name: string, bn_name?: string}>>}
 */
export const getDistricts = async (divisionId) => {
  if (!divisionId) return [];
  const { data } = await bdApi.get(`/geo/v2.0/districts/${divisionId}`);
  if (!data?.success || !Array.isArray(data.data)) return [];
  return data.data.map((d) => ({
    id: String(d.id),
    name: d.name,
    bn_name: d.bn_name,
  }));
};

/**
 * Fetch upazilas by district id
 * @param {string} districtId
 * @returns {Promise<Array<{id: string, name: string, bn_name?: string}>>}
 */
export const getUpazilas = async (districtId) => {
  if (!districtId) return [];
  const { data } = await bdApi.get(`/geo/v2.0/upazilas/${districtId}`);
  if (!data?.success || !Array.isArray(data.data)) return [];
  return data.data.map((u) => ({
    id: String(u.id),
    name: u.name,
    bn_name: u.bn_name,
  }));
};

const bdApiService = {
  getDivisions,
  getDistricts,
  getUpazilas,
};

export default bdApiService;
