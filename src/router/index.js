import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/HomePage.vue')
  },

  /*
  {
    path: '/birkhill',
    redirect: '/page/birkhill',
  },
  {
    path: '/page/:slug',
    name: 'Page',
    component: () => import('@/views/PageOther.vue')
  },
  {
    path: '/fares',
    name: 'FaresTimes',
    component: () => import('@/views/FaresTimes.vue')
  },
  {
    path: '/plan',
    name: 'PlanVisit',
    component: () => import( '@/views/PlanVisit.vue')
  },
  {
    path: '/news',
    name: 'NewsItems',
    component: () => import('@/views/NewsItems.vue')
  },
  {
    path: '/events',
    name: 'EventsList',
    component: () => import('@/views/EventsList.vue')
  },
  {
    path: '/special',
    name: 'SpecialList',
    component: () => import('@/views/SpecialList.vue')
  },
  {
    path: '/thomas',
    redirect: '/page/thomas'
    //name: 'ThomasEvent',
    //component: () => import( '@/views/ThomasEvent.vue')
  },
  */
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
