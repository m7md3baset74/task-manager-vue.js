import { defineStore } from "pinia";
import { ref } from "vue";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask as apiDeleteTask,
  getTask,
} from "../api/tasks";

export const useTaskStore = defineStore("task", () => {
  const tasks = ref([]);
  const task = ref(null);
  const loading = ref(false);
  const error = ref(null);

  function normalizeParams(params) {
    const clean = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (typeof value === "boolean") {
        clean[key] = value ? "true" : "false";
      } else {
        clean[key] = value;
      }
    });

    return clean;
  }

  
  async function loadTasks(params = { limit: 20, offset: 0 }) {
    loading.value = true;
    error.value = null;

    try {
      const normalized = normalizeParams(params);
      const res = await fetchTasks(normalized);

      tasks.value = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      error.value = err;
      console.error("Load tasks error:", err);
    } finally {
      loading.value = false;
    }
  }


  async function loadTasksByCategory(categoryId) {
    loading.value = true;
    error.value = null;

    console.log("Loading tasks for category:", categoryId);

    try {
      const res = await fetchTasks({
        category_id: categoryId,
        limit: 100,
        offset: 0,
      });

      console.log("API Response for category tasks:", res.data);

      tasks.value = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Error loading tasks by category:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }


  async function loadTaskById(id) {
    loading.value = true;
    error.value = null;

    console.log("Loading Task With ID:", id);

    try {
      const res = await getTask(id);

      console.log("API Response:", res.data);

      if (Array.isArray(res.data)) {
        task.value = res.data[0] || null;
      } else if (typeof res.data === "object" && res.data !== null) {
        task.value = res.data;
      } else {
        task.value = null;
      }

      console.log("Stored task:", task.value);
    } catch (err) {
      error.value = err;
      console.error("Error loading task:", err);
    } finally {
      loading.value = false;
    }
  }

  async function addTask(payload) {
    loading.value = true;
    error.value = null;

    try {
      const res = await createTask(payload);
      const newItem = Array.isArray(res.data) ? res.data[0] : null;

      if (newItem) tasks.value.unshift(newItem);

      return newItem;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function editTask(id, payload) {
    loading.value = true;
    error.value = null;

    try {
      const res = await updateTask(id, payload);
      const updated = Array.isArray(res.data) ? res.data[0] : null;

      if (updated) {
        const idx = tasks.value.findIndex((t) => t.id === id);
        if (idx !== -1) tasks.value[idx] = updated;
      }

      return updated;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  
  async function deleteTask(id) {
    loading.value = true;
    error.value = null;

    try {
      await apiDeleteTask(id);
      tasks.value = tasks.value.filter((t) => t.id !== id);
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  
  return {
    tasks,
    task,
    loading,
    error,
    loadTasks,
    loadTasksByCategory,
    loadTaskById,
    addTask,
    editTask,
    deleteTask,
  };
});
