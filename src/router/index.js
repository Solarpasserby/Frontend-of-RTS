import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import UserInfo from '@/views/UserInfo.vue'
import Admin from '@/views/Admin.vue'
import MgStations from '@/views/MgStations.vue'
import MgTrains from '@/views/MgTrains.vue'
import MgUsers from '@/views/MgUsers.vue'
import MgOrders from '@/views/MgOrders.vue'
import MgRuns from '@/views/MgRuns.vue'

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
      path: '/admin',
      name: 'admin',
      component: Admin,
      children: [
        {
          path: '/admin/stations',
          name: 'manage stations',
          component: MgStations,
        },
        {
          path: '/admin/trains',
          name: 'manage trains',
          component: MgTrains,
        },
        {
          path: '/admin/users',
          name: 'manage users',
          component: MgUsers,
        },
        {
          path: '/admin/orders',
          name: 'manage orders',
          component: MgOrders,
        },
        {
          path: '/admin/runs',
          name: 'manage train runs',
          component: MgRuns,
        },
        {
          path: '/admin/nums',
          name: 'manage train run nums',
          component: null,
        }
      ],
    }
  ],
})

export default router
