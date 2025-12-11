<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">الخدمات</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-lg">جار التحميل...</div>

    <!-- Error -->
    <div v-if="error" class="text-red-500">{{ error.message }}</div>

    <!-- Services List -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="srv in services"
        :key="srv.id"
        class="p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        @click="goToDetails(srv.id)"
      >
        <h2 class="text-xl font-semibold mb-2">{{ srv.name }}</h2>
        <p class="text-gray-600">{{ srv.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useServicesStore } from '../stores/servicesStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useServicesStore();

const { services, loading, error, loadServices } = store;

function goToDetails(id) {
  router.push(`/services/${id}`);
}

onMounted(() => {
  loadServices();
});
</script>
