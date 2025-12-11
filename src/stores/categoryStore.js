import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchCategories } from '../api/categories';

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

    try {
      const res = await fetchCategories({ limit: 50 });
      category.value = res.data.find(c => c.id == id) || null;
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
    loadCategoryById
  };
});
