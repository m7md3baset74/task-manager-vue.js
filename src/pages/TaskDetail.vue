<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <div class="max-w-3xl mx-auto">
      <!-- Back -->
      <div class="mb-4 flex gap-4">
        <button
          @click="goBack"
          class="px-3 py-2 border bg-[#570024] text-white rounded-lg shadow hover:bg-[#6d0030]"
        >
          ← Back to list
        </button>
        <button
          @click="showCate"
          class="px-3 py-2 rounded-lg border hover:bg-[#570024]/5 text-[#570024] shadow"
        >
          Show All Categories
        </button>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="p-6 bg-white rounded shadow text-center">
        <LoadingSkeleton />
      </div>

      <div v-else-if="error" class="p-6 bg-red-50 rounded shadow">
        <p class="text-red-700 font-medium">حدث خطأ أثناء جلب البيانات</p>
        <p class="text-sm mt-2">{{ errorMessage }}</p>
        <div class="mt-4">
          <button
            @click="reload"
            class="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Task Card -->
      <div v-else-if="task" class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Image -->
          <div
            class="w-full h-48 md:h-auto md:col-span-1 rounded overflow-hidden bg-gray-100 flex items-center justify-center"
          >
            <img
              v-if="task.image_url && !imageErrored"
              :src="task.image_url"
              alt="task image"
              class="w-full h-full object-cover"
              @load="imageLoaded = true"
              @error="onImageError"
            />
            <div
              v-if="(!task.image_url || imageErrored) && !imageLoaded"
              class="text-gray-500"
            >
              No Image
            </div>
          </div>

          <!-- Details -->
          <div class="md:col-span-2 flex flex-col gap-4">
            <div
              class="flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div class="flex-1">
                <h1 class="text-2xl font-bold mb-1">{{ task.title }}</h1>
                <p class="text-gray-600 mb-2">{{ task.description || "—" }}</p>

                <div class="flex flex-wrap items-center gap-2">
                  <span
                    v-if="category"
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    :style="{ backgroundColor: category.color, color: '#fff' }"
                  >
                    <img
                      v-if="category.icon_url"
                      :src="category.icon_url"
                      class="w-4 h-4"
                    />
                    <span>{{ category.name }}</span>
                  </span>

                  <span v-else class="text-sm text-gray-500">No category</span>

                  <span class="text-sm text-gray-500">
                    Priority:
                    <strong class="ml-1">{{
                      task.priority || "medium"
                    }}</strong>
                  </span>

                  <span class="text-sm text-gray-500" v-if="task.due_date">
                    Due: <strong class="ml-1">{{ task.due_date }}</strong>
                  </span>
                </div>
              </div>

              <div
                class="text-right mt-4 md:mt-0 flex flex-col md:items-end gap-2"
              >
                <button
                  @click="toggleComplete"
                  class="px-3 py-1 rounded border"
                >
                  {{ task.completed ? 'Unmark' : 'Done ✔' }}
                </button>

                <div class="flex justify-end gap-2 mt-2 md:mt-3 flex-wrap">
                  <button
                    @click="openEdit"
                    class="px-3 py-1 bg-[#825b64] text-white rounded hover:bg-[#69474f]"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete"
                    class="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- meta -->
            <div class="text-sm text-gray-500 mt-2 md:mt-4">
              <div>Created: {{ formatDate(task.created_at) }}</div>
              <div v-if="task.updated_at">
                Updated: {{ formatDate(task.updated_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else class="p-6 bg-white rounded shadow text-center text-gray-500">
        Task not found.
      </div>

      <!-- Edit Modal -->
      <TaskFormModal
        v-if="editModalOpen"
        :open="editModalOpen"
        :task-data="task"
        @close="editModalOpen = false"
        @saved="onSaved"
      />

      <!-- Delete confirm -->
      <DeleteConfirm
        v-if="deleteModalOpen"
        :title="`Delete task: ${task?.title || ''}`"
        @confirm="deleteTask"
        @cancel="deleteModalOpen = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "../stores/taskStore";
import { useCategoryStore } from "../stores/categoryStore";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import TaskFormModal from "../components/TaskFormModal.vue";
import DeleteConfirm from "../components/DeleteConfirm.vue";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const route = useRoute();
const router = useRouter();

const taskStore = useTaskStore();
const categoryStore = useCategoryStore();

const loading = ref(false);
const error = ref(null);

const { task } = storeToRefs(taskStore); // reactive ref from store
const imageLoaded = ref(false);
const imageErrored = ref(false);

const editModalOpen = ref(false);
const deleteModalOpen = ref(false);

const errorMessage = computed(() => {
  if (!error.value) return "";
  return error.value.message || String(error.value);
});

const category = computed(() => {
  if (!task.value || !task.value.category_id) return null;

  return categoryStore.categories.find(
    (c) => c.id === task.value.category_id
  ) || null;
});


function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
}

function onImageError() {
  imageErrored.value = true;
}

function goBack() {
  router.push("/");
}

function showCate() {
  router.push("/tasks");
}

async function load() {
  loading.value = true;
  error.value = null;
  imageLoaded.value = false;
  imageErrored.value = false;
  try {
    // load category list first (if not loaded)
    if (!categoryStore.categories.length) await categoryStore.loadCategories();
    // load the single task
    await taskStore.loadTaskById(route.params.id);
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

async function toggleComplete() {
  try {
    await taskStore.editTask(task.value.id, {
      completed: !task.value.completed,
    });
    // reload single task to reflect updated timestamps
    await taskStore.loadTaskById(task.value.id);
  } catch (err) {
    console.error(err);
    error.value = err;
  }
}

function openEdit() {
  editModalOpen.value = true;
}

function onSaved() {
  editModalOpen.value = false;
  // reload task
  if (task.value?.id) taskStore.loadTaskById(task.value.id);
}

function confirmDelete() {
  deleteModalOpen.value = true;
}

async function deleteTask() {
  try {
    if (!task.value?.id) return;
    await taskStore.deleteTask(task.value.id);
    deleteModalOpen.value = false;

    
    toast.success("Task deleted successfully!", {
      autoClose: 500,
      onClose: () => router.push("/")
    });
    
  } catch (err) {
    console.error(err);
    error.value = err;
  }
}

onMounted(load);
</script>
