<template>
  <div class="dashboard">
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
          Welcome to
          <span class="highlight-white">Cine</span><span class="highlight-red">Book</span>
        </h1>
        <p>Book your favorite movies in just a few clicks.</p>
      </div>
    </section>

    <!-- 🎬 Now Showing Section -->
    <section v-if="nowShowing.length" class="content">
      <h2>Now Showing</h2>
      <div class="movie-grid">
        <div
          v-for="movie in nowShowing"
          :key="movie._id"
          class="movie-card"
        >
          <img :src="getImageUrl(movie.photo)" :alt="movie.title" @click="openMovieModal(movie)" />
          <h3 @click="openMovieModal(movie)">{{ movie.title }}</h3>
          <p>{{ movie.genre }} | {{ movie.duration }} mins</p>
          <p>Rating: {{ movie.rating }}/10</p>

          <!-- 🎟️ Showtime Buttons -->
          <div v-if="movie.showtimes && movie.showtimes.length" class="showtime-section">
            <p class="showtime-label">Select Showtime:</p>
            <div class="showtime-buttons">
              <button
                v-for="showtime in movie.showtimes"
                :key="showtime._id"
                class="showtime-btn"
                @click="goToSeatSelection(movie, showtime)"
              >
                {{ formatDate(showtime.startTime) }} {{ formatTime(showtime.startTime) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ⏳ Coming Soon Section -->
    <section v-if="comingSoon.length" class="content coming-soon">
      <h2>Coming Soon</h2>
      <div class="movie-grid">
        <div
          v-for="movie in comingSoon"
          :key="movie._id"
          class="movie-card"
          @click="openMovieModal(movie)"
        >
          <img :src="getImageUrl(movie.photo)" :alt="movie.title" />
          <div class="ribbon">Coming Soon</div>
          <h3>{{ movie.title }}</h3>
          <p>{{ movie.genre }} | {{ movie.duration }} mins</p>
          <p>Rating: {{ movie.rating }}/10</p>
        </div>
      </div>
    </section>

    <!-- 🎞 About CineBook -->
    <section class="about-cinebook">
      <div class="about-container">
        <h2>
          About <span class="cine">Cine</span><span class="book">Book</span>
        </h2>
        <p>
          <span class="cine">Cine</span><span class="book">Book</span> is your ultimate movie companion.
          We bring you closer to the big screen by making movie booking simple,
          secure, and seamless. From the latest blockbusters to indie favorites,
          enjoy a smooth ticketing experience — anytime, anywhere.
        </p>
      </div>
    </section>

    <!-- 🍿 Our Services -->
    <section class="cinebook-services">
      <div class="services-container">
        <h2>Our Services</h2>
        <div class="services-grid">
          <div class="service-card">
            <div class="icon">🎟️</div>
            <h3>Easy Booking</h3>
            <p>Reserve seats instantly with our user-friendly ticketing system.</p>
          </div>
          <div class="service-card">
            <div class="icon">🍿</div>
            <h3>Exclusive Previews</h3>
            <p>Get early access to movie schedules and upcoming releases.</p>
          </div>
          <div class="service-card">
            <div class="icon">💳</div>
            <h3>Flexible Payments</h3>
            <p>Choose your preferred payment method for convenience and safety.</p>
          </div>
          <div class="service-card">
            <div class="icon">📅</div>
            <h3>Smart Scheduling</h3>
            <p>Stay updated with real-time showtimes and personalized bookings.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 🎬 Footer -->
    <UserFooter />

    <!-- 🎥 Movie Modal -->
    <div v-if="selectedMovie" class="movie-modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">&times;</button>
        <img :src="getImageUrl(selectedMovie.photo)" :alt="selectedMovie.title" />
        <h2>{{ selectedMovie.title }}</h2>
        <p><strong>Genre:</strong> {{ selectedMovie.genre }}</p>
        <p><strong>Duration:</strong> {{ selectedMovie.duration }} mins</p>
        <p><strong>Rating:</strong> {{ selectedMovie.rating }}/10</p>
        <p><strong>Release Date:</strong> {{ formatDate(selectedMovie.releaseDate) }}</p>
        <p class="plot"><strong>Description:</strong> {{ selectedMovie.description }}</p>
      </div>
    </div>

    <!-- 🕳️ Fallback -->
    <p v-if="!nowShowing.length && !comingSoon.length" class="no-movies">No movies available.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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
    const router = useRouter();
    const movies = ref([]);
    const nowShowing = ref([]);
    const comingSoon = ref([]);
    const currentSlide = ref(0);
    const selectedMovie = ref(null);
    const images = [slide1, slide2, slide3, slide4];

    const fetchMovies = async () => {
      try {
        const moviesRes = await api.get('/movies');
        const allMovies = moviesRes.data;
        const moviesWithShowtimes = await Promise.all(
          allMovies.map(async (m) => {
            const showRes = await api.get(`/showtimes/movie/${m._id}`);
            return { ...m, showtimes: showRes.data };
          })
        );
        movies.value = moviesWithShowtimes;
        categorizeMovies();
      } catch (err) {
        console.error('Error fetching movies:', err);
      }
    };

    const categorizeMovies = () => {
      nowShowing.value = movies.value.filter((m) => m.showtimes && m.showtimes.length > 0);
      comingSoon.value = movies.value.filter((m) => !m.showtimes || m.showtimes.length === 0);
    };

    const startSlideshow = () => {
      setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % images.length;
      }, 4000);
    };

    const getImageUrl = (photo) =>
      photo ? `http://localhost:5000${photo}` : 'https://via.placeholder.com/200x300?text=No+Image';

    const goToSeatSelection = (movie, showtime) => {
      router.push({
        path: `/user/seats/${showtime._id}`,
        query: { movieTitle: movie.title, movieId: movie._id },
      });
    };

    const formatDate = (date) => new Date(date).toLocaleDateString();
    const formatTime = (date) =>
      new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const openMovieModal = (movie) => (selectedMovie.value = movie);
    const closeModal = () => (selectedMovie.value = null);

    onMounted(() => {
      fetchMovies();
      startSlideshow();
    });

    return {
      movies,
      nowShowing,
      comingSoon,
      images,
      currentSlide,
      selectedMovie,
      getImageUrl,
      formatDate,
      formatTime,
      goToSeatSelection,
      openMovieModal,
      closeModal,
    };
  },
};
</script>



<style scoped>
.dashboard {
  background: #000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* --- 🎥 Slideshow --- */
.slideshow {
  position: relative;
  width: 100%;
  height: 70vh;
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

.overlay .highlight-white {
  color: #fff;
}

.overlay .highlight-red {
  color: #ff3333;
}

/* --- 🎬 Content Section --- */
.content {
  padding: 3rem 1.5rem;
  text-align: center;
  flex: 1;
}

h2 {
  color: white;
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* --- 🍿 Coming Soon --- */
.coming-soon {
  background-color: #111;
  border-top: 2px solid #ff3333;
  padding-top: 3rem;
}

/* --- 🎞 About CineBook --- */
.about-cinebook {
  background-color: #0e0e0e;
  color: #fff;
  padding: 4rem 2rem;
  text-align: center;
  border-top: 1px solid #222;
}

.about-container {
  max-width: 900px;
  margin: 0 auto;
}

.about-cinebook h2 {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.about-cinebook .cine {
  color: #fff;
}

.about-cinebook .book {
  color: #ff3333;
}

.about-cinebook p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #ddd;
  margin: 0 auto;
  max-width: 700px;
}

/* --- 🎟️ CineBook Services --- */
.cinebook-services {
  background-color: #111;
  color: #fff;
  text-align: center;
  padding: 4rem 2rem 5rem 2rem;
  border-top: 1px solid #222;
}

.cinebook-services h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  color: #fff;
}

.services-container {
  max-width: 1100px;
  margin: 0 auto;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.service-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 260px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s, border 0.3s;
  border: 1px solid transparent;
}

.service-card:hover {
  transform: translateY(-6px);
  border: 1px solid #ff3333;
  box-shadow: 0 8px 20px rgba(255, 51, 51, 0.3);
}

.service-card .icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.service-card h3 {
  color: #ffcc00;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.service-card p {
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* --- 🎬 Movie Grid --- */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.movie-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1rem;
  width: 220px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  color: #fff;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(255, 204, 0, 0.3);
}

.movie-card img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.5rem;
}

/* Showtime Buttons */
.showtime-section {
  margin-top: 10px;
  text-align: center; /* centers label */
}

.showtime-label {
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
}

.showtime-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center; /* centers the buttons */
}

.showtime-btn {
  background-color: #ff3b3f; /* Red color matching CineBook theme */
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.showtime-btn:hover {
  background-color: #e03134; /* Darker red on hover */
  transform: scale(1.05);
}

.showtime-btn:focus {
  outline: 2px solid #fff;
  outline-offset: 2px;
}



/* --- 🎞 Ribbon --- */
.ribbon {
  position: absolute;
  top: 10px;
  left: -25px;
  background: #ff3333;
  color: #fff;
  padding: 0.3rem 1.5rem;
  transform: rotate(-45deg);
  font-size: 0.75rem;
  font-weight: bold;
}

/* --- 🎥 Modal --- */
.movie-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
}

.modal-content {
  background: #1a1a1a;
  border: 2px solid #ff3333;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  color: #fff;
  text-align: center;
  position: relative;
  box-shadow: 0 0 25px rgba(255, 51, 51, 0.4);
}

.modal-content img {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.modal-content h2 {
  color: #ffcc00;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #ddd;
  margin: 0.4rem 0;
}

.modal-content .plot {
  margin-top: 1rem;
  color: #ccc;
  line-height: 1.6;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 18px;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #ff3333;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #ffcc00;
}

/* --- 📱 Responsive --- */
@media (max-width: 768px) {
  .overlay h1 {
    font-size: 2rem;
  }

  .overlay p {
    font-size: 1rem;
  }

  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }

  .movie-card img {
    height: 240px;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .about-cinebook h2 {
    font-size: 2rem;
  }

  .cinebook-services h2 {
    font-size: 1.8rem;
  }

  .service-card {
    max-width: 320px;
  }
}

/* --- Footer spacing --- */
UserFooter {
  margin-top: 2rem;
  display: block;
}

/* --- No Movies Text --- */
.no-movies {
  color: #ccc;
  font-size: 1.2rem;
  margin: 2rem auto;
}
</style>
