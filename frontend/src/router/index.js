import { createRouter, createWebHistory } from 'vue-router';

// Public
import Home from '../views/Home.vue';

// Admin
import AdminLogin from '../views/admin/AdminLogin.vue';
import AdminSignup from '../views/admin/AdminSignup.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import AdminMovies from '../views/admin/AdminMovies.vue';
import AdminShowtimes from '../views/admin/AdminShowtimes.vue';

// User
import UserLogin from '../views/user/UserLogin.vue';
import UserSignup from '../views/user/UserSignup.vue';
import UserDashboard from '../views/user/UserDashboard.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },

  // --- Admin routes ---
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/admin/signup', name: 'AdminSignup', component: AdminSignup },
  { path: '/admin/dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAdminAuth: true } },
  { path: '/admin/movies', name: 'AdminMovies', component: AdminMovies, meta: { requiresAdminAuth: true } },
  { path: '/admin/showtimes', name: 'AdminShowtimes', component: AdminShowtimes, meta: { requiresAdminAuth: true } },

  // --- User routes ---
  { path: '/user/login', name: 'UserLogin', component: UserLogin },
  { path: '/user/signup', name: 'UserSignup', component: UserSignup },
  { path: '/user/dashboard', name: 'UserDashboard', component: UserDashboard, meta: { requiresUserAuth: true } },

  // ✅ Seat Selection (with movie + showtime)
  {
    path: '/user/seats/:showtimeId',
    name: 'SeatSelection',
    component: () => import('../views/user/SeatSelection.vue'),
    meta: { requiresUserAuth: true }
  },

  // ✅ Payment route
  {
    path: '/user/payment',
    name: 'UserPayment',
    component: () => import('../views/user/UserPayment.vue'),
    meta: { requiresUserAuth: true },
  },

  // ✅ Booking history / summary
  {
    path: '/user/bookings',
    name: 'UserBookings',
    component: () => import('../views/user/UserBookings.vue'),
    meta: { requiresUserAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// --- Navigation Guards ---
router.beforeEach((to, from, next) => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('userToken');

  // Admin protected routes
  if (to.meta.requiresAdminAuth && !adminToken) {
    alert('Please login as Admin to access this page.');
    return next('/admin/login');
  }

  // User protected routes
  if (to.meta.requiresUserAuth && !userToken) {
    alert('Please login to access this page.');
    return next('/user/login');
  }

  next();
});

export default router;
