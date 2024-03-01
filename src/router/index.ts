import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/PageLayout.vue'),
      redirect: { name: 'home' },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomePage/HomePage.vue'),
        },
        {
          path: '/auth',
          name: 'auth',
          component: () => import('../views/AuthPage/AuthPage.vue'),
        },
        {
          path: '/:username',
          name: 'profile',
          component: () => import('../views/ProfilePage/ProfilePage.vue'),
        },
      ]
    },
  ]
});

router.beforeEach((to, from, next) => {
  const { userInfo } = useAuthStore();
    if (to.name === 'home' && !userInfo) {
      return next('/auth');
    }
    if (to.name === 'auth' && userInfo) {
      return next('/');
    }
    return next();
});

export default router
