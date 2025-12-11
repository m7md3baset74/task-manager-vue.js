<template>
  <div class="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
    <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-2">{{ title || 'Confirm delete' }}</h3>
      <p class="text-sm text-gray-600 mb-4">هل أنت متأكد أنك تريد حذف هذا العنصر؟ هذا الإجراء غير قابل للتراجع.</p>

      <div class="flex justify-end gap-3">
        <button @click="$emit('cancel')" class="px-4 py-2 border rounded">Cancel</button>
        <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' }
});
</script>
