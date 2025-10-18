<template>
  <footer class="admin-footer">
    <div class="footer-content">
      <h2 class="logo">
        <span class="cine">Cine</span><span class="book">Book</span>
        <span class="admin-tag">Admin</span>
      </h2>
      <p>Manage movies, showtimes, and bookings efficiently with CineBook.</p>

      <p class="copyright">
        © {{ new Date().getFullYear() }} CineBook Admin. All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AdminFooter",
};
</script>

<style scoped>
.admin-footer {
  background-color: #111;
  color: #f1f1f1;
  padding: 2.5rem 1rem;
  text-align: center;
  border-top: 2px solid #ff3333;
}

.logo {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.cine {
  color: #fff;
}

.book {
  color: #ff3333;
  font-weight: bold;
}

.admin-tag {
  color: #ffcc00;
  font-size: 1rem;
  margin-left: 0.4rem;
}

.footer-content p {
  color: #ccc;
  margin: 0.5rem 0;
  font-size: 1rem;
}

.copyright {
  color: #888;
  font-size: 0.85rem;
  margin-top: 0.8rem;
}
</style>
