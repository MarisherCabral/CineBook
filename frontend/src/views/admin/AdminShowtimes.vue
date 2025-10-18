<template>
  <div class="admin-showtimes">
    <!-- Navbar -->
    <AdminNavbar />

    <!-- Page Header with slideshow -->
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
        <h1>🎞 Manage Showtimes</h1>
        <p>Create, update, and manage movie showtimes with seats.</p>
      </div>
    </section>

    <!-- Add Showtime Form -->
    <form @submit.prevent="addShowtime" class="showtime-form">
      <select v-model="newShowtime.movieId" required>
        <option value="" disabled>Select Movie</option>
        <option v-for="movie in movies" :key="movie._id" :value="movie._id">
          {{ movie.title }}
        </option>
      </select>

      <input v-model="newShowtime.hall" placeholder="Hall" required />
      <input v-model="newShowtime.date" type="date" required />
      <input v-model="newShowtime.time" type="time" required />
      <input v-model.number="newShowtime.price" type="number" placeholder="Ticket Price" required />
      <input v-model.number="newShowtime.totalSeats" type="number" placeholder="Total Seats" required />

      <button type="submit" class="add-btn">+ Add Showtime</button>
    </form>

    <!-- Showtime Grid -->
    <div class="showtime-grid">
      <div v-for="showtime in showtimes" :key="showtime._id" class="showtime-card">

        <!-- Movie Photo -->
       <img
  v-if="showtime.movie?.photo"
  :src="`http://localhost:5000${showtime.movie.photo}`"
  :alt="showtime.movieTitle"
  class="movie-photo"
/>



        <h3>{{ showtime.movieTitle }}</h3>
        <p>🎬 Hall: {{ showtime.hall }}</p>
        <p>📅 Date: {{ formatDate(showtime.startTime) }}</p>
        <p>⏰ Time: {{ formatTime(showtime.startTime) }}</p>
        <p>💵 Price: ₱{{ showtime.price }}</p>
        <p>💺 Total Seats: {{ showtime.totalSeats }}</p>

        <!-- Seat Map -->
        <div v-if="showtime.seats.length" class="seat-map mt-2">
          <div class="seat-grid">
            <div
              v-for="seat in showtime.seats"
              :key="seat.seatNumber"
              :class="['seat', seat.isBooked ? 'booked' : 'available']"
              :title="seat.seatNumber"
            >
              {{ seat.seatNumber }}
            </div>
          </div>
          <div class="seat-legend">
            <span><div class="seat available"></div> Available</span>
            <span><div class="seat booked"></div> Booked</span>
          </div>
        </div>

        <button @click="deleteShowtime(showtime._id)" class="delete-btn">Delete</button>
      </div>
    </div>
    <AdminFooter />
  </div>
</template>

<script>
import AdminNavbar from '../../components/admin/AdminNavbar.vue';
import AdminFooter from '../../components/admin/AdminFooter.vue';
import api from '../../api/axios';
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
      showtimes: [],
      movies: [],
      newShowtime: {
        movieId: '',
        hall: '',
        date: '',
        time: '',
        price: '',
        totalSeats: 20,
      },
      images: [slide1, slide2, slide3],
    };
  },
  async mounted() {
    await this.fetchMovies();
    await this.fetchShowtimes();
  },
  methods: {
    async fetchMovies() {
      try {
        const res = await api.get('/movies');
        this.movies = res.data;
      } catch (err) {
        console.error('Error fetching movies:', err);
      }
    },
    async fetchShowtimes() {
      try {
        const res = await api.get('/showtimes');
        const showtimesWithSeats = await Promise.all(
          res.data.map(async (s) => {
            let seatInfo = [];
            try {
              const seatRes = await api.get(`/seats/showtime/${s._id}`);
              const seats = seatRes.data;
              seatInfo = seats.map((seat) => ({
                seatNumber: seat.seatNumber,
                isBooked: seat.isBooked,
              }));
            } catch {}
            return { ...s, movieTitle: s.movie?.title, seats: seatInfo };
          })
        );
        this.showtimes = showtimesWithSeats;
      } catch (err) {
        console.error('❌ Error fetching showtimes:', err);
      }
    },
    async addShowtime() {
      const token = localStorage.getItem('adminToken');
      if (!token) return alert('⚠️ You must be logged in to add a showtime.');

      try {
        const res = await api.post('/showtimes', { ...this.newShowtime }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(res.data.msg || '🎞 Showtime added successfully!');
        this.newShowtime = { movieId: '', hall: '', date: '', time: '', price: '', totalSeats: 20 };
        await this.fetchShowtimes();
      } catch (err) {
        console.error('❌ Error adding showtime:', err.response?.data || err);
        alert(err.response?.data?.msg || 'Failed to add showtime.');
      }
    },
    async deleteShowtime(id) {
      const token = localStorage.getItem('adminToken');
      if (!token) return alert('⚠️ You must be logged in to delete a showtime.');

      try {
        if (!confirm('Are you sure you want to delete this showtime?')) return;
        const res = await api.delete(`/showtimes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(res.data.msg || '🗑 Showtime deleted.');
        await this.fetchShowtimes();
      } catch (err) {
        console.error('❌ Error deleting showtime:', err.response?.data || err);
        alert(err.response?.data?.msg || 'Failed to delete showtime.');
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    formatTime(date) {
      if (!date) return '';
      return new Date(date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    },
  },
};
</script>

<style scoped>
.admin-showtimes {
  background-color: #121212;
  min-height: 100vh;
  color: #f1f1f1;
}

/* Page Header with slideshow */
.page-header {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 2rem;
}

.slideshow-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 0;
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.header-content h1 {
  font-size: 2.5rem;
  color: #ffcc00;
}

.header-content p {
  font-size: 1.1rem;
  color: #ddd;
}

/* Showtime Form */
.showtime-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  background-color: #1e1e1e;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 900px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.5);
}

.showtime-form input,
.showtime-form select {
  flex: 1 1 200px;
  padding: 0.6rem;
  border: 1px solid #333;
  border-radius: 6px;
  background-color: #2a2a2a;
  color: #f1f1f1;
}

.showtime-form input::placeholder {
  color: #bbb;
}

.add-btn {
  flex: 1 1 150px;
  background-color: #ffcc00;
  color: #000;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.add-btn:hover {
  background-color: #e6b800;
}

/* Showtime Grid */
.showtime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px,1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.showtime-card {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 0.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
  transition: transform 0.2s, box-shadow 0.2s;
}

.showtime-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.6);
}

.showtime-card h3, .showtime-card p {
  color: #f1f1f1;
}

.movie-photo {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
  display: block;
  margin-bottom: 0.5rem;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.delete-btn:hover {
  background-color: #ff1a1a;
}

/* Seat Map */
.seat-map {
  margin-top: 1rem;
}

.seat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(35px, 1fr));
  gap: 6px;
  justify-items: center;
}

.seat {
  width: 35px;
  height: 35px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
}

.seat.available {
  background-color: #34d399;
}

.seat.booked {
  background-color: #f87171;
}

.seat-legend {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

.seat-legend .seat {
  width: 20px;
  height: 20px;
  font-size: 0;
  margin-right: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content h1 { font-size: 2rem; }
  .header-content p { font-size: 1rem; }
  .showtime-form input,
  .showtime-form select { flex: 1 1 100%; }
}
</style>
