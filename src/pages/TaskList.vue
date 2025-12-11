<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <div class="max-w-5xl mx-auto">
      
      <!-- Header -->
      <header class="flex items-center justify-between mb-6">
        <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#570024] to-[#ff5353]">Tasks.</h1>
        <button 
          @click="openAddModal"
          class="px-4 py-2 bg-[#570024] hover:bg-[#6e2944] text-white rounded"
        >
          + Add Task
        </button>
      </header>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 items-center mb-4">
        <select v-model="filters.category_id" class="border text-white border-[#c97d7d] rounded px-3 py-2 
        bg-[#c97d7d] hover:bg-[#b86464]">
          <option :value="null">All Categories</option>
          <option 
            v-for="c in categories" 
            :key="c.id" 
            :value="c.id"
          >
            {{ c.name }}
          </option>
        </select>

        <select v-model="filters.completed" class="border text-white border-[#c97d7d] rounded px-3 py-2 
        bg-[#c97d7d] hover:bg-[#b86464]">
          <option :value="null">All</option>
          <option :value="false">Incomplete</option>
          <option :value="true">Completed</option>
        </select>

        <select v-model="filters.priority" class="border text-white border-[#c97d7d] rounded px-3 py-2 
        bg-[#c97d7d] hover:bg-[#b86464]">
          <option :value="null">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button 
          @click="applyFilters" 
          class="px-3 py-2 bg-[#570024] hover:bg-[#6e2944] text-white rounded"
        >
          Filter Apply
        </button>

        <button 
          @click="resetFilters" 
          class="px-3 py-2 border rounded hover:bg-gray-200"
        >
          Reset
        </button>
      </div>

      <!-- Loading / Error -->
      <div v-if="categoryLoading || loading">
        <LoadingSkeleton />
      </div>

      <div v-else-if="categoryError || error">
        <ErrorState 
          :message="categoryErrorMessage || errorMessage" 
          @retry="loadAll" 
        />
      </div>

      <!-- Tasks List -->
      <div v-else>
        <div v-if="tasks.length === 0" class="p-8 text-center text-gray-500">
          No tasks yet. 
          <button 
            @click="openAddModal" 
            class="text-blue-600 underline"
          >
            Create your first task
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <TaskCard
            v-for="t in tasks"
            :key="t.id"
            :task="t"
            @toggle-complete="toggleComplete"
            @edit-task="openEditModal"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-center">
          <button 
            @click="loadMore" 
            class="px-4 py-2 border rounded text-[#570024] hover:bg-[#570024]/5" 
            :disabled="loading"
          >
            Load more
          </button>
        </div>
      </div>

      <!-- Task Modal -->
      <TaskFormModal 
        v-if="modalOpen"
        :open="modalOpen"
        :task-data="editData"
        @close="modalOpen=false"
        @saved="handleSaved"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TaskCard from '../components/TaskCard.vue';
import LoadingSkeleton from '../components/LoadingSkeleton.vue';
import ErrorState from '../components/ErrorState.vue';
import TaskFormModal from '../components/TaskFormModal.vue';

import { useTaskStore } from '../stores/taskStore';
import { useCategoryStore } from '../stores/categoryStore';
import { storeToRefs } from 'pinia';

const taskStore = useTaskStore();
const categoryStore = useCategoryStore();

const loading = ref(false);
const error = ref(null);

const filters = ref({
  category_id: null,
  completed: null,
  priority: null
});

const modalOpen = ref(false);
const editData = ref(null);

function openAddModal() {
console.log("Open Add Modal Clicked");

  editData.value = null;
  modalOpen.value = true;
}

function openEditModal(task) {
  editData.value = task;
  modalOpen.value = true;
}

function handleSaved() {
  modalOpen.value = false;
  loadAll();
}

async function loadAll() {
  loading.value = true;
  error.value = null;

  try {
    console.log('Loading categories...');
    await categoryStore.loadCategories();
    console.log('Loaded categories:', categoryStore.categories);
    await taskStore.loadTasks({ limit: 20, offset: 0, order: "created_at.desc" });
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

async function applyFilters() {
  loading.value = true;

  try {
    console.log("FILTERS:", filters.value);

    const params = { 
      limit: 20, 
      offset: 0, 
      order: "created_at.desc" 
    };

    if (filters.value.category_id !== null)
      params.category_id = filters.value.category_id;        // رقم فقط

    if (filters.value.completed !== null)
      params.completed = filters.value.completed;            // true/false

    if (filters.value.priority)
      params.priority = filters.value.priority;              // medium/high/low

    console.log("PARAMS SENT:", params);

    await taskStore.loadTasks(params);

  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}



async function resetFilters() {
  filters.value = { category_id: null, completed: null, priority: null };
  await loadAll();
}

async function loadMore() {
  const offset = taskStore.tasks.length;

  loading.value = true;
  try {
    await taskStore.loadTasks({ limit: 20, offset, order: "created_at.desc" });
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function toggleComplete(task) {
  try {
    await taskStore.editTask(task.id, { completed: !task.completed });
  } catch (err) {
    console.error(err);
  }
}

onMounted(loadAll);

const { tasks, loading: taskLoading, error: taskError } = storeToRefs(taskStore);
const { categories, loading: categoryLoading, error: categoryError } = storeToRefs(categoryStore);

const categoryErrorMessage = categoryError?.message;
const errorMessage = error?.message;
</script>
