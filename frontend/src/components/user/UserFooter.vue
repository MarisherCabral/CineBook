<template>
  <footer class="user-footer">
    <div class="footer-content">
      <h2 class="logo">
        <span class="cine">Cine</span><span class="book">Book</span>
      </h2>
      <p>Experience movies like never before — easy booking, smooth management, and pure entertainment.</p>

      <p class="copyright">
        © {{ new Date().getFullYear() }} CineBook. All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "UserFooter",
};
</script>

<style scoped>
.user-footer {
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
