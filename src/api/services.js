import api from './apiClient.js';

export async function fetchServices() {
  return api.get('/services?select=*');
}

export async function fetchServiceById(id) {
  return api.get(`/services?id=eq.${id}&select=*`);
}
