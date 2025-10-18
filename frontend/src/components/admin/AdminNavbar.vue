<template>
  <header class="navbar">
    <div class="logo">
      <img src="../../assets/logo.png" alt="CineBook Logo" class="logo-img" />
      <span class="cine">Cine</span><span class="book">Book</span>
      <span class="role">Admin</span>
    </div>

    <nav class="nav-links">
        <router-link to="/admin/dashboard" class="nav-item">Dashboard</router-link>
      <router-link to="/admin/movies" class="nav-item">Movies</router-link>
      <router-link to="/admin/showtimes" class="nav-item">Showtimes</router-link>
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
      localStorage.removeItem('adminToken');
      alert('Logged out successfully.');
      router.push('/');
    };
    return { logout };
  },
};
</script>

<style scoped>
html, body {
  overflow-x: hidden; /* prevent page overflow */
}

.navbar {
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* allow wrapping if too wide */
  background-color: #1a1a1a;
  padding: 0.8rem 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  z-index: 1000;
  box-sizing: border-box;
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 1; /* allows logo to shrink on small screens */
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-img {
  width: 40px;
  height: 40px;
  margin-right: 0.5rem;
}

.logo .cine {
  color: #fff;
}

.logo .book {
  color: #ff3333;
}

.logo .role {
  color: #ffcc00;
  font-size: 1rem;
  margin-left: 0.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem; /* reduce gap to prevent overflow */
  flex-wrap: wrap; /* wrap links on small screens */
  flex-shrink: 1;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap; /* prevent breaking inside a word */
  transition: color 0.3s;
}

.nav-item:hover,
.router-link-exact-active {
  color: #ffcc00;
}

.logout-btn {
  background-color: #ff3333;
  color: #fff;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  white-space: nowrap;
}

.logout-btn:hover {
  background-color: #ffcc00;
  color: #000;
}

.nav-item.router-link-exact-active {
  color: #ffcc00;
}

@media (max-width: 768px) {
  .logo {
    width: 100%;
    justify-content: flex-start;
    margin-bottom: 0.5rem;
  }

  .nav-links {
    width: 100%;
    gap: 0.5rem;
  }

  .nav-item, .logout-btn {
    width: 100%;
    text-align: center;
  }
}


/* Mobile responsiveness */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .nav-item, .logout-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
