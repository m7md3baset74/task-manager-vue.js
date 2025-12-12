import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
});
