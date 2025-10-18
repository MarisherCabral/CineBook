<template>
  <nav class="navbar">
    <div class="logo">
      <img src="../assets/logo.png" alt="CineBook Logo" class="logo-img" />
      <span class="cine">Cine</span><span class="book">Book</span>
    </div>
    <ul class="nav-links">
      <li><router-link to="/admin/login">Admin Login</router-link></li>
      <li><router-link to="/user/login">User Login</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap');

/* Prevent horizontal scroll */
html, body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.navbar {
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* allow items to wrap */
  padding: 0.8rem 2rem;
  background-color: #1a1a1a;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  box-sizing: border-box;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.7rem;
  font-weight: 700;
  flex-shrink: 1; /* allow shrinking on small screens */
}

.logo-img {
  width: 40px;
  height: 40px;
  margin-right: 0.5rem;
}

.cine {
  color: #fff;
}

.book {
  color: #ff3333;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  flex-wrap: wrap; /* allow links to wrap */
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  white-space: nowrap; /* prevent links from breaking mid-word */
}

.nav-links a:hover {
  color: #ffcc00;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .nav-links a {
    font-size: 1rem;
  }
}
</style>
