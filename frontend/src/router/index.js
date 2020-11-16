import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue'),
    props: true,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue')
  },
  {
    path: '/search/:id',
    name: 'Search',
    component: () => import('../views/Search.vue'),
    props: true,
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('../views/Messages.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminSignUp.vue'),
  },
  {
    path: '/admin/panel',
    name: 'AdminPanel',
    component: () => import('../views/Panel.vue'),
  },
  {
    path: '/admin/panel/publications',
    name: 'AdminPanelPubli',
    component: () => import('../views/PanelPubli.vue'),
  },
  {
    path: '/admin/panel/publications_en_attente',
    name: 'AdminPanelPubliAttente',
    component: () => import('../views/PanelPubliAttente.vue'),
  },
  {
    path: '/admin/panel/commentaires',
    name: 'AdminPanelCommentaires',
    component: () => import('../views/PanelCommentaires.vue'),
  },
  {
    path: '/admin/panel/commentaires_en_attente',
    name: 'AdminPanelCommentairesAttente',
    component: () => import('../views/PanelCommentairesAttente.vue'),
  },
  {
    path: '/admin/panel/users',
    name: 'AdminPanelUtilisateurs',
    component: () => import('../views/PanelUtilisateurs.vue'),
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
