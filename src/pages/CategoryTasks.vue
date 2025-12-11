<template>
  <div class="min-h-screen p-4">

    <!-- Back Button -->
    <div class="mb-4">
      <button
        @click="$router.back()"
        class="px-4 py-2 bg-[#570024] text-white rounded-lg shadow hover:bg-[#6d0030]"
      >
        ← Back
      </button>
    </div>

    <h2 class="text-2xl font-bold text-white mb-4">
      Tasks in "{{ category?.name }}"
    </h2>

    <!-- If no tasks -->
    <div v-if="tasks.length === 0" class="text-gray-400 text-center mt-10">
      No tasks found in this category.
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-[#570024] rounded-xl p-4 shadow-xl border border-white/10 hover:scale-[1.01] transition"
      >
        <!-- Image -->
        <div class="w-full h-40 rounded overflow-hidden bg-gray-100 relative">
          <img
            :src="task.image_url"
            alt="task"
            class="w-full h-full object-cover"
            v-if="task.image_url"
            @error="task.image_url = null"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        </div>

        <!-- Content -->
        <h3 class="mt-3 text-lg font-semibold text-white">
          {{ task.title }}
        </h3>

        <p class="text-sm text-[#c197a9] line-clamp-2">
          {{ task.description }}
        </p>

        <div class="mt-3 flex items-center gap-3">
          <span
            class="w-8 h-8 rounded-full flex items-center justify-center text-white"
            :style="{ backgroundColor: category?.color }"
          >
            <img
              v-if="category?.icon_url"
              :src="category.icon_url"
              class="w-5 h-5"
            />
            <span v-else>
              {{ category?.name?.slice(0,1) }}
            </span>
          </span>

          <div>
            <p class="text-xs text-[#f05092]">{{ category?.name }}</p>
            <p class="text-xs text-[#714758]">
              {{ task.due_date ? `Due: ${task.due_date}` : '' }}
            </p>
          </div>
        </div>

        <!-- Buttons -->
        <div class="mt-4 flex justify-between">
          <router-link
            :to="`/tasks/${task.id}`"
            class="px-3 py-1 text-white bg-[#c97d7d] rounded hover:bg-[#b86464]"
          >
            View
          </router-link>

          <button
            @click="toggleComplete(task)"
            class="px-3 py-1 text-white border rounded"
          >
            {{ task.completed ? "Unmark" : "Done ✔" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTaskStore } from "../stores/taskStore";
import { useCategoryStore } from "../stores/categoryStore";

const route = useRoute();
const taskStore = useTaskStore();
const categoryStore = useCategoryStore();

const categoryId = Number(route.params.id);

const tasks = computed(() =>
  taskStore.tasks.filter((t) => t.category_id === categoryId)
);

const category = computed(() =>
  categoryStore.categories.find((c) => c.id === categoryId)
);

function toggleComplete(task) {
  taskStore.editTask(task.id, { completed: !task.completed });
}

onMounted(() => {
  taskStore.loadTasks({ category_id: categoryId });
  categoryStore.loadCategoryById(categoryId);
});
</script>

<style scoped>
</style>
