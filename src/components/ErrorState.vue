<template>
  <div class="p-6 border rounded bg-red-50 text-red-700">
    <p class="font-medium">حصل خطأ أثناء جلب البيانات</p>
    <p class="text-sm mt-2" v-if="message">{{ message }}</p>
    <button @click="$emit('retry')" class="mt-4 px-4 py-2 bg-red-600 text-white rounded">إعادة المحاولة</button>
  </div>
</template>

<script setup>
defineProps({ message: String });
</script>
