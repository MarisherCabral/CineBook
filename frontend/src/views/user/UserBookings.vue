<template>
  <div class="user-bookings">
    <UserNavbar />

    <!-- 🎥 Slideshow Section -->
    <section class="slideshow">
      <div
        class="slide"
        v-for="(img, index) in images"
        :key="index"
        :style="{ backgroundImage: `url(${img})` }"
        :class="{ active: currentSlide === index }"
      ></div>
      <div class="overlay">
        <h1>
          <span class="highlight-white">Your</span>
          <span class="highlight-red">Bookings</span>
        </h1>
        <p>Check your movie reservations and details below.</p>
      </div>
    </section>

    <!-- 📅 Booking List Section -->
    <div class="content">
      <h2>Booking History</h2>

      <div v-if="bookings.length" class="booking-grid">
        <div v-for="booking in bookings" :key="booking._id" class="booking-card">
          <div class="card-inner">
            <img
              v-if="booking.movieId?.photo"
              :src="getImageUrl(booking.movieId.photo)"
              :alt="booking.movieId.title"
              class="movie-photo"
            />
            <h3>{{ booking.movieId.title }}</h3>

            <div class="booking-info">
              <p><strong>Date:</strong> {{ formatDate(booking.showtimeId.startTime) }}</p>
              <p><strong>Time:</strong> {{ formatTime(booking.showtimeId.startTime) }}</p>
              <p><strong>Hall:</strong> {{ booking.showtimeId.hall }}</p>
              <p><strong>Seats:</strong> {{ formatSeats(booking.seatIds) }}</p>
              <p><strong>Status:</strong>
                <span :class="booking.status.toLowerCase()">{{ booking.status }}</span>
              </p>
            </div>

            <p class="price"><strong>Total:</strong> ₱{{ booking.seatIds.length * 250 }}</p>
          </div> <!-- /.card-inner -->
        </div> <!-- /.booking-card -->
      </div> <!-- /.booking-grid -->

      <p v-else class="no-bookings">You have no bookings yet.</p>
    </div> <!-- /.content -->

    <UserFooter />
  </div> <!-- /.user-bookings -->
</template>


<script>
import { ref, onMounted } from 'vue';
import UserNavbar from '../../components/user/UserNavbar.vue';
import UserFooter from '../../components/user/UserFooter.vue';
import api from '../../api/axios';
import slide1 from '../../assets/slide1.jpg';
import slide2 from '../../assets/slide2.jpg';
import slide3 from '../../assets/slide3.jpg';
import slide4 from '../../assets/slide4.jpg';

export default {
  components: { UserNavbar, UserFooter },
  setup() {
    const bookings = ref([]);
    const images = [slide1, slide2, slide3, slide4];
    const currentSlide = ref(0);

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) return alert('Please login to view bookings.');

        const res = await api.get('/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        bookings.value = res.data;
      } catch (err) {
        console.error('Error fetching bookings:', err);
        alert('Failed to load your booking history.');
      }
    };

    const startSlideshow = () => {
      setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % images.length;
      }, 4000);
    };

    const getImageUrl = (photo) =>
      photo ? `http://localhost:5000${photo}` : 'https://via.placeholder.com/200x300?text=No+Image';

    const formatDate = (date) => new Date(date).toLocaleDateString();
    const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatSeats = (seatIds) => seatIds.map(s => s.seatNumber).join(', ');

    onMounted(() => {
      fetchBookings();
      startSlideshow();
    });

    return { bookings, images, currentSlide, getImageUrl, formatDate, formatTime, formatSeats };
  }
};
</script>

<style scoped>
.user-bookings {
  background: #000;
  min-height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
}

/* --- Slideshow --- */
.slideshow {
  position: relative;
  width: 100%;
  height: 55vh;
  overflow: hidden;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.2s ease-in-out;
}

.slide.active {
  opacity: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  padding: 2rem;
}

.overlay h1 {
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
}

.overlay .highlight-white { color: #fff; }
.overlay .highlight-red { color: #ff3333; }

.overlay p {
  font-size: 1.2rem;
  color: #ddd;
  max-width: 600px;
}

/* --- Booking Section --- */
.content {
  flex: 1;
  max-width: 1000px;
  margin: 3rem auto;
  text-align: center;
  padding: 0 1rem;
}

h2 {
  color: #ffcc00;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.booking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  justify-items: stretch;   /* make cards stretch to fill columns */
  align-items: start;
  grid-auto-rows: 1fr;      /* equal height rows */
}


.booking-card {
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(255, 204, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
  width: 100%;
  max-width: none; /* allow grid to manage widths */
}


.card-inner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}



.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(255, 204, 0, 0.5);
}

.movie-photo {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.booking-card h3 {
  color: #ffcc00;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.booking-info p {
  margin: 0.3rem 0;
  color: #ddd;
  font-size: 0.95rem;
}

.booking-info span.confirmed { color: #34d399; font-weight: 600; }
.booking-info span.cancelled { color: #f87171; font-weight: 600; }

.price {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #ffcc00;
  font-weight: 600;
}

.no-bookings {
  text-align: center;
  color: #ccc;
  font-size: 1.2rem;
  margin-top: 2rem;
}

/* --- Responsive --- */
@media (max-width: 1024px) {
  .booking-grid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
}

@media (max-width: 768px) {
  .booking-grid { grid-template-columns: 1fr; }
  .overlay h1 { font-size: 2rem; }
  .overlay p { font-size: 1rem; max-width: 90%; }
  .movie-photo { height: 250px; }
  .booking-card { padding: 1rem; }
}
</style>
