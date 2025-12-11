import apiClient from './apiClient';

export const fetchCategories = ({ limit = 50, offset = 0 } = {}) =>
  apiClient.get(`/categories?order=name.asc&limit=${limit}&offset=${offset}`);
