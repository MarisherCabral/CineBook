<template>
  <div class="admin-movies">
    <AdminNavbar />

    <!-- HEADER -->
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
        <h1>🎥 Manage Movies</h1>
        <p>Add, update, or delete movies from CineBook.</p>
      </div>
    </section>

    <!-- ADD MOVIE FORM -->
    <form @submit.prevent="addMovie" class="movie-form" enctype="multipart/form-data">
      <input v-model="newMovie.title" placeholder="Title" required />
      <input v-model="newMovie.description" placeholder="Description" required />
      <input v-model="newMovie.genre" placeholder="Genre" required />
      <input v-model.number="newMovie.duration" type="number" placeholder="Duration (mins)" required />
      <input v-model="newMovie.releaseDate" type="date" required />
      <input v-model.number="newMovie.rating" type="number" step="0.1" placeholder="Rating" required />
      <input type="file" name="photo" @change="handleFile" accept="image/*" required />

      <div v-if="imagePreview" class="image-preview">
        <p>Preview:</p>
        <img :src="imagePreview" alt="Preview" />
      </div>

      <button type="submit" class="add-btn">+ Add Movie</button>
    </form>

    <!-- MOVIE GRID -->
    <div class="movie-grid">
      <div v-for="movie in movies" :key="movie._id" class="movie-card">
        <img
          v-if="movie.photo"
          :src="`http://localhost:5000${movie.photo}`"
          :alt="movie.title"
          class="movie-photo"
        />
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.genre }} | {{ movie.duration }} mins</p>
        <p>Rating: {{ movie.rating }}/10</p>
        <div class="card-buttons">
          <button @click="openEditModal(movie)" class="edit-btn">Edit</button>
          <button @click="deleteMovie(movie._id)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal">
        <h2>Edit Movie</h2>
        <input v-model="editMovie.title" placeholder="Title" />
        <input v-model="editMovie.description" placeholder="Description" />
        <input v-model="editMovie.genre" placeholder="Genre" />
        <input v-model.number="editMovie.duration" type="number" placeholder="Duration (mins)" />
        <input v-model="editMovie.releaseDate" type="date" />
        <input v-model.number="editMovie.rating" type="number" step="0.1" placeholder="Rating" />
        <input type="file" @change="handleEditFile" accept="image/*" />

        <div v-if="editImagePreview" class="image-preview">
          <p>Preview:</p>
          <img :src="editImagePreview" alt="Edit Preview" />
        </div>

        <div class="modal-actions">
          <button @click="saveEdit" class="save-btn">Save</button>
          <button @click="closeEditModal" class="cancel-btn">Cancel</button>
        </div>
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
      movies: [],
      newMovie: {
        title: '',
        description: '',
        genre: '',
        duration: '',
        releaseDate: '',
        rating: '',
        photo: null,
      },
      imagePreview: null,
      editMovie: {},
      editImage: null,
      editImagePreview: null,
      showEditModal: false,
      images: [slide1, slide2, slide3],
    };
  },
  async mounted() {
    await this.fetchMovies();
  },
  methods: {
    handleFile(e) {
      const file = e.target.files[0];
      this.newMovie.photo = file;
      this.imagePreview = file ? URL.createObjectURL(file) : null;
    },
    async fetchMovies() {
      try {
        const res = await api.get('/movies');
        this.movies = res.data;
      } catch (err) {
        console.error('Error fetching movies:', err);
      }
    },
    async addMovie() {
      try {
        const formData = new FormData();
        for (const key in this.newMovie) {
          formData.append(key, this.newMovie[key]);
        }

        await api.post('/movies', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert('🎬 Movie added successfully!');
        this.newMovie = { title: '', description: '', genre: '', duration: '', releaseDate: '', rating: '', photo: null };
        this.imagePreview = null;
        await this.fetchMovies();
      } catch (err) {
        console.error('Error adding movie:', err);
        alert('Failed to add movie.');
      }
    },
    openEditModal(movie) {
      this.editMovie = { ...movie };
      this.showEditModal = true;
      this.editImagePreview = movie.photo ? `http://localhost:5000${movie.photo}` : null;
    },
    handleEditFile(e) {
      const file = e.target.files[0];
      this.editImage = file;
      this.editImagePreview = file ? URL.createObjectURL(file) : this.editImagePreview;
    },
    async saveEdit() {
      try {
        const formData = new FormData();
        for (const key in this.editMovie) {
          formData.append(key, this.editMovie[key]);
        }
        if (this.editImage) formData.append('photo', this.editImage);

        await api.put(`/movies/${this.editMovie._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert('✅ Movie updated successfully!');
        this.closeEditModal();
        await this.fetchMovies();
      } catch (err) {
        console.error('Error updating movie:', err);
        alert('Failed to update movie.');
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editMovie = {};
      this.editImage = null;
      this.editImagePreview = null;
    },
    async deleteMovie(id) {
      try {
        if (!confirm('Are you sure you want to delete this movie?')) return;
        await api.delete(`/movies/${id}`);
        alert('Movie deleted.');
        await this.fetchMovies();
      } catch (err) {
        console.error('Error deleting movie:', err);
      }
    },
  },
};
</script>

<style scoped>
.admin-movies {
  background-color: #121212;
  min-height: 100vh;
  color: #f1f1f1;
}

/* ===== Page Header with Slideshow ===== */
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

/* ===== Movie Form ===== */
.movie-form {
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

.movie-form input {
  flex: 1 1 200px;
  padding: 0.6rem;
  border: 1px solid #333;
  border-radius: 6px;
  background-color: #2a2a2a;
  color: #f1f1f1;
}

.movie-form input::placeholder {
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

/* ===== Image Preview ===== */
.image-preview {
  width: 100%;
  text-align: center;
  margin-top: 1rem;
}

.image-preview img {
  max-width: 250px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

/* ===== Movie Grid ===== */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.movie-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.5rem;
}

.movie-card {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  transition: transform 0.2s, box-shadow 0.2s;
}

.movie-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.6);
}

.movie-card h3, .movie-card p {
  color: #f1f1f1;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 0.5rem;
}

.delete-btn:hover {
  background-color: #ff1a1a;
}

.edit-btn {
  background-color: #ffcc00;
  color: #000;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: 0.3s;
}

.edit-btn:hover {
  background-color: #fff;
}

/* ===== MODAL (Wider & Shorter) ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
}

.modal {
  background: #1e1e1e;
  border-radius: 14px;
  padding: 1.5rem 2rem;
  width: 90%;
  max-width: 800px; /* ✅ Wider modal */
  max-height: 85vh; /* ✅ Not too tall */
  overflow-y: auto;
  color: #fff;
  border: 2px solid #ffcc00;
  box-shadow: 0 0 25px rgba(255, 204, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal h2 {
  color: #ffcc00;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.modal form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
}

.modal input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #333;
  background: #2a2a2a;
  color: #fff;
  font-size: 1rem;
}

.modal input[type="file"] {
  grid-column: span 2;
}

.modal input::placeholder {
  color: #aaa;
}

.image-preview {
  grid-column: span 2;
  text-align: center;
  margin-top: 0.5rem;
}

.image-preview img {
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(255, 204, 0, 0.3);
}

/* ===== Modal Actions ===== */
.modal-actions {
  grid-column: span 2;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.save-btn {
  background-color: #ffcc00;
  color: #000;
  border: none;
  padding: 0.7rem 1.8rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.save-btn:hover {
  background-color: #fff;
}

.cancel-btn {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.7rem 1.8rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.cancel-btn:hover {
  background-color: #ff3333;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .header-content h1 { font-size: 2rem; }
  .header-content p { font-size: 1rem; }
  .movie-form input { flex: 1 1 100%; }

  .modal {
    width: 95%;
    padding: 1.2rem;
    max-height: 80vh;
  }

  .modal form {
    grid-template-columns: 1fr;
  }

  .modal h2 {
    font-size: 1.5rem;
  }
}

</style>
