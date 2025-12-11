<template>
  <div class="bg-[#570024] rounded-lg shadow-xl p-4 flex flex-col sm:flex-row gap-4">
    <!-- Image -->
    <div class="w-full h-48 sm:w-36 sm:h-24 rounded overflow-hidden flex-shrink-0 relative bg-gray-100">
      <img
        :src="task.image_url"
        alt="task image"
        class="w-full h-full object-cover"
        @load="loaded = true"
        @error="errored = true"
        v-if="task.image_url && !errored"
      />
      <div v-if="!task.image_url || errored" class="w-full h-full flex items-center justify-center text-sm text-gray-500">
        No Image
      </div>
      <div v-if="!loaded && !errored" class="absolute inset-0 bg-white/60 flex items-center justify-center">
        <svg class="w-6 h-6 animate-spin" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 mt-2 sm:mt-0">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h3 class="text-lg font-semibold text-white">{{ task.title }}</h3>
          <p class="text-sm text-[#c197a9] max-w-full line-clamp-2">{{ task.description }}</p>
        </div>
        <div class="text-right mt-2 sm:mt-0">
          <button 
            @click="$emit('toggle-complete', task)" 
            class="px-2 py-1 rounded border text-sm text-white"
          >
            {{ task.completed ? 'Unmark' : 'Done ✔' }}
          </button>
        </div>
      </div>

      <div class="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div class="flex items-center gap-2">
          <span 
            :style="{ backgroundColor: categoryColor }" 
            class="w-8 h-8 rounded-full flex items-center justify-center text-white"
          >
            <img 
              v-if="category?.icon_url" 
              :src="category.icon_url" 
              alt="icon" 
              class="w-5 h-5"
            >
            <span v-else class="text-xs">
              {{ category?.name?.slice(0,1) }}
            </span>
          </span>
          <div>
            <p class="text-sm text-[#f05092] font-medium">{{ category?.name || '—' }}</p>
            <p class="text-xs text-[#714758]">
              {{ task.due_date ? `Due: ${task.due_date}` : '' }}
            </p>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-2 mt-2 sm:mt-0">
          <router-link 
            :to="`/tasks/${task.id}`" 
            class="text-md px-2 py-1 rounded text-white bg-[#c97d7d] hover:bg-[#b86464]"
          >
            View
          </router-link>

          <button
            class="text-md px-2 py-1 rounded text-white bg-[#825b64] hover:bg-[#69474f]"
            @click="$emit('edit-task', task)"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';

const props = defineProps({
  task: { type: Object, required: true }
});

const loaded = ref(false);
const errored = ref(false);

const categoryStore = useCategoryStore();
const category = computed(() =>
  categoryStore.categories.find(c => c.id === props.task.category_id)
);

const categoryColor = computed(() =>
  category.value?.color || '#6b7280'
);
</script>
