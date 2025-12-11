import apiClient from "./apiClient";

export const fetchCategories = ({ limit = 50, offset = 0 } = {}) =>
  apiClient.get(`/categories?order=name.asc&limit=${limit}&offset=${offset}`);

export const fetchCategoryById = (id) =>
  apiClient.get(`/categories?id=eq.${id}`);

export const fetchTasksByCategory = (categoryId) =>
  apiClient.get(`/tasks?category_id=eq.1&limit=20&offset=0${categoryId}&order=created_at.desc`);