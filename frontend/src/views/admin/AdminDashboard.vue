<template>
  <div class="admin-welcome-page">
    <AdminNavbar />


    <!-- 🎬 Slideshow Header -->
    <section class="page-header">
      <div class="slideshow-header">
        <div
          class="slide"
          v-for="(img, index) in images"
          :key="index"
          :style="{ backgroundImage: `url(${img})` }"
        ></div>
        <div class="overlay"></div>
      </div>

      <div class="header-content">
        <h1>🎥 Welcome, Admin!</h1>
        <p>Manage Cine<span class="white">Book</span> with ease — oversee movies, showtimes, and bookings.</p>
      </div>
    </section>

    <!-- 📖 About Us -->
    <section class="about-us">
      <div class="about-header">
        <h2>About Cine<span class="white">Book</span></h2>
        <p>
          CineBook is your all-in-one platform for managing cinema operations — 
          designed for simplicity, efficiency, and a touch of style. 
          As an admin, you have the tools to deliver the best movie experience to your audience.
        </p>
      </div>

      <!-- 🧰 Services -->
      <div class="features">
        <div class="feature-card">
          <h3>Movie Management</h3>
          <p>Add, edit, or remove movies effortlessly to keep your catalog updated.</p>
        </div>
        <div class="feature-card">
          <h3>Showtime Scheduling</h3>
          <p>Plan and manage showtimes efficiently across multiple cinema halls.</p>
        </div>
        <div class="feature-card">
          <h3>Booking Oversight</h3>
          <p>Track and monitor user bookings and transactions in real-time.</p>
        </div>
        <div class="feature-card">
          <h3>Reports & Analytics</h3>
          <p>Access key performance insights and detailed operational reports.</p>
        </div>
      </div>

      <!-- 🎯 Mission and Vision -->
      <div class="mission-vision">
        <div class="mv-card">
          <h3>🎯 Mission</h3>
          <p>
            To provide an intuitive, efficient, and seamless movie management system that empowers admins to 
            deliver an exceptional viewing experience to every moviegoer.
          </p>
        </div>
        <div class="mv-card">
          <h3>👁 Vision</h3>
          <p>
            To be the leading digital cinema management platform that revolutionizes how theaters operate 
            and connect with audiences through technology.
          </p>
        </div>
      </div>
    </section>
    <AdminFooter />
  </div>
</template>

<script>
import AdminNavbar from '../../components/admin/AdminNavbar.vue';
import AdminFooter from '../../components/admin/AdminFooter.vue';
import slide1 from '../../assets/cinema-bg1.jpg';
import slide2 from '../../assets/cinema-bg2.jpg';
import slide3 from '../../assets/cinema-bg3.jpg';

export default {
  components: {
    AdminNavbar,
    AdminFooter
  },
  data() {
    return {
      images: [slide1, slide2, slide3],
    };
  },
};
</script>

<style scoped>
.page-header {
  position: relative;
  height: 100vh; /* ✅ Full screen height to remove gap */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 0; /* ✅ Removed bottom gap */
}


.slideshow-header {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  animation: fade 21s infinite;
}

.slide:nth-child(1) { animation-delay: 0s; }
.slide:nth-child(2) { animation-delay: 7s; }
.slide:nth-child(3) { animation-delay: 14s; }

@keyframes fade {
  0%, 33.33% { opacity: 1; }
  33.34%, 100% { opacity: 0; }
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.header-content h1 {
  color: #ffcc00;
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
}

.header-content p {
  color: #ddd;
  font-size: 1.2rem;
}

.white {
  color: #fff;
}

/* ===== About Section ===== */
.about-us {
  text-align: center;
  background: linear-gradient(180deg, #1a1a1a, #0e0e0e);
  padding: 4rem 2rem 6rem;
  border-top: 2px solid #ff3333;
}

.about-header h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ff3333;
}

.about-header p {
  color: #f1f1f1;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

/* ===== Features / Services ===== */
.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto 4rem;
}

.feature-card {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  width: 240px;
  text-align: center;
  transition: all 0.3s ease;
  color: #f1f1f1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.feature-card h3 {
  color: #ffcc00;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: #ddd;
  font-size: 1rem;
  line-height: 1.5;
}

.feature-card:hover {
  background-color: #ff3333;
  color: #fff;
  transform: translateY(-6px);
  box-shadow: 0 8px 18px rgba(255, 51, 51, 0.4);
}

/* ===== Mission & Vision ===== */
.mission-vision {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 4rem;
}

.mv-card {
  background: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  max-width: 420px;
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s, box-shadow 0.3s;
}

.mv-card h3 {
  color: #ffcc00;
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.mv-card p {
  font-size: 1rem;
  line-height: 1.5;
  color: #ccc;
}

.mv-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 18px rgba(255, 51, 51, 0.4);
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .header-content h1 { font-size: 2.5rem; }
  .header-content p { font-size: 1.1rem; }
  .about-header h2 { font-size: 2.5rem; }
  .mv-card h3 { font-size: 1.4rem; }
}

@media (max-width: 768px) {
  .about-us { padding: 3rem 1.5rem 5rem; }
  .header-content h1 { font-size: 2.2rem; }
  .header-content p { font-size: 1rem; }
  .about-header h2 { font-size: 2rem; }
  .about-header p { font-size: 1rem; }

  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature-card {
    width: 90%;
    max-width: 400px;
  }

  .mission-vision {
    flex-direction: column;
    align-items: center;
  }

  .mv-card {
    width: 90%;
    max-width: 400px;
  }
}
</style>
