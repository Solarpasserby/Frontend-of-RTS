import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import UserInfo from '@/views/UserInfo.vue'
import BookTicket from '@/views/BookTicket.vue'
import UserOrders from '@/views/UserOrders.vue'
import UserTickets from '@/views/UserTickets.vue'
import Admin from '@/views/Admin.vue'
import MgStations from '@/views/MgStations.vue'
import MgTrains from '@/views/MgTrains.vue'
import MgUsers from '@/views/MgUsers.vue'
import MgOrders from '@/views/MgOrders.vue'
import MgRuns from '@/views/MgRuns.vue'
import MgNums from '@/views/MgNums.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: Login,
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
          component: BookTicket,
        },
        {
          path: '/home/:userId/orders',
          name: 'orders',
          component: UserOrders,
        },
        {
          path: '/home/:userId/tickets',
          name: 'tickets',
          component: UserTickets,
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
          component: MgNums,
        }
      ],
    }
  ],
})

export default router
