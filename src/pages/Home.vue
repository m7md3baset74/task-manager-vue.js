<script setup>
import { onMounted } from "vue";
import { useCategoryStore } from "../stores/categoryStore";

const categoryStore = useCategoryStore();

onMounted(() => {
  categoryStore.loadCategories();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Categories</h1>

    <!-- Loading -->
    <div v-if="categoryStore.loading" class="text-gray-500">Loading...</div>

    <!-- Error -->
    <div v-if="categoryStore.error" class="text-red-500">
      {{ categoryStore.error.message }}
    </div>

    <!-- Categories List -->
    <ul v-if="!categoryStore.loading && !categoryStore.error">
      <li
        v-for="cat in categoryStore.categories"
        :key="cat.id"
        class="p-3 bg-gray-100 rounded mb-2"
      >
        {{ cat.name }}
      </li>
    </ul>
  </div>
</template>
