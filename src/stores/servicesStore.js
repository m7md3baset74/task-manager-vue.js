import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchServices, fetchServiceById } from '../api/services';

export const useServicesStore = defineStore('services', () => {
  const services = ref([]);
  const service = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function loadServices() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetchServices();
      services.value = res.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function loadServiceById(id) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetchServiceById(id);
      service.value = res.data?.[0] || null;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    services,
    service,
    loading,
    error,
    loadServices,
    loadServiceById,
  };
});
