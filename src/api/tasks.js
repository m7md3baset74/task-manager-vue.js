import apiClient from './apiClient';

// Helper لتنضيف الداتا قبل الإرسال
function normalizeTaskPayload(payload) {
  const clean = { ...payload };

  // category_id → Number أو null
  if (
    clean.category_id === null ||
    clean.category_id === 'null' ||
    clean.category_id === '' ||
    clean.category_id === undefined
  ) {
    clean.category_id = null;
  } else {
    clean.category_id = Number(clean.category_id);
  }

  // completed → Boolean
  if (clean.completed === 'true') clean.completed = true;
  if (clean.completed === 'false') clean.completed = false;

  return clean;
}

// ==============================
//  GET TASKS WITH FILTERS
// ==============================
export const fetchTasks = (params = {}) => {
  const qs = new URLSearchParams();

  qs.append("order", params.order || "created_at.desc");

  if (params.limit) qs.append("limit", params.limit);
  if (params.offset) qs.append("offset", params.offset);

  // فلترة التصنيف — تجاهل null تماماً
  if (params.category_id !== null && params.category_id !== undefined) {
    qs.append("category_id", `eq.${params.category_id}`);
  }

  // فلترة الـ completed — تجاهل null فقط
  if (params.completed === true || params.completed === false) {
    qs.append("completed", `eq.${params.completed}`);
  }

  // priority — تجاهل null
  if (params.priority) {
    qs.append("priority", `eq.${params.priority}`);
  }

  return apiClient.get(`/tasks?${qs.toString()}`);
};


// ==============================
//  SINGLE TASK
// ==============================
export const getTask = (id) =>
  apiClient.get(`/tasks?id=eq.${id}`);

// ==============================
//  CREATE
// ==============================
export const createTask = (payload) =>
  apiClient.post('/tasks', normalizeTaskPayload(payload));

// ==============================
//  UPDATE
// ==============================
export const updateTask = (id, payload) =>
  apiClient.patch(`/tasks?id=eq.${id}`, normalizeTaskPayload(payload));

// ==============================
//  DELETE
// ==============================
export const deleteTask = (id) =>
  apiClient.delete(`/tasks?id=eq.${id}`);
