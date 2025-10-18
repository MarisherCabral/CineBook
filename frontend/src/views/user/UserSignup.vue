<template>
  <div class="auth-page">
    <div class="background"></div>
    <div class="form-container">
      <h1>User Sign Up</h1>

      <form @submit.prevent="signup" class="auth-form">
        <input
          v-model="username"
          placeholder="Username"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit" class="add-btn">Sign Up</button>
      </form>

      <p>
        Already have an account?
        <router-link to="/user/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../../api/axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');

    const signup = async () => {
      console.log('Submitting signup:', username.value, password.value);
      try {
        const res = await api.post('/auth/user/signup', {
          username: username.value,
          password: password.value,
          role: 'Customer',
        });

        console.log('Backend response:', res.data);
        alert('Signup successful! Please login.');
        router.push('/user/login');
      } catch (err) {
        console.error('Signup error:', err.response?.data);
        alert(err.response?.data?.msg || 'Signup failed');
      }
    };

    return { username, password, signup };
  },
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  font-family: 'Montserrat', sans-serif;
}

/* Page container */
.auth-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  overflow: hidden;
}

/* Background blur */
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../../assets/cinema-bg.jpg') center center / cover no-repeat;
  filter: blur(10px) brightness(0.5);
  z-index: 0;
}

/* Form container */
.form-container {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  padding: 3rem 2rem;
  border-radius: 15px;
  width: 350px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0,0,0,0.6);
  color: #fff;
}

/* Form styling */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.auth-form input {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  outline: none;
  background-color: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 1rem;
}

.auth-form input::placeholder {
  color: #ddd;
}

.auth-form button {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  background-color: #1a1a1a;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-form button:hover {
  background-color: #ffcc00;
  color: #000;
}

p {
  margin-top: 1rem;
  font-size: 0.95rem;
}

p a {
  color: #ffcc00;
  font-weight: 600;
  text-decoration: none;
}

p a:hover {
  color: #ff3333;
}
</style>
