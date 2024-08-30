
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/productList/index.vue') },
  { path: '/login', component: () => import('@/pages/login/index.vue') },
  {
    path: '/management',
    component: () => import('@/components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('@/pages/productManagement/index.vue') },
      { path: 'mine', component: () => import('@/pages/mine/index.vue') },
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/404notfond.vue') },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果目标路由需要授权且用户未登录，则重定向到登录页
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else {
    // 目标路由不需要授权，允许访问
    next();
  }
})
export default router;