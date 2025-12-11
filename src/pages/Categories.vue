<template>
  <div class="p-6 text-[#570024]">
    <h1 class="text-3xl font-bold mb-6 text-[#570024] text-center">All Categories.</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-lg">Loading...</div>

    <!-- Error -->
    <div v-if="error" class="text-red-500">{{ error.message }}</div>

    <!-- Category List -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="p-4 border rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
        @click="goToDetails(cat.id)"
      >
        <h2 class="text-xl font-semibold mb-2">{{ cat.name }}</h2>
        <p class="text-gray-600">{{ cat.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useCategoryStore();

const { categories, loading, error, loadCategories } = store;

function goToDetails(id) {
  router.push(`/categories/${id}`);
}

onMounted(() => {
  loadCategories();
});
</script>
