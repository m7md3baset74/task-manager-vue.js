<template>
  <div class="p-6">
    <button
      class="mb-4 px-4 py-2 bg-gray-200 rounded"
      @click="router.back()"
    >
      رجوع
    </button>

    <!-- Loading -->
    <div v-if="loading" class="text-lg">جار التحميل...</div>

    <!-- Error -->
    <div v-if="error" class="text-red-500">{{ error.message }}</div>

    <!-- Category Details -->
    <div v-if="category && !loading && !error" class="p-6 border rounded shadow">
      <h1 class="text-3xl font-bold mb-4">{{ category.name }}</h1>
      <p class="text-gray-700 text-lg">{{ category.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';
import { useRoute, useRouter } from 'vue-router';

const store = useCategoryStore();
const route = useRoute();
const router = useRouter();

const { category, loading, error, loadCategoryById } = store;

onMounted(() => {
  loadCategoryById(route.params.id);
});
</script>
