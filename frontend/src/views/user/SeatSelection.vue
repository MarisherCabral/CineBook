<template>
  <div class="seat-selection">
    <UserNavbar />

    <div class="content">
      <h1>
        Select Seats for <strong>{{ movieTitle }}</strong>
      </h1>

      <div class="seats-container">
        <div class="screen">SCREEN</div>

        <div class="seats-grid">
          <div
            v-for="seat in seats"
            :key="seat.id"
            :class="['seat', { selected: selectedSeats.includes(seat.id), occupied: seat.occupied }]"
            @click="toggleSeat(seat)"
          >
            {{ seat.label }}
          </div>
        </div>
      </div>

      <div class="actions">
        <button @click="confirmBooking" :disabled="selectedSeats.length === 0">
          Confirm Booking ({{ selectedSeats.length }} seat<span v-if="selectedSeats.length>1">s</span>)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserNavbar from '../../components/user/UserNavbar.vue';
import api from '../../api/axios';

export default {
  components: { UserNavbar },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const seats = ref([]);
    const selectedSeats = ref([]);
    const showtimeId = route.params.showtimeId;
    const movieId = route.query.movieId;
    const movieTitle = ref(route.query.movieTitle || 'Selected Movie');

    const fetchSeats = async () => {
      try {
        const res = await api.get(`/seats/showtime/${showtimeId}`);
        seats.value = res.data.map((s) => ({
          id: s._id,
          label: s.seatNumber,
          occupied: s.isBooked,
        }));
      } catch (err) {
        console.error('Failed to load seats:', err);
        alert('Failed to load seats.');
      }
    };

    const toggleSeat = (seat) => {
      if (seat.occupied) return;
      const idx = selectedSeats.value.indexOf(seat.id);
      if (idx > -1) selectedSeats.value.splice(idx, 1);
      else selectedSeats.value.push(seat.id);
    };

    const confirmBooking = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) return alert('Please login to book seats.');

        const payload = { showtimeId, seatIds: selectedSeats.value, movieId };
        const res = await api.post('/bookings', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert('Booking successful! Redirecting to payment...');
        router.push({
          path: '/user/payment',
          query: {
            bookingId: res.data.booking._id,
            movieTitle: movieTitle.value,
            seatCount: selectedSeats.value.length,
            showtime: res.data.booking.showtimeId.startTime,
            hall: res.data.booking.showtimeId.hall,
          },
        });
      } catch (err) {
        console.error('Booking failed:', err.response?.data || err);
        alert(err.response?.data?.msg || 'Booking failed.');
        selectedSeats.value = [];
        fetchSeats();
      }
    };

    onMounted(fetchSeats);

    return { seats, selectedSeats, toggleSeat, confirmBooking, movieTitle };
  },
};
</script>

<style scoped>
.seat-selection {
  background: #000;
  min-height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Center content area */
.content {
  flex: 1;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

h1 {
  color: #ffcc00;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
}

/* Seat layout container */
.seats-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Decorative screen bar */
.screen {
  width: 80%;
  height: 20px;
  background: linear-gradient(to bottom, #ccc, #888);
  color: #000;
  font-weight: bold;
  text-align: center;
  line-height: 20px;
  margin-bottom: 1.5rem;
  border-radius: 5px;
}

/* Grid of seats */
.seats-grid {
  display: grid;
  grid-template-columns: repeat(8, 45px);
  gap: 12px;
  justify-content: center;
  margin-bottom: 2rem;
}

.seat {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  line-height: 45px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.seat.selected {
  background: #ffcc00;
  color: #000;
}

.seat.occupied {
  background: #ff3333;
  cursor: not-allowed;
}

/* Button container */
.actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.actions button {
  background-color: #ffcc00;
  color: #000;
  border: none;
  padding: 0.9rem 2.5rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  font-size: 1rem;
}

.actions button:hover {
  background: #fff;
}

.actions button:disabled {
  background: #666;
  color: #333;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .seats-grid {
    grid-template-columns: repeat(6, 40px);
    gap: 10px;
  }

  .seat {
    width: 40px;
    height: 40px;
    line-height: 40px;
  }

  h1 {
    font-size: 1.6rem;
  }
}
</style>
