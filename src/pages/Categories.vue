<template>
  <div class="p-6 text-[#570024]">
    <h1 class="text-3xl font-bold mb-6 text-[#570024] text-center">All Categories.</h1>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <LoadingSkeleton v-for="i in 3" :key="i" />
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-500">{{ error.message }}</div>

    <!-- Category List -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="(cat, index) in categories"
        :key="cat.id"
        class="p-4 border rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
        @click="goToDetails(cat.id)"
        tabindex="0"
        :ref="el => items[index] = el"
        @keydown.enter="goToDetails(cat.id)"
        @keydown.space.prevent="goToDetails(cat.id)"
        @keydown.down.prevent="focusNext(index)"
        @keydown.up.prevent="focusPrev(index)"
      >
        <h2 class="text-xl font-semibold mb-2">{{ cat.name }}</h2>
        <p class="text-gray-600">{{ cat.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import LoadingSkeleton from '../components/LoadingSkeleton.vue';

const router = useRouter();
const store = useCategoryStore();
const { categories, loading, error } = storeToRefs(store);
const { loadCategories } = store;
const items = ref([]);

function goToDetails(id) {
  router.push(`/categories/${id}`);
}

onMounted(async () => {
  await loadCategories();
});

function focusNext(index) {
  const next = items.value[index + 1];
  next?.focus();
}

function focusPrev(index) {
  const prev = items.value[index - 1];
  prev?.focus();
}

onMounted(async () => {
  await loadCategories();
  await nextTick();
  items.value[0]?.focus();
});

function handleKeydown(e) {
  const tag = document.activeElement?.tagName;

  if (
    (e.key === "Escape") ||
    (e.key === "Backspace" && tag !== "INPUT" && tag !== "TEXTAREA")
  ) {
    router.back();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
