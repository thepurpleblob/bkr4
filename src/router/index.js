import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/timetable',
    name: 'TimetablePage',
    component: () => import('@/views/TimetablePage.vue')
  },
  {
    path: '/page/:slug',
    name: 'PagePage',
    component: () => import('@/views/PagePage.vue')
  },
  {
    path: '/events',
    name: 'EventsPage',
    component: () => import('@/views/EventsPage.vue')
  },
  {
    path: '/special',
    name: 'SpecialPage',
    component: () => import('@/views/SpecialPage.vue')
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

  */
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
