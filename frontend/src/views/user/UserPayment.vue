<template>
  <div class="user-payment">
    <UserNavbar />

    <div class="payment-wrapper">
      <div class="payment-card">
        <h2>Payment Summary</h2>

        <!-- Movie & Showtime Info -->
        <div class="payment-info">
          <div class="info-row">
            <span>Movie:</span>
            <strong>{{ movieTitle }}</strong>
          </div>
          <div class="info-row">
            <span>Date:</span>
            <strong>{{ showDate }}</strong>
          </div>
          <div class="info-row">
            <span>Time:</span>
            <strong>{{ showTime }}</strong>
          </div>
          <div class="info-row">
            <span>Hall:</span>
            <strong>{{ hall }}</strong>
          </div>
          <div class="info-row">
            <span>Seats:</span>
            <strong>{{ seatCount }}</strong>
          </div>
          <div class="info-row total">
            <span>Total Price:</span>
            <strong>₱{{ totalPrice }}</strong>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="payment-method">
          <p>Select Payment Method:</p>
          <div class="method-buttons">
            <button
              :class="{ selected: paymentMethod === 'card' }"
              @click="paymentMethod = 'card'"
            >
              Card
            </button>
            <button
              :class="{ selected: paymentMethod === 'counter' }"
              @click="paymentMethod = 'counter'"
            >
              Pay at Counter
            </button>
          </div>
        </div>

        <button
          @click="payNow"
          class="pay-btn"
          :disabled="!paymentMethod"
        >
          Pay Now
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

    const movieTitle = ref(route.query.movieTitle || 'Movie');
    const seatCount = ref(route.query.seatCount || 0);
    const hall = ref(route.query.hall || 'Main Hall');
    const showtime = route.query.showtime ? new Date(route.query.showtime) : new Date();
    const bookingId = ref(route.query.bookingId || null);

    const ticketPrice = 250;
    const totalPrice = ref(seatCount.value * ticketPrice);
    const paymentMethod = ref('');

    const showDate = ref('');
    const showTime = ref('');

    const payNow = async () => {
      if (!paymentMethod.value) return alert('Please select a payment method.');

      try {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) return alert('Please login first.');

        const payload = {
          bookingId: bookingId.value,
          amount: totalPrice.value,
          paymentMethod: paymentMethod.value,
          transactionCode: `TXN${Date.now()}`,
        };

        const res = await api.post('/payments', payload, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        alert(`Payment successful!\nTransaction: ${res.data.transactionCode}`);
        router.push('/user/dashboard');
      } catch (err) {
        console.error('Payment failed:', err.response?.data || err);
        alert(err.response?.data?.msg || 'Payment failed. Please try again.');
      }
    };

    onMounted(() => {
      totalPrice.value = seatCount.value * ticketPrice;
      showDate.value = showtime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      showTime.value = showtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    return {
      movieTitle,
      seatCount,
      hall,
      totalPrice,
      paymentMethod,
      payNow,
      showDate,
      showTime,
    };
  },
};
</script>

<style scoped>
.user-payment {
  background: radial-gradient(circle at top, #0a0a0a, #000);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #fff;
}

/* --- Center Wrapper --- */
.payment-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center; /* ✅ Center vertically and horizontally */
  padding: 2rem;
}

/* --- Card --- */
.payment-card {
  background-color: #1e1e1e;
  width: 100%;
  max-width: 450px;
  border-radius: 18px;
  padding: 2.5rem 2rem;
  box-shadow: 0 0 30px rgba(255, 204, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  transform: translateY(-30px); /* ✅ Lift slightly for perfect visual center */
}

/* --- Header --- */
.payment-card h2 {
  font-size: 2rem;
  color: #ffcc00;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
}

/* --- Info --- */
.payment-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  color: #ddd;
}

.info-row strong {
  color: #fff;
  font-weight: 600;
}

.info-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffcc00;
  border-top: 1px solid #444;
  padding-top: 0.8rem;
}

/* --- Payment Method --- */
.payment-method {
  margin-bottom: 2rem;
  text-align: center;
}

.method-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.method-buttons button {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #ffcc00;
  color: #000;
  font-weight: 600;
  transition: all 0.3s ease;
}

.method-buttons button.selected {
  background-color: #fff;
  color: #000;
  box-shadow: 0 4px 12px rgba(255, 204, 0, 0.6);
}

/* --- Pay Button --- */
.pay-btn {
  background-color: #ffcc00;
  color: #000;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 204, 0, 0.5);
  width: 100%;
  text-align: center;
}

.pay-btn:hover {
  background-color: #fff;
  color: #000;
  box-shadow: 0 6px 18px rgba(255, 204, 0, 0.6);
}

.pay-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
}

/* --- Responsive --- */
@media (max-width: 480px) {
  .payment-wrapper {
    padding: 1.5rem;
    align-items: center;
  }

  .payment-card {
    padding: 2rem 1.5rem;
    transform: none;
  }

  .payment-card h2 {
    font-size: 1.75rem;
  }

  .info-row {
    font-size: 1rem;
  }

  .info-row.total {
    font-size: 1.1rem;
  }

  .method-buttons button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  .pay-btn {
    padding: 0.9rem;
    font-size: 0.95rem;
  }
}
</style>
