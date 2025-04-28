import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '@/views/LoginPage.vue'
import DashboardView from '@/views/DashboardView.vue'
import HomeDashboard from '@/views/HomeDashboard.vue'
import ProfileView from '@/views/ProfileView.vue'
import AnnouncementsView from '@/views/AnnouncementsView.vue'
import ApplicationsView from '@/views/ApplicationsView.vue'
import AdminView from '@/views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: HomeDashboard
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView
        },
        {
          path: 'announcements',
          name: 'announcements',
          component: AnnouncementsView
        },
        {
          path: 'applications',
          name: 'applications',
          component: ApplicationsView
        },
        {
          path: 'admin',
          name: 'admin',
          component: AdminView,
          meta: { requiresAdmin: true }
        },
        // Admin alt sayfaları buraya eklenecek
        {
          path: 'admin/announcements/new',
          name: 'new-announcement',
          component: () => import('@/views/admin/NewAnnouncementView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'admin/users',
          name: 'manage-users',
          component: () => import('@/views/admin/UsersView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'admin/disciplines',
          name: 'manage-disciplines',
          component: () => import('@/views/admin/DisciplinesView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'admin/jury-assignments',
          name: 'jury-assignments',
          component: () => import('@/views/admin/JuryAssignmentsView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'admin/evaluations',
          name: 'evaluations',
          component: () => import('@/views/admin/EvaluationsView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'admin/evaluations/:id',
          name: 'evaluation-details',
          component: () => import('@/views/admin/EvaluationDetailView.vue'),
          meta: { requiresAdmin: true }
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
  ]
})

// Basit bir navigasyon guard ekleme
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('token')
  
  // Oturum gerektiren rotalar için kontrol
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' })
  } 
  // Admin gerektiren rotalar için kontrol (örnek)
  else if (to.meta.requiresAdmin) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.roles && (user.roles.includes('admin') || user.roles.includes('administrator'))) {
      next()
    } else {
      next({ name: 'dashboard' })
    }
  } 
  // Oturum açmışsa ve login sayfasına gitmeye çalışıyorsa
  else if (isLoggedIn && to.name === 'login') {
    next({ name: 'dashboard' })
  } 
  // Diğer tüm durumlar
  else {
    next()
  }
})

export default router