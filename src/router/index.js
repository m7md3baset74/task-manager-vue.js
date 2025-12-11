import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  { path: '/', name: 'TaskList', component: () => import('../pages/TaskList.vue') },
  
  
  { path: '/services', name: 'services', component: () => import('../pages/Services.vue') },
  { path: '/services/:id', name: 'serviceDetails', component: () => import('../pages/ServicesDetails.vue') },

  { path: '/categories', name: 'categories', component: () => import('../pages/Categories.vue') },
  { path: '/categories/:id', name: 'categoryDetails', component: () => import('../pages/CategoryDetails.vue') },
  { path: "/categories/:id", component: () => import("../pages/CategoryTasks.vue"),},

  { path: '/tasks', name: 'categories', component: () => import('../pages/Categories.vue') },
  { path: '/categories/:id', name: 'categoryDetails', component: () => import('../pages/CategoryDetails.vue') },

  { path: '/tasks/:id', name: 'TaskDetail', component: () => import('../pages/TaskDetail.vue'), props: true },
  { path: '/tasks/:id/edit', name: 'TaskEdit', component: () => import('../pages/TaskForm.vue'), props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
