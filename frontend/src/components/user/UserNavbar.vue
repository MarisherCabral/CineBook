<template>
  <header class="navbar">
    <!-- Logo Section -->
    <div class="logo">
      <img src="../../assets/logo.png" alt="CineBook Logo" class="logo-img" />
      <div class="brand">
        <span class="cine">Cine</span><span class="book">Book</span>
      </div>
      <span class="role">User</span>
    </div>

    <!-- Navigation Links -->
    <nav class="nav-links">
      <router-link to="/user/dashboard" class="nav-item">Home</router-link>
      <router-link to="/user/bookings" class="nav-item">My Bookings</router-link>
      <button @click="logout" class="logout-btn">Logout</button>
    </nav>
  </header>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const logout = () => {
      if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('userToken');
        router.push('/');
      }
    };

    return { logout };
  },
};
</script>

<style scoped>
.navbar {
  position: fixed; /* change sticky -> fixed */
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background-color: #1a1a1a;
  padding: 0.8rem 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  z-index: 1000;
  box-sizing: border-box;
}


.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.logo-img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.brand {
  display: flex;
  align-items: baseline;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.cine { color: #fff; }
.book { color: #ff3333; margin-left: 2px; }

.role {
  color: #ffcc00;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 8px;
  background: rgba(255, 204, 0, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 204, 0, 0.3);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  transition: all 0.3s ease;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  position: relative;
  transition: color 0.3s ease;
}

.nav-item::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background: #ffcc00;
  transition: width 0.3s ease;
}

.nav-item:hover::after,
.router-link-exact-active::after {
  width: 100%;
}

.nav-item:hover {
  color: #ffcc00;
  text-shadow: 0 0 8px rgba(255, 204, 0, 0.6);
}

.logout-btn {
  background: linear-gradient(90deg, #ffcc00, #ffdd55);
  color: #000;
  font-weight: 700;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
}

.logout-btn:hover {
  background: #fff;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.8);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    gap: 0.8rem;
  }

  .nav-links {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 0.8rem;
  }

  .nav-item,
  .logout-btn {
    width: 100%;
    text-align: left;
  }
}
</style>
