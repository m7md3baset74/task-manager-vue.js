<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity text-[#570024]"
  >
    <!-- Modal Box -->
    <div
      class="bg-white/90 rounded-xl shadow-lg w-full max-w-[90%] sm:max-w-xl p-4 sm:p-6 animate-fade-in"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">
          {{ isEdit ? "Edit Task" : "Add New Task" }}
        </h2>
        <button @click="close" class="text-gray-500 hover:text-black text-xl">
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full border rounded px-3 py-2 focus:ring focus:ring-[#570024]"
          />
          <p v-if="errors.title" class="text-red-600 text-sm">
            {{ errors.title }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            v-model="form.description"
            class="w-full border rounded px-3 py-2 focus:ring focus:ring-[#570024]"
            rows="3"
          ></textarea>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-1">Category</label>

          <Listbox v-model="form.category_id">
            <div class="relative mt-1">
              <!-- Button -->
              <ListboxButton
                class="relative w-full cursor-pointer border rounded px-3 py-2 text-left focus:outline-none focus:ring focus:ring-[#570024]"
              >
                <span class="block truncate">
                  {{
                    categoryStore.categories.find(
                      (c) => c.id === form.category_id
                    )?.name || "Select Category"
                  }}
                </span>
              </ListboxButton>

              <!-- Options -->
              <Transition
                enter="transition ease-out duration-100"
                enter-from="transform opacity-0 scale-95"
                enter-to="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leave-from="transform opacity-100 scale-100"
                leave-to="transform opacity-0 scale-95"
              >
                <ListboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"
                >
                  <ListboxOption
                    v-for="c in categoryStore.categories"
                    :key="c.id"
                    :value="c.id"
                    class="{ 'text-white bg-[#570024]': active, 'text-gray-900': !active } relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-[#f3d4e0]"
                    v-slot="{ active, selected }"
                  >
                    <span
                      :class="{
                        'font-bold': selected,
                        'font-normal': !selected,
                      }"
                      class="block truncate"
                    >
                      {{ c.name }}
                    </span>
                    
                  </ListboxOption>
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>

          <p v-if="errors.category_id" class="text-red-600 text-sm">
            {{ errors.category_id }}
          </p>
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium mb-1">Priority</label>
          <select
            v-model="form.priority"
            class="w-full border rounded px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <p v-if="errors.priority" class="text-red-600 text-sm">
            {{ errors.priority }}
          </p>
        </div>

        <!-- Completed (only in edit mode) -->
        <div v-if="isEdit">
          <label class="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" v-model="form.completed" />
            Mark as completed
          </label>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-3">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-[#570024] hover:bg-[#6e2944] text-white rounded"
          >
            {{ isEdit ? "Save Changes" : "Add Task" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted } from "vue";
import { useTaskStore } from "../stores/taskStore";
import { useCategoryStore } from "../stores/categoryStore";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { Transition } from "vue";

const props = defineProps({
  open: Boolean,
  taskData: { type: Object, default: null },
});

const emit = defineEmits(["close", "saved"]);

const taskStore = useTaskStore();
const categoryStore = useCategoryStore();

// Load categories if not loaded
onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    await categoryStore.loadCategories();
  }
});

const isEdit = computed(() => props.taskData !== null);

const form = reactive({
  title: "",
  description: "",
  category_id: null,
  priority: "medium",
  completed: false,
});

// Validation errors
const errors = reactive({
  title: "",
  category_id: "",
  priority: "",
});

// Fill form when editing
watch(
  () => props.taskData,
  (val) => {
    if (val) {
      form.title = val.title;
      form.description = val.description;
      form.category_id = val.category_id ?? null;
      form.priority = val.priority;
      form.completed = val.completed;
    } else {
      form.title = "";
      form.description = "";
      form.category_id = null;
      form.priority = "medium";
      form.completed = false;
    }
  },
  { immediate: true }
);

// ----------------------------
//       VALIDATION LOGIC
// ----------------------------
function validateForm() {
  let valid = true;

  // Title (required + max 255 chars)
  if (!form.title.trim()) {
    errors.title = "Title is required.";
    valid = false;
  } else if (form.title.length > 255) {
    errors.title = "Title must be less than 255 characters.";
    valid = false;
  } else {
    errors.title = "";
  }

  // Category ID
  if (form.category_id === null) {
    errors.category_id = "Category is required.";
    valid = false;
  } else {
    errors.category_id = "";
  }

  // Priority
  const allowed = ["low", "medium", "high"];
  if (!allowed.includes(form.priority)) {
    errors.priority = "Invalid priority.";
    valid = false;
  } else {
    errors.priority = "";
  }

  return valid;
}

// ----------------------------
//         SUBMIT
// ----------------------------
async function submitForm() {
  if (!validateForm()) return;

  try {
    if (isEdit.value) {
      await taskStore.editTask(props.taskData.id, { ...form });
    } else {
      await taskStore.addTask({ ...form });
    }
    emit("saved");
    close();
  } catch (err) {
    console.error(err);
  }
}

function close() {
  emit("close");
}
</script>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}
</style>
