import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchCategories, fetchCategoryById } from '../api/categories';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([]);
  const category = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function loadCategories() {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetchCategories();
      categories.value = res.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function loadCategoryById(id) {
    loading.value = true;
    error.value = null;
    category.value = null;

    console.log("Loading category With ID:", id);

    try {
      const res = await fetchCategoryById(id);
      console.log("API Response:", res.data);
      category.value = res.data[0] || null;
      console.log("Stored category:", category.value);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    categories,
    category,
    loading,
    error,
    loadCategories,
    loadCategoryById,
  };
});
