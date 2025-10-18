<template>
  <div class="home-page">
    <!-- Navbar -->
    <Navbar />

    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="overlay"></div>
      <div class="welcome-content">
        <h2 class="welcome-to">Welcome to</h2>
        <h1 class="cinebook-title">
          <span class="cine">Cine</span><span class="book">Book</span>
        </h1>
        <p>Book Movies. Fast. Easy. Anytime.</p>
      </div>
    </section>

    <!-- 🎬 Now Showing -->
    <section v-if="nowShowing.length" class="movies-section">
      <h2>Now Showing</h2>
      <div class="movie-grid">
        <div v-for="movie in nowShowing" :key="movie._id" class="movie-card">
          <div class="image-wrapper">
            <img :src="getMovieImage(movie.photo)" :alt="movie.title" />
          </div>
          <h3>{{ movie.title }}</h3>
          <p>{{ movie.genre }} | {{ movie.duration }} mins</p>
          <p>Rating: {{ movie.rating }}/10</p>
        </div>
      </div>
    </section>

    <!-- ⏳ Coming Soon -->
    <section v-if="comingSoon.length" class="movies-section coming-soon">
      <h2>Coming Soon</h2>
      <div class="movie-grid">
        <div v-for="movie in comingSoon" :key="movie._id" class="movie-card">
          <div class="image-wrapper">
            <img :src="getMovieImage(movie.photo)" :alt="movie.title" />
          </div>
          <h3>{{ movie.title }}</h3>
          <p>{{ movie.genre }} | {{ movie.duration }} mins</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from '../components/NavBar.vue';
import api from '../api/axios';

export default {
  components: { Navbar },
  data() {
    return {
      movies: [],
      showtimes: [],
      nowShowing: [],
      comingSoon: [],
    };
  },
  methods: {
    // ✅ Safely return full image path or placeholder
    getMovieImage(photo) {
      if (!photo) return 'https://via.placeholder.com/200x300?text=No+Image';
      return photo.startsWith('/uploads/')
        ? `http://localhost:5000${photo}`
        : `http://localhost:5000/uploads/${photo}`;
    },

    // ✅ Categorize based on showtimes from backend
    categorizeMovies() {
      // Showtimes return movie populated → use movie._id
      const movieIdsWithShowtime = new Set(
        this.showtimes.map((s) => s.movie?._id)
      );

      this.nowShowing = this.movies.filter((m) =>
        movieIdsWithShowtime.has(m._id)
      );

      this.comingSoon = this.movies.filter(
        (m) => !movieIdsWithShowtime.has(m._id)
      );
    },
  },
  async mounted() {
    try {
      const [moviesRes, showtimesRes] = await Promise.all([
        api.get('/movies'),
        api.get('/showtimes'),
      ]);

      this.movies = moviesRes.data;
      this.showtimes = showtimesRes.data;
      this.categorizeMovies();
    } catch (err) {
      console.error('❌ Error fetching data:', err);
    }
  },
};
</script>

<style scoped>
html, body {
  overflow-x: hidden;
}

/* Wrapper */
.home-page {
  width: 100%;
  font-family: 'Montserrat', sans-serif;
}

/* Welcome Section */
.welcome-section {
  position: relative;
  min-height: 70vh;
  background: url('../assets/background.jpg') no-repeat center top;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
  overflow: hidden;
  padding-bottom: 1rem;
}

.welcome-section .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(18, 18, 18, 0.6);
  z-index: 0;
}

.welcome-content {
  position: relative;
  z-index: 1;
}

.welcome-to {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #ddd;
}

.cinebook-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.cinebook-title .cine {
  color: #fff;
}

.cinebook-title .book {
  color: #ff3333;
}

.welcome-content p {
  font-size: 1.3rem;
  color: #ddd;
}

/* Movie Section */
.movies-section {
  padding: 3rem 2rem;
  text-align: center;
  background-color: #1b1b1b;
}

.movies-section h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #fff;
}

/* Coming Soon Section */
.coming-soon {
  background-color: #141414;
  border-top: 2px solid #ff3333;
}

/* Movie Grid */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

/* Movie Card */
.movie-card {
  background-color: rgba(25, 25, 25, 0.85);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.8);
}

/* Image */
.image-wrapper {
  width: 100%;
  max-width: 200px;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 0.8rem;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.movie-card:hover img {
  transform: scale(1.05);
}

/* Text */
.movie-card h3 {
  margin: 0.5rem 0 0.3rem 0;
  font-size: 1.1rem;
  color: #fff;
}

.movie-card p {
  margin: 0.2rem 0;
  font-size: 0.95rem;
  color: #ddd;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-to {
    font-size: 1.8rem;
  }

  .cinebook-title {
    font-size: 2.2rem;
  }

  .welcome-content p {
    font-size: 1rem;
  }

  .image-wrapper {
    max-width: 180px;
    height: 270px;
  }
}

@media (max-width: 480px) {
  .welcome-to {
    font-size: 1.5rem;
  }

  .cinebook-title {
    font-size: 1.8rem;
  }

  .welcome-content p {
    font-size: 0.9rem;
  }

  .image-wrapper {
    max-width: 150px;
    height: 225px;
  }

  .movie-card h3 {
    font-size: 1rem;
  }

  .movie-card p {
    font-size: 0.85rem;
  }
}
</style>
