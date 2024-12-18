import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import UserInfo from '@/views/UserInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: null,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/home/:userId',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/home/:userId/info',
          name: 'info',
          component: UserInfo,
        },
        {
          path: '/home/:userId/book',
          name: 'book',
          component: null,
        },
        {
          path: '/home/:userId/orders',
          name: 'orders',
          component: null,
        },
        {
          path: '/home/:userId/tickets',
          name: 'tickets',
          component: null,
        },
      ],
    },
    {
      path: '/home/:userId/order/:orderId',
      name: 'order',
      component: null,
    },
  ],
})

export default router
