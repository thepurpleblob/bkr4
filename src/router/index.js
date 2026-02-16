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
  {
    path: '/plan',
    name: 'PlanPage',
    component: () => import( '@/views/PlanPage.vue')
  },
  {
    path: '/faq',
    name: 'FAQPage',
    component: () => import( '@/views/FAQPage.vue')
  },
  {
    path: '/museum',
    name: 'Museum',
    beforeEnter() {location.href = 'https://museumofscottishrailways.org.uk/'}
  },
  {
    path: '/buytickets',
    name: 'Digitickets',
    beforeEnter() {location.href = 'https://bkrailway.digitickets.co.uk/tickets'}
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
      // always scroll to top
      return { top: 0 }
  },
  routes
});

export default router
